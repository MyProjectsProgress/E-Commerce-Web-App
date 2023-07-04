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
        .isNumeric()
        .withMessage('Product Price After Discount Must Be a Number')
        .toFloat()
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
        // checking if the category id that the product belong to exists in the database or not
        .custom((categoryId) => Catgeroy.findById(categoryId).then((category) => {
            if (!category) {
                return Promise.reject(new Error(`No Category For This ID: ${categoryId}`));
            }
        })
        ),

    check('subcategories')
        .optional()
        .isMongoId()
        .withMessage('Invalid ID Format')
        // Making sure that subcategories ids exist in subcategories database.
        // $exists operator: returns all subcategories tha have IDs "Which are all the subcategories".
        // $in operator: returns the subcategories that contains ids matches with the product subcategory id.
        // finally we check if the number of returned subcategories match with the number of given ids or not.
        .custom((subcategoriesIds) => SubCategory.find({ _id: { $exists: true, $in: subcategoriesIds } }).then((result) => {
            if (result.length < 1 || result.length !== subcategoriesIds.length) {
                return Promise.reject(new Error(`Invalid Subcategories IDs`));
            }
        }))

        // Making sure that the added subcategories belong to the category given in the request.
        /**
         *  SubCategory.find({ category: req.body.category }) => gets all the subcategories that refers to what the product refers to.
         * .then((subcategories => ... ) => (1) & (2)
         */
        .custom((bodySubCategoriesIDs, { req }) => SubCategory.find({ category: req.body.category }).then((subcategories => {
            const subCategoriesIDinDB = [];
            // (1) to get array of IDs of subcategories that refer to the same category that the product refer to 
            subcategories.forEach((subCategory) => {
                subCategoriesIDinDB.push(subCategory._id.toString());
            });
            // (2) check for each ID retrieved from the body check if it exists in the IDs retrieved from database
            const checker = (target, arr) => target.every(ID => arr.includes(ID));
            if (!checker(bodySubCategoriesIDs, subCategoriesIDinDB)) {
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
    body('name')
        .optional()
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleware,
];

exports.deleteProductValidator = [
    check('id').isMongoId().withMessage('Invalid ID Format'),
    validatorMiddleware,
];

exports.getProductValidator = [
    check('id').isMongoId().withMessage("Invalid Product ID Format"),
    validatorMiddleware,
];