const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.createProductValidator = [
    check('title')
        .isLength({ min: 3 })
        .withMessage('Must Be at Least 3 Chars')
        .notEmpty()
        .withMessage('Product Required'),
    check('description')
        .notEmpty()
        .withMessage('Product Description Is Required')
        .isLength({ max: 2000 })
        .withMessage('Too Long Description'),
    check('quantity')
        .notEmpty()
        .withMessage('Product Quantity Is Required')
        .isNumeric()
        .withMessage('Product Quantity Must Be a Number'),
    check('sold')
        .optional()
        .isNumeric()
        .withMessage('Product Quantity Must Be a Number'),
    check('price')
        .notEmpty()
        .withMessage('Product Price Is Required')
        .isNumeric()
        .withMessage('Product Price Must Be a Number')
        .isLength({ max: 32 }).withMessage('Digits Must Be Less Than 32'),
    check('priceAfterDiscount')
        .optional()
        .toFloat()
        .isNumeric()
        .withMessage('Product Price After Discount Must Be a Number')
        .custom((value, { req }) => { // value comes from body
            if (req.body.price <= value) {
                throw new Error('Price After Discount Must Be Lower Than Price');
            }
            return true;
        }),
    check('colors')
        .optional()
        .isArray()
        .withMessage('Images Should Be Array of Strings'),
    check('category')
        .notEmpty()
        .withMessage('Invalid ID Format'),
    check('subcategory')
        .optional()
        .isMongoId()
        .withMessage('Invalid ID Format'),
    check('brand')
        .optional()
        .isMongoId()
        .withMessage('Invalid ID Format'),
    check('ratingsAverage')
        .optional()
        .isNumeric()
        .withMessage('Ratings Average Must Be a Number')
        .isLength({ min: 1 })
        .withMessage('Rating Must Be from 1 to 5')
        .isLength({ max: 5 })
        .withMessage('Rating Must Be from 1 to 5'),
    check('ratingsQuantity')
        .optional()
        .isNumeric()
        .withMessage('Ratings Quantity Must Be a Number'),

    validatorMiddleware,
];

exports.updateProductValidator = [
    check('id').isMongoId().withMessage('Invalid ID Format'),
    validatorMiddleware,
];

exports.deleteProductValidator = [
    check('id').isMongoId().withMessage('Invalid ID Format'),
    validatorMiddleware,
];

exports.getProductValidator = [
    check('id').isMongoId().withMessage("Invalid Category ID Format"),
    validatorMiddleware,
];