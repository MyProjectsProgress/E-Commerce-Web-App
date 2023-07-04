const express = require('express');

const {
    createReviewValidator,
    updateReviewValidator,
    getReviewValidator,
    deleteReviewValidator,
} = require('../utils/validators/reviewValidator');

const {
    getReview,
    getReviews,
    createReview,
    updateReview,
    deleteReview,
    createFilterObj,
    setProductIdAndUserIdToBody,
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

const { protect, allowedTo } = require('../controllers/authController');

router.route('/')
    .get(createFilterObj, getReviews)
    .post(protect, allowedTo('user'), setProductIdAndUserIdToBody, createReviewValidator, createReview);

router.route('/:id')
    .get(getReviewValidator, getReview)
    .put(protect, allowedTo('user'), updateReviewValidator, updateReview)
    .delete(protect, allowedTo('admin', 'manager', 'user'), deleteReviewValidator, deleteReview);


module.exports = router;