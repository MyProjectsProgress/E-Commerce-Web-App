const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const ApiError = require('../utils/apiError');
const User = require('../models/userModel');

// to create token we pass data, the secret key and the expiration time
// each user has unique id and also the secret key both make token unique
const createToken = async (payLoad) => {
    return jwt.sign({ userId: payLoad }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_TIME });
}

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

    res.status(201).json({ data: user, token });
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
    }
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
    }

    if (!token) {
        return next(new ApiError('You are not logged in. Please, login to get access this route', 401));
    }

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
            return next(new ApiError('User has recently changed his password. Please login again..'), 401)
        }
    }

    // to access the request for next middlewares
    req.user = currentUser;

    next();
});