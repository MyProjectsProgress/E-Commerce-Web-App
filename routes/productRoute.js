const express = require('express');

const {
    getProductValidator,
    createProductValidator,
    updateProductValidator,
    deleteProductValidator,
} = require('../utils/validators/productValidator');

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    productImageProcessing,
} = require('../controllers/productController');

const { protect, allowedTo } = require('../controllers/authController');

const reviewsRoute = require('../routes/reviewRoute');

const router = express.Router();

router.use('/:productId/reviews', reviewsRoute);

router.route('/')
    .get(getProducts)
    .post(protect, allowedTo('admin', 'manager'), uploadProductImages, productImageProcessing, createProductValidator, createProduct);

router.route('/:id')
    .get(getProductValidator, getProduct)
    .put(protect, allowedTo('admin', 'manager'), uploadProductImages, productImageProcessing, updateProductValidator, updateProduct)
    .delete(protect, allowedTo('admin'), deleteProductValidator, deleteProduct);

module.exports = router;