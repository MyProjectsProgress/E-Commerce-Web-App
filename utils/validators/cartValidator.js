const { check, body } = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.createCartValidator = [
    body('cartItems')
        .isArray({ min: 1 })
        .withMessage('At least one cart item is required'),

    body('cartItems.*.product')
        .isMongoId()
        .withMessage('Invalid product ID format'),

    body('cartItems.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity should be a positive integer'),

    body('cartItems.*.color')
        .isString()
        .withMessage('Color should be a string'),

    body('cartItems.*.price')
        .isFloat({ min: 0 })
        .withMessage('Price should be a non-negative number'),

    body('totalCartPrice')
        .isNumeric({ min: 0 })
        .withMessage('Total cart price must be a non-negative number'),

    body('totalPriceAfterDiscount')
        .isNumeric({ min: 0 })
        .withMessage('Total price after discount must be a non-negative number'),

    body('user')
        .isMongoId()
        .withMessage('Invalid user ID format'),
];

exports.updateCartValidator = [
    body('cartItems')
        .optional()
        .isArray({ min: 1 })
        .withMessage('Cart items should be an array with at least one item'),

    body('cartItems.*.product')
        .optional()
        .isMongoId()
        .withMessage('Invalid product ID format'),

    body('cartItems.*.quantity')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Quantity should be a positive integer'),

    body('cartItems.*.color')
        .optional()
        .isString()
        .withMessage('Color should be a string'),

    body('cartItems.*.price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price should be a non-negative number'),

    validatorMiddleware,
];

exports.deleteCartValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid cart ID format'),

    body('cartItems.*.product')
        .isMongoId()
        .withMessage('Invalid product ID format'),

    validatorMiddleware,
];