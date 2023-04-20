const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const Brand = require('../models/brandModel');
const factory = require('./zHandlersFactory');


// @desc   Get list of Brands
// @route  GET /api/v1/brands
// @access Public
exports.getBrands = asyncHandler(async (req, res, next) => {
    // Build Query
    const documentCounts = await Brand.countDocuments();
    const apiFeatures = new ApiFeatures(Brand.find(), req.query)
        .filter()
        .paginate(documentCounts)
        .sort()
        .limitFileds()
        .search();

    // Excute Query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const brands = await mongooseQuery;

    res.status(200).json({ results: brands.length, paginationResult, data: brands });
});

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
