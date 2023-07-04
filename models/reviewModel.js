const mongoose = require('mongoose');
const Product = require('./productModel');
// mongoose.set('strictQuery', true);

// 1- CREATE SCHEMA
const reviewSchema = new mongoose.Schema({

    title: String,

    ratings: {
        type: Number,
        min: [1, 'Rating must be between 1.0 and 5.0'],
        max: [5, 'Rating must be between 1.0 and 5.0'],
        required: [true, 'Review rating is required'],
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to user'],
    },

    // parent reference - one to many
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Review must belong to product'],
    },

},
    { timestamps: true } // time stamps will create two fields in database, "created at and updated at"
);

reviewSchema.pre(/^find/, function (next) {
    this.populate({ path: "user", select: "name" });
    next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (productId) {
    const result = await this.aggregate([
        // stage 2: get all reviews in specific product
        {
            $match: { product: productId }
        },
        // stage 2: grouping reviews based on product ID and calulate average rating and quantity
        {
            $group: {
                _id: 'product',
                averageRatings: { $avg: '$ratings' },
                ratingsQuantity: { $sum: 1 },
            }
        },
    ]);
    // check if there is a value in the result array
    if (result.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: result[0].averageRatings,
            ratingsQuantity: result[0].ratingsQuantity,
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: 0,
            ratingsQuantity: 0,
        });
    }
}

reviewSchema.post('save', async function () {
    await this.constructor.calcAverageRatingsAndQuantity(this.product)
});

reviewSchema.post('remove', async function () {
    await this.constructor.calcAverageRatingsAndQuantity(this.product)
});

// 2- CREATE MODEL 
const ReviewModel = mongoose.model('Review', reviewSchema);

module.exports = ReviewModel;

