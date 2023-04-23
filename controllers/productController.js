const Product = require('../models/productModel');
const factory = require('./zHandlersFactory');

// @desc   Get list of Products
// @route  GET /api/v1/products
// @access Public
exports.getProducts = factory.getAll(Product, 'Products');

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
