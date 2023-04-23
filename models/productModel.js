const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Product Must Have Title'],
            trim: true,
            minlength: [3, 'Too Short Product Title'],
            maxlength: [100, 'Too Long Product Title'],
        },
        slug: {
            type: String,
            required: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, 'Product Description Is Required'],
            minlength: [20, 'Too Short Product Description'],
        },
        quantity: {
            type: Number,
            required: [true, 'Product Quantity Is Required'],
        },
        sold: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'Product Price Is Required'],
            // trim: true,
            max: [10000000, 'Too Long Product Price'],
        },
        priceAfterDiscount: {
            type: Number,
            trim: true,
            max: [10000000, 'Too Long Product Price'],
        },

        colors: [String],

        imageCover: {
            type: String,
            required: [true, 'Product Image Cover Is Required'],
        },

        images: [String],

        category: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
            required: [true, 'Product Must Belong to Category'],
        },
        subcategories: [{
            type: mongoose.Schema.ObjectId,
            ref: 'subCategory',
        },],
        brand: {
            type: mongoose.Schema.ObjectId,
            ref: 'brand',
        },
        ratingsAverage: {
            type: Number,
            min: [1, 'Rating Must Be Between 1.0 and 5.0'],
            max: [5, 'Rating Must Be Between 1.0 and 5.0'],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        }

    },
    { timestamps: true }
);

// Mongoose query middleware
productSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'category',
        select: 'name -_id',
    });
    next();
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;