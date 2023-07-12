const express = require('express');

const {
    getBrandValidator,
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator,
} = require('../utils/validators/brandValidator');

const {
    getBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand,
    imageProcessing,
    uploadBrandImage,
} = require('../controllers/brandController');

const { protect, allowedTo } = require('../controllers/authController');

const router = express.Router();

router.route('/')
    .get(getBrands)
    .post(protect, allowedTo('admin', 'manager'), uploadBrandImage, imageProcessing, createBrandValidator, createBrand);

router.route('/:id')
    .get(getBrandValidator, getBrand)
    .put(protect, allowedTo('admin', 'manager'), uploadBrandImage, imageProcessing, updateBrandValidator, updateBrand)
    .delete(protect, allowedTo('admin'), deleteBrandValidator, deleteBrand);

module.exports = router;