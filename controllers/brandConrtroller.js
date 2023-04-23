const Brand = require('../models/brandModel');
const factory = require('./zHandlersFactory');

// @desc   Get list of Brands
// @route  GET /api/v1/brands
// @access Public
exports.getBrands = factory.getAll(Brand);

// @desc   Get Brand By ID
// @route  GET /api/v1/brands/:id
// @access Public
exports.getBrand = factory.getOne(Brand);

// @desc   Create Brand
// @route  POST /api/v1/brands
// @access Private
exports.createBrand = factory.createOne(Brand);

// @desc   Update Brand
// @route  PUT /api/v1/brands/:id
// @access Private
exports.updateBrand = factory.updateOne(Brand);

// @desc   Delete Brand
// @route  PUT /api/v1/brands/:id
// @access Private
exports.deleteBrand = factory.deleteOne(Brand);
