const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const Brand = require('../models/brandModel');


// @desc   Get list of Brands
// @route  GET /api/v1/brands
// @access Public
exports.getBrands = asyncHandler(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const brands = await Brand.find({}).skip(skip).limit(limit);
    res.status(200).json({ results: brands.length, data: brands });
});

// @desc   Get Brand By ID
// @route  GET /api/v1/brands/:id
// @access Public
exports.getBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand) {
        return next(new ApiError(`No Brand for This ID: ${id}`, 404));
    }
    res.status(200).json({ data: brand });
});

// @desc   Create Brand
// @route  POST /api/v1/brands
// @access Private
exports.createBrand = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    // async await
    const brand = await Brand.create({ name, slug: slugify(name) });
    res.status(201).json({ data: brand });
});

// @desc   Update Brand
// @route  PUT /api/v1/brands/:id
// @access Private
exports.updateBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    const brand = await Brand.findOneAndUpdate({ _id: id }, { name, slug: slugify(name) }, { new: true });

    if (!brand) {
        return next(new ApiError(`No Brand for This ID: ${id}`, 404));
    }

    res.status(200).json({ data: brand });
});

// @desc   Delete Brand
// @route  PUT /api/v1/brands/:id
// @access Private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);

    if (!brand) {
        return next(new ApiError(`No Brand for This ID: ${id}`, 404));
    }

    res.status(204).send();
});