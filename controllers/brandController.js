const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');

const factory = require('./zHandlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const Brand = require('../models/brandModel');

// multer middleware that uploads single file
exports.uploadBrandImage = uploadSingleImage('image');

// this part is not refactorered as a lot of arguments would be added
exports.imageProcessing = asyncHandler(async (req, res, next) => {

    const randomID = uuidv4();
    const filename = `brand-${randomID}-${Date.now()}.jpeg`;

    // sharp is node.js library for image processing 
    // withMetadata: to solve the problem of rotation of image after resizing to retain the exif data that includes the correct orientation of the image
    await sharp(req.file.buffer)
        .resize(600, 600)
        .withMetadata()
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/brands/${filename}`);

    // save image into DB
    // to save image url: req.hostname + filename
    req.body.image = filename;

    next();
});

// @desc   Get list of Brands
// @route  GET /api/v1/brands
// @access Public
exports.getBrands = factory.getAll(Brand);

// @desc   Get Brand By ID
// @route  GET /api/v1/brands/:id
// @access Public
exports.getBrand = factory.getOne(Brand);

// @desc   Create Brand
// @route  POST /api/v1/brands
// @access Private
exports.createBrand = factory.createOne(Brand);

// @desc   Update Brand
// @route  PUT /api/v1/brands/:id
// @access Private
exports.updateBrand = factory.updateOne(Brand);

// @desc   Delete Brand
// @route  PUT /api/v1/brands/:id
// @access Private
exports.deleteBrand = factory.deleteOne(Brand);
