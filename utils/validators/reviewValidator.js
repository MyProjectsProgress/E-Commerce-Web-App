const slugify = require('slugify');
const { check, body } = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Review = require('../../models/reviewModel');

exports.getReviewValidator = [
    check('id').isMongoId().withMessage("Invalid Review ID Format"),
    validatorMiddleware,
];

exports.createReviewValidator = [
    check('name').optional(),

    check('ratings')
        .notEmpty()
        .withMessage('Rating is required')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Rating value must be between 1 to 5'),

    check('user').isMongoId().withMessage("Invalid Review ID Format"),

    check('product')
        .isMongoId()
        .withMessage("Invalid Review ID Format")
        // here val equal to product id
        .custom(async (val, { req }) => {
            // check if logged user created a review before
            return Review.findOne({ user: req.user._id, product: req.body.product }).then((review) => {
                if (review) {
                    return Promise.reject(
                        new Error('You already created a review before')
                    );
                }
            })
        }),

    validatorMiddleware,
];

exports.updateReviewValidator = [
    check('id').isMongoId().withMessage("Invalid Review ID Format").custom((val, { req }) => {
        // checks review ownership before update
        // firstly check if it exists
        return Review.findById(val).then((review) => {
            if (!review) {
                return Promise.reject(
                    new Error(`There is no review with this id: ${val}`)
                );
            }

            // compare review's user id "review.user" with loggged user "req.user._id"
            if (review.user._id.toString() !== req.user._id.toString()) {
                return Promise.reject(
                    new Error('You are not allowed to excute this action')
                );
            }

        })
    }),
    // This logic could be done as a middleware in the controller file and added to the route file 

    validatorMiddleware,
];

exports.deleteReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage("Invalid Review ID Format")
        .custom(async (val, { req }) => {
            // checks review ownership before delete
            if (req.user.role == 'user') {
                return Review.findById(val).then((review) => {
                    if (!review) {
                        return Promise.reject(
                            new Error('You already created a review before')
                        );
                    }
                    if (review.user._id.toString() !== req.user._id, toString()) {
                        return Promise.reject(
                            new Error('You are not allowed to excute this action')
                        );
                    }
                })
            }
        }),
    validatorMiddleware,
];