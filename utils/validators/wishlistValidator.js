const { check, body } = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.deleteWishlistProductValidator = [
    body('productId')
        .isMongoId()
        .withMessage('Invalid product ID format'),

    validatorMiddleware,
];