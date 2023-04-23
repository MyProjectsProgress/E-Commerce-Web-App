const mongoose = require('mongoose');

// 1- CREATE SCHEMA
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category Is Required'],
        unique: [true, 'Category Must Be Unique'],
        minlength: [3, 'Too Short Category Name'],
        maxlength: [32, 'Too Long Category Name'],
    },
    // A and B => shopping.com/a-and-b
    slug: {
        type: String,
        lowercase: true,
    },
    image: String
},
    { timestamps: true } // time stamps will create two fields in database, "created at and updated at"
);

// 2- CREATE MODEL 
const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;
