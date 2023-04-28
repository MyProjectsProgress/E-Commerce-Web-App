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

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(uploadProductImages, productImageProcessing, createProductValidator, createProduct);

router.route('/:id')
    .get(getProductValidator, getProduct)
    .put(uploadProductImages, productImageProcessing, updateProductValidator, updateProduct)
    .delete(deleteProductValidator, deleteProduct);

module.exports = router;