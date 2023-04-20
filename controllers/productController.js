const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const Product = require('../models/productModel');
const factory = require('./zHandlersFactory');

// @desc   Get list of Products
// @route  GET /api/v1/products
// @access Public
exports.getProducts = asyncHandler(async (req, res, next) => {

    // 1- FILTERING  2- PAGINATION 3- SORTING 4- FIELDS LIMITING 5- SEARCHING

    // Build Query
    const documentCounts = await Product.countDocuments();
    const apiFeatures = new ApiFeatures(Product.find(), req.query)
        .filter()
        .paginate(documentCounts)
        .sort()
        .limitFileds()
        .search('Products');

    // Excute Query
    // "await" excutes the query we have just build
    // Side Note: The separation of query building and excution for the sake of scalable code.
    const { mongooseQuery, paginationResult } = apiFeatures;
    const products = await mongooseQuery;

    res.status(200).json({ results: products.length, paginationResult, data: products });

    // .populate({ path: 'category', select: 'name' })
});

// @desc   Get Product By ID
// @route  GET /api/v1/products/:id
// @access Public
exports.getProduct = factory.getOne(Product);

// @desc   Create Product
// @route  POST /api/v1/products
// @access Private
exports.createProduct = factory.createOne(Product);

// @desc   Update Product
// @route  PUT /api/v1/products/:id
// @access Private
exports.updateProduct = factory.updateOne(Product);

// @desc   Delete Product
// @route  PUT /api/v1/products/:id
// @access Private
exports.deleteProduct = factory.deleteOne(Product);
