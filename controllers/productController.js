const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const Product = require('../models/productModel');

// @desc   Get list of Products
// @route  GET /api/v1/products
// @access Public
exports.getProducts = asyncHandler(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;

    const products = await Product.find({}).skip(skip).limit(limit).populate({ path: 'category', select: 'name' });
    res.status(200).json({ results: products.length, data: products });
});

// @desc   Get Product By ID
// @route  GET /api/v1/products/:id
// @access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate({ path: 'category', select: 'name' });
    if (!product) {
        return next(new ApiError(`No Product for This ID: ${id}`, 404));
    }
    res.status(200).json({ data: product });
});

// @desc   Create Product
// @route  POST /api/v1/products
// @access Private
exports.createProduct = asyncHandler(async (req, res, next) => {
    req.body.slug = slugify(req.body.title);
    // async await
    const product = await Product.create(req.body);
    res.status(201).json({ data: product });
});

// @desc   Update Product
// @route  PUT /api/v1/products/:id
// @access Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // IMPORTANT ERORR: check if you fif change the title but in create we don't need to do that as it is mandatory to create a title.
    if (req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
    const product = await Product.findOneAndUpdate({ _id: id }, req.body, { new: true });

    if (!product) {
        return next(new ApiError(`No Product for This ID: ${id}`, 404));
    }

    res.status(200).json({ data: product });
});

// @desc   Delete Product
// @route  PUT /api/v1/products/:id
// @access Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
        return next(new ApiError(`No Product for This ID: ${id}`, 404));
    }

    res.status(204).send();
});