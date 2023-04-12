const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getSubCategoryValidator = [
    check('id').isMongoId().withMessage("Invalid SubCategory ID Format"),
    validatorMiddleware,
];

exports.createSubCategoryValidator = [
    check('name').notEmpty().withMessage('SubCategory Required')
        .isLength({ min: 2 }).withMessage('Too Short SubCategory Name')
        .isLength({ max: 32 }).withMessage('Too Long SubCategory Name'),
    check('category').notEmpty().withMessage("Sub Category Must Belong to Category")
        .isMongoId().withMessage("Invalid SubCategory ID Format"),
    validatorMiddleware,
];

exports.updateSubCategoryValidator = [
    check('id').isMongoId().withMessage("Invalid SubCategory ID Format"),
    validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
    check('id').isMongoId().withMessage("Invalid SubCategory ID Format"),
    validatorMiddleware,
];