const factory = require('./zHandlersFactory');
const SubCategory = require('../models/subCategoryModel');


/**
 * this function is added before validation layer of create new subcategory, why?
 * to set the 'category' parameter to the categoryId that is passed from the api/v1/categories/categoryId/subcategories
 * so that we solve the problem that when we create a new sucategory using this route we have the 'category' field is set to a value
 */
// MIDDLEWARE
exports.setCategoryIdToBody = (req, res, next) => {
    // NESTED ROUTE
    if (!req.params.category) req.body.category = req.params.categoryId; // TAKE CARE YOU SET HERE A VALUE OF THE BODY
    next();
};

// NESTED ROUTE
// GET /api/v1/categories/:categoryID/subcategories
// GET /api/v1/categories/:productID/reviews => ana hena ba2olo ana 3ayez kol el reviews elli 3al product dh
/**
 * this function is added before validation layer of get all subcategories, why?
 * to set the 'category' parameter to the categoryId that is passed from the api/v1/categories/categoryId/subcategories
 * so that we solve the problem that when we get  sucategories using this route we have the 'filterObj' field is set to a value
 * and finally we use Model.find(req.params.filterObj)
 */
// MIDDLEWARE
exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId) filterObject = { category: req.params.categoryId }; // get data based on this specific category id
    req.filterObj = filterObject;
    next();
};

// @desc   Create subCategory
// @route  POST /api/v1/subsubCategory
// @access Private
exports.createSubCategory = factory.createOne(SubCategory);

// @desc   Get list of subCategories
// @route  GET /api/v1/subCategories
// @access Public
exports.getSubCategories = factory.getAll(SubCategory);

// @desc   Get Category By ID
// @route  GET /api/v1/subCategory/:id
// @access Public
exports.getSubCategory = factory.getOne(SubCategory);

// @desc   Update Subcategory
// @route  PUT /api/v1/subcategories/:id
// @access Private
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc   Delete Subcategory
// @route  PUT /api/v1/subcategories/:id
// @access Private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
