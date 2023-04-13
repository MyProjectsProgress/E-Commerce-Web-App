const express = require('express');

const {
    getBrandValidator,
    deleteBrandValidator,
    updateBrandValidator,
    createBrandValidator
} = require('../utils/validators/brandValidator');

const {
    getBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand
} = require('../controllers/brandConrtroller');

const router = express.Router();

router.route('/')
    .get(getBrands)
    .post(createBrandValidator, createBrand);

router.route('/:id')
    .get(getBrandValidator, getBrand)
    .put(updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand);

module.exports = router;