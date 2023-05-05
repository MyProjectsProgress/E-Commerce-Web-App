const express = require('express');

const {
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator,
} = require('../utils/validators/categoryValidator');

const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
    imageProcessing,
} = require('../controllers/categoryController');

const authController = require('../controllers/authController');

const subCategoriesRoute = require('./subCategoryRoute');

const router = express.Router();

router.use('/:categoryId/subcategories', subCategoriesRoute);

router.route('/')
    .get(getCategories)
    .post(authController.protect, uploadCategoryImage, imageProcessing, createCategoryValidator, createCategory);

router.route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(uploadCategoryImage, imageProcessing, updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;