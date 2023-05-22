const slugify = require('slugify');
const { check, body } = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getBrandValidator = [
    check('id').isMongoId().withMessage("Invalid Brand ID Format"),
    validatorMiddleware,
];

exports.createBrandValidator = [
    check('name')
        .notEmpty()
        .withMessage('Brand Required')
        .isLength({ min: 3 })
        .withMessage('Too Short Brand Name')
        .isLength({ max: 32 })
        .withMessage('Too Long Brand Name')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleware,
];

exports.updateBrandValidator = [
    check('id').isMongoId().withMessage("Invalid Brand ID Format"),
    // This logic could be done as a middleware in the controller file and added to the route file 
    body('name')
        .optional()
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleware,
];

exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage("Invalid Brand ID Format"),
    validatorMiddleware,
];