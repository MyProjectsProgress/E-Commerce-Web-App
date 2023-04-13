const express = require('express');

const {
    getProductValidator,
    deleteProductValidator,
    updateProductValidator,
    createProductValidator
} = require('../utils/validators/productValidator');

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// const subProductsRoute = require('./subProductRoute');

const router = express.Router();

// router.use('/:productId/subcategories', subProductsRoute);

router.route('/')
    .get(getProducts)
    .post(createProductValidator, createProduct);

router.route('/:id')
    .get(getProductValidator, getProduct)
    .put(updateProductValidator, updateProduct)
    .delete(deleteProductValidator, deleteProduct);

module.exports = router;