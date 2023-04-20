const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const SubCategory = require('../models/subCategoryModel');
const factory = require('./zHandlersFactory');


exports.setCategoryIdToBody = (req, res, next) => {
    // NESTED ROUTE
    if (!req.params.category) req.body.category = req.params.categoryId; // TAKE CARE YOU SET HERE A VALUE OF THE BODY
    next();
};

// @desc   Create subCategory
// @route  POST /api/v1/subsubCategory
// @access Private
exports.createSubCategory = factory.createOne(SubCategory);

// NESTED ROUTE
// GET /api/v1/categories/:categoryID/subcategories
// GET /api/v1/categories/:productID/reviews => ana hena ba2olo ana 3ayez kol el reviews elli 3al product dh
exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId) filterObject = { category: req.params.categoryId }; // get data based on this specific category id
    req.filterObj = filterObject;
    next();
};


// @desc   Get list of subCategories
// @route  GET /api/v1/subCategories
// @access Public
exports.getSubCategories = asyncHandler(async (req, res, next) => {

    // Build Query
    const documentCounts = await SubCategory.countDocuments();
    const apiFeatures = new ApiFeatures(SubCategory.find(), req.query)
        .filter()
        .paginate(documentCounts)
        .sort()
        .limitFileds()
        .search();

    // Excute Query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const subCategories = await mongooseQuery;

    res.status(200).json({ results: subCategories.length, paginationResult, data: subCategories });
});

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
