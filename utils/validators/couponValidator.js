const { check, body } = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getCouponValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid category ID format'),

    validatorMiddleware,
];

exports.createCouponValidator = [
    check('name')
        .isEmpty()
        .withMessage('Coupon name is required'),

    check('expire')
        .isDate()
        .withMessage('Invalid Date Format'),

    check('discount')
        .isEmpty()
        .withMessage('Copoun discount vaue is required'),

    validatorMiddleware,
];

exports.updateCouponValidator = [
    check('expire')
        .isDate()
        .withMessage('Invalid Date Format'),

    validatorMiddleware,
];

exports.deleteCouponValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid coupon ID format'),

    validatorMiddleware,
];