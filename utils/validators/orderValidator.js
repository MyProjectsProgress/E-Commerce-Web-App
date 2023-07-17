const { check, body } = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.createCashOrderValidator = [
    check('user')
        .notEmpty()
        .withMessage('User is required'),

    check('taxPrice')
        .isNumeric()
        .withMessage('Tax price must be a numeric value'),

    check('shippingPrice')
        .isNumeric()
        .withMessage('Shipping price must be a numeric value'),

    check('shippingAddress.phone')
        .isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage('Invalid Phone Number Only Accept EG and SA Phone Numbers'),

    check('totalOrderPrice')
        .isNumeric()
        .withMessage('Total order price must be a numeric value'),

    check('paymentType')
        .isIn(['card', 'cash'])
        .withMessage('Payment type must be either "card" or "cash"'),

    validatorMiddleware
];

exports.validateOrderId = [
    check('id')
        .notEmpty()
        .withMessage('Order ID is required'),
];