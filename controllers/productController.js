const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const Product = require('../models/productModel');

// @desc   Get list of Products
// @route  GET /api/v1/products
// @access Public
exports.getProducts = asyncHandler(async (req, res, next) => {

    // 1- FILTERING  2- PAGINATION 3- SORTING 4- FIELDS LIMITING 5- SEARCHING

    // Build Query
    const apiFeatures = new ApiFeatures(Product.find(), req.query)
        .filter()
        .paginate()
        .sort()
        .limitFileds()
        .search();

    // Excute Query
    const products = await apiFeatures.mongooseQuery; // await excute the query we have just build
    // Side Note: The separation of querty building and excution for the sake of scalable code.

    res.status(200).json({ results: products.length, data: products });

    // .populate({ path: 'category', select: 'name' })
});

// @desc   Get Product By ID
// @route  GET /api/v1/products/:id
// @access Public
exports.getProduct = asyncHandler(async (req, res, next) => {

    const { id } = req.params;

    const product = await Product.findById(id)
        .populate({ path: 'category', select: 'name' });

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