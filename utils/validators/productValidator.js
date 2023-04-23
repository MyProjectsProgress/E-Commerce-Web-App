const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Catgeroy = require('../../models/categoryModel');
const SubCategory = require('../../models/subCategoryModel');

exports.createProductValidator = [
    check('title')
        .isLength({ min: 3 })
        .withMessage('Must Be at Least 3 Chars')
        .notEmpty()
        .withMessage('Product Required')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
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
        // Parameters: price after discount and req is destructing the request so we have the whole request paramters.
        // flashing error if the price after discount is bigger than the price before discount.
        .custom((priceAfterDiscountBody, { req }) => {
            if (req.body.price <= priceAfterDiscountBody) {
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
        .withMessage('Invalid ID Format')
        .custom((categoryId) => Catgeroy.findById(categoryId).then((category) => {
            if (!category) {
                return Promise.reject(new Error(`No Category For This ID ${categoryId}`));
            }
        })
        ),
    check('subcategories')
        .optional()
        .isMongoId()
        .withMessage('Invalid ID Format')
        // Making sure that the retrived idscontains the subcategories id that comes from creation request.
        .custom((subcategoriesIds) => SubCategory.find({ _id: { $exists: true, $in: subcategoriesIds } }).then((result) => {
            if (result.length < 1 || result.length !== subcategoriesIds.length) {
                return Promise.reject(new Error(`Invalid Subcategories IDs`));
            }
        }))
        // Making sure that the added subcategories belong to the category given in the request.
        .custom((BodySubCategoriesIDs, { req }) => SubCategory.find({ category: req.body.category }).then((subcategories => {
            const subCategoriesIDinDB = [];
            subcategories.forEach((subCategory) => {
                subCategoriesIDinDB.push(subCategory._id.toString());
            });
            const checker = (target, arr) => BodySubCategoriesIDs.every(ID => arr.includes(ID));
            if (!checker(BodySubCategoriesIDs, subCategoriesIDinDB)) {
                return Promise.reject(new Error(`Subcategories IDs Doesn't Belong To The Category ID`));
            }
        }))),
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