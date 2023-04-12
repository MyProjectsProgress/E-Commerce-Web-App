const express = require('express');

// HANDLER
const {
    createSubCategory,
    getSubCategories,
    getSubCategory,
    deleteSubCategory,
    updateSubCategory,
    setCategoryIdToBody,
    createFilterObj
} = require('../controllers/subCategoryController');

const {
    createSubCategoryValidator,
    getSubCategoryValidator,
    deleteSubCategoryValidator,
    updateSubCategoryValidator
} = require('../utils/validators/subCategoryValidator');


// mergeParams : allows us to access parameteers on other routers
// ex: we need to access category id from category router
const router = express.Router({ mergeParams: true });

// ROUTE
router.route('/')
    .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory)
    .get(createFilterObj, getSubCategories);
router.route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(updateSubCategoryValidator, updateSubCategory)
    .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;


// Remember the validation layer is before business logic which is in the controller