const { check } = require('express-validator');
const {
    validatorMiddleware,
} = require('../../middlewares/validatorMiddleware');

exports.createProductValidator = [
    check('title')
        .isLength({ min: 3 }).withMessage('Must Be at Least 3 Chars')
        .notEmpty().withMessage('Product Required'),
    check('description')
        .notEmpty().withMessage('Product Description Is Required')
        .isLength({ max: 2000 }).withMessage('Too Long Description'),
    check('quantity')
        .notEmpty().withMessage('Product Quantity Is Required')
        .isNumeric().withMessage('Product Quantity Must Be a Number'),
    check('sold')
        .optional()
        .isNumeric()
        .withMessage('Product Quantity Must Be a Number'),
    check('price')
        .notEmpty()
        .withMessage('Product Price Is Required')
        .isNumeric()
        .withMessage('Product Price Must Be a Number')
        .isLength({ max: 32 }).withMessage('Digits Must Be Less Than 32')


]