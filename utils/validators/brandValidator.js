const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getBrandValidator = [
    check('id').isMongoId().withMessage("Invalid Brand ID Format"),
    validatorMiddleware,
];

exports.createBrandValidator = [
    check('name').notEmpty().withMessage('Brand Required')
        .isLength({ min: 3 }).withMessage('Too Short Brand Name')
        .isLength({ max: 32 }).withMessage('Too Long Brand Name'),
    validatorMiddleware,
];

exports.updateBrandValidator = [
    check('id').isMongoId().withMessage("Invalid Brand ID Format"),
    validatorMiddleware,
];

exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage("Invalid Brand ID Format"),
    validatorMiddleware,
];