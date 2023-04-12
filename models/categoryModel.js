const mongoose = require('mongoose');

// 1- CREATE SCHEMA
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category is required'],
        unique: [true, 'Category must be unique'],
        minlength: [3, 'Too short category name'],
        maxlength: [32, 'Too long category name']
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
