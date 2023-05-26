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

const { protect, allowedTo } = require('../controllers/authController');

const subCategoriesRoute = require('./subCategoryRoute');

const router = express.Router();

// this route is accessed in the subcategory route using mergeparams: true
// if this resource came to you , go ahead and use "subCategoriesRoute"
/**
 * AGAIN:
 * 1- if the user wants to get all subcategories under a specific category it hits the route api/v1/categories/categoryId/subcategories
 * 2- then we use this route and consume subCategoriesRoute
 * 3- in subcategories route we create filter object and pass it to .find() method
 * 4- if the id is passed, then filter object will be { category: req.params.categoryId } but if not the filter objcet will be {}
 */
router.use('/:categoryId/subcategories', subCategoriesRoute);

router.route('/')
    .get(getCategories)
    .post(protect, allowedTo('admin', 'manager'), uploadCategoryImage, imageProcessing, createCategoryValidator, createCategory);

router.route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(protect, allowedTo('admin', 'manager'), uploadCategoryImage, imageProcessing, updateCategoryValidator, updateCategory)
    .delete(protect, allowedTo('admin'), deleteCategoryValidator, deleteCategory);

module.exports = router;