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
} = require('../controllers/brandConrtroller');

const router = express.Router();

router.route('/')
    .get(getBrands)
    .post(uploadBrandImage, imageProcessing, createBrandValidator, createBrand);

router.route('/:id')
    .get(getBrandValidator, getBrand)
    .put(uploadBrandImage, imageProcessing, updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand);

module.exports = router;