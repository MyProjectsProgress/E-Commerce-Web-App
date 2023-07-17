const { check, body } = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

// Create Address Validator
exports.createAddressValidator = [

    body('addresses.*.alias')
        .trim(),

    body('addresses.*.details')
        .trim(),

    body('addresses.*.phone')
        .optional()
        .isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage('Invalid Phone Number Only Accept EG and SA Phone Numbers'),

    body('addresses.*.city')
        .trim(),

    validatorMiddleware,
];

exports.updateAddressValidator = [
    body('addresses.*.id')
        .isMongoId()
        .withMessage('Invalid address ID format'),

    body('addresses.*.alias')
        .trim(),

    body('addresses.*.details')
        .trim(),

    body('addresses.*.phone')
        .optional()
        .isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage('Invalid Phone Number Only Accept EG and SA Phone Numbers'),

    body('addresses.*.postalCode')
        .optional(),

    body('addresses.*.city')
        .trim(),

    validatorMiddleware,
];

exports.deleteAddressValidator = [
    body('addresses.*.id')
        .isMongoId()
        .withMessage('Invalid address ID format'),

    validatorMiddleware,
];