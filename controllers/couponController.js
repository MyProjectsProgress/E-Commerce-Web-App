const factory = require('./zHandlersFactory');
const Coupon = require('../models/couponModel');

// @desc   Get list of Coupons
// @route  GET /api/v1/Coupons
// @access Public
exports.getCoupons = factory.getAll(Coupon);

// @desc   Get Coupon By ID
// @route  GET /api/v1/coupons/:id
// @access Private/Admin-Manager
exports.getCoupon = factory.getOne(Coupon);

// @desc   Create Coupon
// @route  POST /api/v1/coupons
// @access Private/Admin-Manager
exports.createCoupon = factory.createOne(Coupon);

// @desc   Update Coupon
// @route  PUT /api/v1/coupons/:id
// @access Private/Admin-Manager
exports.updateCoupon = factory.updateOne(Coupon);

// @desc   Delete Coupon
// @route  PUT /api/v1/coupons/:id
// @access Private/Admin-Manager
exports.deleteCoupon = factory.deleteOne(Coupon);
