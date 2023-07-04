const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');

// @desc   Add address to user addresses list
// @route  POST /api/v1/address
// @access Protected/User
exports.addAddress = asyncHandler(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { addresses: req.body }
    },
        { new: true }
    );

    res.status(200).json({
        status: 'success',
        message: 'Address added successfully',
        data: user.addresses,
    });
});

// @desc   Remove address from user address array
// @route  DELETE /api/v1/address
// @access Protected/User
exports.deleteAddress = asyncHandler(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: {
            addresses: { _id: req.params.addressId }
        }
    },
        { new: true }
    );

    res.status(200).json({
        status: 'success',
        message: 'Address deleted successfully',
        data: user.addresses,
    });
});

// @desc   Get logged user's wishlist
// @route  GET /api/v1/wishlist
// @access Protected/User
exports.getAddresses = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user._id).populate('addresses');

    res.status(200).json({
        status: 'success',
        results: user.addresses.length,
        data: user.addresses,
    });
});