const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const SubCategory = require('../models/subCategoryModel');


exports.setCategoryIdToBody = (req, res, next) => {
    // NESTED ROUTE
    if (!req.params.category) req.body.category = req.params.categoryId; // TAKE CARE YOU SET HERE A VALUE OF THE BODY
    next();
};

// @desc   Create subCategory
// @route  POST /api/v1/subsubCategory
// @access Private
exports.createSubCategory = asyncHandler(async (req, res, next) => {

    const { name, category } = req.body; // WILL USE THE VALUE OF CATEGORY OF THE SET CATEGORY ID TO BODY MIDDLEWARE
    // async await
    const subCategory = await SubCategory.create({ name, slug: slugify(name), category });
    res.status(201).json({ data: subCategory });
});

// NESTED ROUTE
// GET /api/v1/categories/:categoryID/subcategories
// GET /api/v1/categories/:productID/reviews => ana hena ba2olo ana 3ayez kol el reviews elli 3al product dh

exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId) filterObject = { category: req.params.categoryId }; // get data based on this specific category id
    req.filterObj = filterObject;
    next();
};


// @desc   Get list of subCategories
// @route  GET /api/v1/subCategories
// @access Public
exports.getSubCategories = asyncHandler(async (req, res, next) => {

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;

    const subCategories = await SubCategory.find(req.filterObj).skip(skip).limit(limit).populate({ path: 'category', select: 'name-_id' });
    res.status(200).json({ results: subCategories.length, data: subCategories });
});

// @desc   Get Category By ID
// @route  GET /api/v1/subCategory/:id
// @access Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Take care that you do more than one query, if ypu don't need to do populate that much so simply don't do it.
    // .populate({ path: 'category', select: 'name-_id' })
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
        return next(new ApiError(`No Subcategory for This ID: ${id}`, 404));
    }
    res.status(200).json({ data: subCategory });
});

// @desc   Update Subcategory
// @route  PUT /api/v1/subcategories/:id
// @access Private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, category } = req.body;

    const subCategory = await SubCategory.findOneAndUpdate({ _id: id }, { name, slug: slugify(name), category }, { new: true });

    if (!subCategory) {
        return next(new ApiError(`No Subategory for This ID: ${id}`, 404));
    }

    res.status(200).json({ data: subCategory });
});

// @desc   Delete Subcategory
// @route  PUT /api/v1/subcategories/:id
// @access Private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subCategory = await SubCategory.findByIdAndDelete(id);

    if (!subCategory) {
        return next(new ApiError(`No Subcategory for This ID: ${id}`, 404));
    }

    res.status(204).send();
});