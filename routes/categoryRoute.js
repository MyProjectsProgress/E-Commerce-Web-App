const express = require('express');

const { getCategoryValidator, deleteCategoryValidator, updateCategoryValidator, createCategoryValidator } = require('../utils/validators/categoryValidator')

const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryContorller');

const router = express.Router();

router.route('/')
    .get(getCategories)
    .post(createCategoryValidator, createCategory);

router.route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;