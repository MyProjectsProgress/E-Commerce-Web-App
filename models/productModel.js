const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: [3, "Too Short Product Title"],
            maxlength: [100, "Too Long Product Title"],
        },
        slug: {
            type: String,
            required: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: true,
            minlength: [20, "Too Short Product Description"],
        },
        quantity: {
            type: Number,
            required: true,
        },
        sold: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: true,
            // trim: true,
            max: [10000000, "Too Long Product Price"],
        },
        priceAfterDiscount: {
            type: Number,
            trim: true,
            max: [10000000, "Too Long Product Price"],
        },

        colors: [String],

        imageCover: {
            type: String,
            required: [true, "Product Image Cover Is Required"],
        },

        images: [String],

        category: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
            required: [true, 'Product must belong to category'],
        },
        subcategory: [{
            type: mongoose.Schema.ObjectId,
            ref: 'subCategory',
        },],
        brand: {
            type: mongoose.Schema.ObjectId,
            ref: 'brand',
        },
        ratingsAverage: {
            type: Number,
            min: [1, "Rating Must be Between 1 and 5"],
            max: [5, "Rating Must be Between 1 and 5"],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);