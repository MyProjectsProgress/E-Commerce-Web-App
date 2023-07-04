const factory = require('./zHandlersFactory');
const Review = require('../models/reviewModel');

// MIDDLEWARE
exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.productId) filterObject = { product: req.params.productId }; // get data based on this specific product id
    req.filterObj = filterObject;
    next();
};

// @desc   Get list of reviews
// @route  GET /api/v1/reviews
// @access Public
exports.getReviews = factory.getAll(Review);

// @desc   Get Review By ID
// @route  GET /api/v1/reviews/:id
// @access Public
exports.getReview = factory.getOne(Review);

exports.setProductIdAndUserIdToBody = (req, res, next) => {
    if (!req.body.product) {
        req.body.product = req.params.productId;
    }

    if (!req.body.user) {
        req.body.user = req.user._id;
    }

    next();
}


// @desc   Create Review
// @route  POST /api/v1/reviews
// @access Private/protect/user
exports.createReview = factory.createOne(Review);

// @desc   Update Review
// @route  PUT /api/v1/reviews/:id
// @access Private/protect/user
exports.updateReview = factory.updateOne(Review);

// @desc   Delete Review
// @route  PUT /api/v1/reviews/:id
// @access Private/protect/user
exports.deleteReview = factory.deleteOne(Review);
