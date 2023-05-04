const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const jwt = require('jsonwebtoken');

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
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_TIME });

    res.status(201).json({ data: user, token });
});