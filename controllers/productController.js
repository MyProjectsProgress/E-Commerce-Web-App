const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');

const factory = require('./zHandlersFactory');
const { uploadMixOfImages } = require('../middlewares/uploadImageMiddleware');
const Product = require('../models/productModel');
// placeholder
exports.uploadProductImages = uploadMixOfImages([
    {
        name: 'imageCover',
        maxCount: 1,
    },
    {
        name: 'images',
        maxCount: 5,
    }
]);

exports.productImageProcessing = asyncHandler(async (req, res, next) => {

    // image processing for imageCover
    if (req.files.imageCover) {

        const randomID = uuidv4();
        const imageCoverFilename = `product-${randomID}-${Date.now()}-cover.jpeg`;

        // sharp is node.js library for image processing 
        // withMetadata: to solve the problem of rotation of image after resizing to retain the exif data that includes the correct orientation of the image
        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .withMetadata()
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageCoverFilename}`);

        // save image into DB by creating new field called imageCover 
        req.body.imageCover = imageCoverFilename;
    }

    // image processing for images
    if (req.files.images) {

        req.body.images = [];
        // why promise.all()? to wait untill map finishes then send the request
        // wihtout it, middlewares wouldn't wait untill the map loop finishes
        await Promise.all(
            // after so many trials, map works with async but ofreach doesn't because it creates an array so that it handles async
            req.files.images.map(async (image, index) => {

                const randomID = uuidv4();
                const imageFilename = `product-${randomID}-${Date.now()}-${index + 1}.jpeg`;

                // sharp is node.js library for image processing 
                // withMetadata: to solve the problem of rotation of image after resizing to retain the exif data that includes the correct orientation of the image
                await sharp(image.buffer)
                    .resize(2000, 1333)
                    .withMetadata()
                    .toFormat('jpeg')
                    .jpeg({ quality: 95 })
                    .toFile(`uploads/products/${imageFilename}`);

                //save image into DB
                req.body.images.push(imageFilename);
            })
        );
    }
    next();
});

// @desc   Get list of Products
// @route  GET /api/v1/products
// @access Public
exports.getProducts = factory.getAll(Product, 'Products');

// @desc   Get Product By ID
// @route  GET /api/v1/products/:id
// @access Public
exports.getProduct = factory.getOne(Product, 'reviews');

// @desc   Create Product
// @route  POST /api/v1/products
// @access Private
exports.createProduct = factory.createOne(Product);

// @desc   Update Product
// @route  PUT /api/v1/products/:id
// @access Private
exports.updateProduct = factory.updateOne(Product);

// @desc   Delete Product
// @route  PUT /api/v1/products/:id
// @access Private
exports.deleteProduct = factory.deleteOne(Product);
