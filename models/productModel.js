const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Product must have title'],
            trim: true,
            minlength: [3, 'Too short product title'],
            maxlength: [100, 'Too long product title'],
        },
        slug: {
            type: String,
            required: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
            minlength: [20, 'Too short product description'],
        },
        quantity: {
            type: Number,
            required: [true, 'Product quantity is required'],
        },
        sold: {
            // every time it is sold the sold is increased by 1
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            // trim: true,
            max: [10000000, 'Too long product price'],
        },
        priceAfterDiscount: {
            type: Number,
            trim: true,
            max: [10000000, 'Too lonng product price'],
        },

        colors: [String],

        imageCover: {
            type: String,
            required: [true, 'Product image cover is required'],
        },

        images: [String],

        category: {
            // it belongs to a category
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
            required: [true, 'product must belong to category'],
        },
        subcategories: [{
            // it belongs to a sub-category
            // could be list of IDs, check is handled in validaiton layer
            type: mongoose.Schema.ObjectId,
            ref: 'subCategory',
        },],
        brand: {
            // it belongs to a brand
            type: mongoose.Schema.ObjectId,
            ref: 'brand',
        },
        ratingsAverage: {
            type: Number,
            min: [1, 'Rating must be between 1.0 and 5.0'],
            max: [5, 'Rating must be between 1.0 and 5.0'],
        },
        ratingsQuantity: {
            // increased by 1 after each rate
            type: Number,
            default: 0,
        }

    },
    {
        timestamps: true,
        // to enable virtual populate
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// translation line by line: create in product model field called reviews extracted from Review model based on product field = product _id
productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id'
});

// Mongoose query middleware
// if the query is "find" use this function
// populate takes the path "field name " and selects name
productSchema.pre(/^find/, function (next) {
    // this refers to the query 
    // populate returns the information selected from the specific model "category"
    this.populate({
        path: 'category',
        select: 'name -_id',
    });
    next();
});

const setImageURL = (doc) => {
    // return image base url + image name
    if (doc.imageCover) {
        const imageURL = `${process.env.BASE_URL}/products/${doc.imageCover}`;
        doc.imageCover = imageURL;
    }
    if (doc.images) {
        const imagesList = [];
        doc.images.forEach((image) => {
            const imageURL = `${process.env.BASE_URL}/products/${image}`;
            imagesList.push(imageURL);
        });
        doc.images = imagesList;
    }
};

// middleware that is excuted with all apis except create
productSchema.post('init', function (doc) {
    setImageURL(doc);
});

// middleware that is excuted with create
productSchema.post('save', function (doc) {
    setImageURL(doc);
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;