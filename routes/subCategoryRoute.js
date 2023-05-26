const express = require('express');

// HANDLER
const {
    createSubCategory,
    getSubCategories,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory,
    setCategoryIdToBody,
    createFilterObj,
} = require('../controllers/subCategoryController');

const {
    createSubCategoryValidator,
    getSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator,
} = require('../utils/validators/subCategoryValidator');

const { protect, allowedTo } = require('../controllers/authController');

// mergeParams : allows us to access parameters on other routers
// ex: we need to access category id from category router.
// we access categoryId here: router.use('/:categoryId/subcategories', subCategoriesRoute);
// simply it access categoryId that is passed.
// this applies for '/' not '/:d'
const router = express.Router({ mergeParams: true });

// Remember the validation layer is before business logic which is in the controller

// ROUTE
router.route('/')
    .get(createFilterObj, getSubCategories)
    .post(protect, allowedTo('admin', 'manager'), setCategoryIdToBody, createSubCategoryValidator, createSubCategory);

router.route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(protect, allowedTo('admin', 'manager'), updateSubCategoryValidator, updateSubCategory)
    .delete(protect, allowedTo('admin'), deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;