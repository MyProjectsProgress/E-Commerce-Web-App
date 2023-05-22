const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getSubCategoryValidator = [
    check('id')
        .isMongoId()
        .withMessage("Invalid Sub-category ID Format"),
    validatorMiddleware,
];

exports.createSubCategoryValidator = [
    check('name')
        .notEmpty()
        .withMessage('Sub-category is required')
        .isLength({ min: 2 })
        .withMessage('Too short sub-category name')
        .isLength({ max: 32 })
        .withMessage('Too long sub-category name')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check('category')
        .notEmpty()
        .withMessage("Sub-category must belong to category")
        .isMongoId()
        .withMessage("Invalid Sub-category ID Format"),

    validatorMiddleware,
];

exports.updateSubCategoryValidator = [
    check('id').
        isMongoId()
        .withMessage("Invalid Sub-category ID Format"),
    validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
    check('id')
        .isMongoId()
        .withMessage("Invalid Sub-category ID Format"),
    validatorMiddleware,
];