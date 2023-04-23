const Category = require('../models/categoryModel');
const factory = require('./zHandlersFactory');

// @desc   Get list of Categories
// @route  GET /api/v1/categories
// @access Public
exports.getCategories = factory.getAll(Category);

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
