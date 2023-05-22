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


// mergeParams : allows us to access parameters on other routers
// ex: we need to access category id from category router.
// we access categoryId here: router.use('/:categoryId/subcategories', subCategoriesRoute);
// simply it access categoryId that is passed.
// this applies for '/' not '/:d'
const router = express.Router({ mergeParams: true });

// Remember the validation layer is before business logic which is in the controller

// ROUTE
router.route('/')
    .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory)
    .get(createFilterObj, getSubCategories);
router.route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(updateSubCategoryValidator, updateSubCategory)
    .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;