const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

const factory = require('./zHandlersFactory');
const ApiError = require('../utils/apiError');
const createToken = require('../utils/createToken');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const User = require('../models/userModel');

// multer middleware that uploads single file
exports.uploadUserImage = uploadSingleImage('profileImg');

// this part is not refactorered as a lot of arguments would be added
exports.imageProcessing = asyncHandler(async (req, res, next) => {

    const randomID = uuidv4();
    const filename = `user-${randomID}-${Date.now()}.jpeg`;

    // sharp is node.js library for image processing 
    // withMetadata: to solve the problem of rotation of image after resizing to retain the exif data that includes the correct orientation of the image
    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .withMetadata()
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/users/${filename}`);

        //save image into DB
        req.body.profileImg = filename;
    }

    next();
});

// @desc   Get list of Users
// @route  GET /api/v1/users
// @access Private
exports.getUsers = factory.getAll(User);

// @desc   Get User By ID
// @route  GET /api/v1/users/:id
// @access Private/Admin-Manager
exports.getUser = factory.getOne(User);

// @desc   Create User
// @route  POST /api/v1/users
// @access Private/Admin
exports.createUser = factory.createOne(User);

// @desc   Delete User
// @route  PUT /api/v1/users/:id
// @access Private/Admin
exports.deleteUser = factory.deleteOne(User);

// @desc   Update User
// @route  PUT /api/v1/users/:id
// @access Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {

    // updating all fields but password
    const document = await User.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            slug: req.body.slug,
            phone: req.body.phone,
            email: req.body.email,
            profileImg: req.body.profileImg,
            role: req.body.role,
        },
        { new: true });

    if (!document) {
        return next(new ApiError(`No Document for This ID: ${id}`, 404));
    }

    res.status(200).json({ data: document });
});

// @desc   Update User Password
// @route  PUT /api/v1/users/:id
// @access Private/Admin
exports.changeUserPassword = asyncHandler(async (req, res, next) => {

    const document = await User.findByIdAndUpdate(req.params.id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        { new: true });

    if (!document) {
        return next(new ApiError(`No Document for This ID`, 404));
    }

    res.status(200).json({ data: document });
});

// @desc   Get Logged User Data
// @route  GET /api/v1/users/getMe
// @access Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
});

// @desc   Update Logged User Password
// @route  PUT /api/v1/users/updateMyPassword
// @access Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    // update user password based on user payload (req.user._id) as user is logged
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        { new: true }
    );

    // generate new token for the user ba2a
    const token = await createToken(user._id);

    res.status(200).json({ data: user, token });
});

// @desc   Update Logged User Data
// @route  PUT /api/v1/users/updateMe
// @access Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
    // new is true to send the updated data in the response no the old data
    const userUpdated = await User.findByIdAndUpdate(req.user._id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    }, { new: true });

    if (!userUpdated) {
        return next(new ApiError(`No user for this ID: ${req.user._id}`, 404));
    };
    res.status(200).json({ data: userUpdated });
});

// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });

    res.status(204).json({ status: 'Success' });
});