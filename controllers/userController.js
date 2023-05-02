const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

const factory = require('./zHandlersFactory');
const ApiError = require('../utils/apiError');
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
// @access Private
exports.getUser = factory.getOne(User);

// @desc   Create User
// @route  POST /api/v1/users
// @access Private
exports.createUser = factory.createOne(User);

// @desc   Update User
// @route  PUT /api/v1/users/:id
// @access Private
exports.updateUser = asyncHandler(async (req, res, next) => {

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

exports.changeUserPassword = asyncHandler(async (req, res, next) => {

    const document = await User.findByIdAndUpdate(req.params.id,
        {
            password: await bcrypt.hash(req.body.password, 12),
        },
        { new: true });

    if (!document) {
        return next(new ApiError(`No Document for This ID`, 404));
    }

    res.status(200).json({ data: document });
});

// @desc   Delete User
// @route  PUT /api/v1/users/:id
// @access Private
exports.deleteUser = factory.deleteOne(User);
