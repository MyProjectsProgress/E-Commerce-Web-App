const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const createToken = require('../utils/createToken');
const sendEmail = require('../utils/sendEmail');
const { sanitizeUser } = require('../utils/sanitizeData');
const ApiError = require('../utils/apiError');
const User = require('../models/userModel');


// @desc   Signup
// @route  GET /api/v1/auth/signup
// @access Public
exports.signup = asyncHandler(async (req, res, next) => {
    // 1- Create User
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    // 2- Generate Json Web Token
    // token consists of three parts: headers, data, security checl jwt.io
    const token = await createToken(user._id);

    res.status(201).json({ data: sanitizeUser(user), token });
});

// @desc   Login
// @route  GET /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
    // 1- check if password and email in the body (validation layer)
    // 2- check if user exist & check if password matches the password user password in database
    const user = await User.findOne({ email: req.body.email });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        // can't clearify that the problem in the password only to not allow user to keep trying different passwords
        return next(new ApiError('Incorrect Email Or Password', 401));
    };
    // 3- generate token 
    const token = await createToken(user._id);

    // 4- send response to client side
    res.status(200).json({ data: user, token });

});

// @desc    make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
    // 1- Check if token exist, if true get it
    let token;
    // making sure authorization exist with bearer keyword
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // accessing token
        token = req.headers.authorization.split(' ')[1];
    };

    if (!token) {
        return next(new ApiError('You are not logged in. Please, login to get access this route', 401));
    };

    // 2- Verify token (no change is made in payload, expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // returns the payload of the token "_id"

    // 3- Check if user exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
        return next(new ApiError('User that belong to this token does no longer exist', 401));
    }

    // 4- Check if user change his password after token is created 
    if (currentUser.passwordChangedAt) {
        // if user changed password then we parse the time changed at then convert it to seconds from ms
        const passwordChangedTimeStamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);

        // if true "time of changing password is after his token creation" so password changed after token created (Error, user must login again so we redirect user to the login page)
        if (passwordChangedTimeStamp > decoded.iat) {
            return next(new ApiError('User has recently changed his password. Please login again..'), 401);
        };
    };

    // to access the request for next middleware "allowedTo"
    req.user = currentUser;

    next();
});

// @ desc   Authorization (User Permissions)
// roles: ['admin', 'manager']
// (..roles) is a function that return async middleware
// closures 
exports.allowedTo = (...roles) => asyncHandler(async (req, res, next) => {
    // 1- access roles
    // 2- access registered user
    if (!roles.includes(req.user.role)) {
        return next(new ApiError('You are not allowed to access this route', 403));
    };

    next();
});


// @desc   Login
// @route  POST /api/v1/auth/login
// @access Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
    // 1- Get user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(`There is no user with that email: ${req.body.email}`, 404));
    };
    // 2- if user exists "email in database", generate 6 digits radnomly and save it in db then hash them
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const cryptedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');

    // save hashed password reset code into database
    user.passwordResetCode = cryptedResetCode;

    // add expiration time for password reset code "10 minute"
    user.passwordResetExpiration = Date.now() + 10 * 60 * 1000;

    // verify vode is false by default
    user.passwordResetVerification = false;

    await user.save();

    const message =
        `Hi ${user.name}, \n
        We recieved a request to reset the password on your E-shop Account. \n
        ${resetCode} \n
        Enter this code to complete the reset. \n
        Tahnks for helping us keep your account secure
        The E-shop Team
        `;
    // Playing arround with my friends
    //     `Hi ${user.name}, \n
    //     We noticed your efforts and knowledge regarding the global climate issue through the form and we decided to give you a paid intern in our company.\n
    //     Please check this link for further information: https://docs.google.com/document/d/1RKdTW12M6go9eSSgeeGLCzjL_QrgP6_uqj-FhPsZyqU/edit?usp=sharing\n
    //     Green Climate Fund Org Team.
    // `;

    // 3- Send the reset code via email 
    // asyncHandler catches error by try catch here is used to set the attributes to undefined to not be stored in database and the response is failed asln!
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your Password Reset  Code (Valid For 10 Minutes)',
            // subject: 'Congratulations!, You are accepted in Green Climate Fund Internship!',
            message: message,
        });

    } catch (error) {
        user.passwordResetCode = undefined;
        user.passwordResetExpiration = undefined;
        user.passwordResetVerification = undefined;

        await user.save();
        return (new ApiError('There is an error in sending email'));
    };

    res.status(200).json({ status: 'success', message: 'Reset code is sent via email' });
});

// @desc   Verify Password Reset code
// @route  POST /api/v1/auth/verifyResetCode
// @access Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
    // 1- get user based on his reset code that is encrypted

    // crypting the body reset code to compare to the one in database
    const cryptedResetCode =
        crypto.createHash('sha256')
            .update(req.body.resetCode)
            .digest('hex');

    // getting the user based on the reset code and checking its expiraiton validity
    const user = await User.findOne({
        passwordResetCode: cryptedResetCode,
        passwordResetExpiration: { $gte: Date.now() },
    });

    if (!user) {
        return next(new ApiError('Reset code invalid or expired'));
    };

    user.passwordResetVerification = true;

    await user.save();

    res.status(200).json({
        status: 'success',
    });
});

// @desc   Reset Password
// @route  POST /api/v1/auth/resetPassword
// @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // get user based on email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ApiError(`There is no user with this email: ${req.body.email}`, 404));
    };

    // check if reset code is veified
    if (!user.passwordResetVerification) {
        return next(new ApiError('Reset code is not verified', 400));
    };

    // if verified update the reset values to undefined
    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpiration = undefined;
    user.passwordResetVerification = undefined;

    await user.save();

    // generate new token for the user ba2a
    const token = await createToken(user._id);

    res.status(200).json({ token: token });
});