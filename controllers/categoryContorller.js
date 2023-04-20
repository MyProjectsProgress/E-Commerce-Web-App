const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const Category = require('../models/categoryModel');
const factory = require('./zHandlersFactory');

// @desc   Get list of Categories
// @route  GET /api/v1/categories
// @access Public
exports.getCategories = asyncHandler(async (req, res, next) => {
    // Build Query
    const documentCounts = await Category.countDocuments();
    const apiFeatures = new ApiFeatures(Category.find(), req.query)
        .filter()
        .paginate(documentCounts)
        .sort()
        .limitFileds()
        .search();

    // Excute Query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const categories = await mongooseQuery;

    res.status(200).json({ results: categories.length, paginationResult, data: categories });
});

// @desc   Get Category By ID
// @route  GET /api/v1/categories/:id
// @access Public
exports.getCategory = factory.getOne(Category);

// @desc   Create Category
// @route  POST /api/v1/categories
// @access Private
exports.createCategory = factory.createOne(Category);

// @desc   Update Category
// @route  PUT /api/v1/categories/:id
// @access Private
exports.updateCategory = factory.updateOne(Category);

// @desc   Delete Category
// @route  PUT /api/v1/categories/:id
// @access Private
exports.deleteCategory = factory.deleteOne(Category);
