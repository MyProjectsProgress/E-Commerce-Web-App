const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');

const factory = require('./zHandlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const Category = require('../models/categoryModel');

// multer middleware that uploads single file
exports.uploadCategoryImage = uploadSingleImage('image');

// this part is not refactorered as a lot of arguments would be added
exports.imageProcessing = asyncHandler(async (req, res, next) => {

    if (req.file) {
        const randomID = uuidv4();
        const filename = `category-${randomID}-${Date.now()}.jpeg`;

        // sharp is node.js library for image processing 
        // withMetadata: to solve the problem of rotation of image after resizing to retain the exif data that includes the correct orientation of the image

        await sharp(req.file.buffer)
            .resize(600, 600)
            .withMetadata()
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/categories/${filename}`);

        //save image into DB
        req.body.image = filename;
    }

    next();
});

// @desc   Get list of Categories
// @route  GET /api/v1/categories
// @access Public
exports.getCategories = factory.getAll(Category);

// @desc   Get Category By ID
// @route  GET /api/v1/categories/:id
// @access Public
exports.getCategory = factory.getOne(Category);

// @desc   Create Category
// @route  POST /api/v1/categories
// @access Private
exports.createCategory = factory.createOne(Category);

// @desc   Update Category
// @route  PUT /api/v1/categories/:id
// @access Private
exports.updateCategory = factory.updateOne(Category);

// @desc   Delete Category
// @route  PUT /api/v1/categories/:id
// @access Private
exports.deleteCategory = factory.deleteOne(Category);
