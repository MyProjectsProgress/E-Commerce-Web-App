const mongoose = require('mongoose');

// 1- CREATE SCHEMA
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand Is Required'],
        unique: [true, 'Brand Must Be Unique'],
        minlength: [3, 'Too Short Brand Name'],
        maxlength: [32, 'Too Long Brand Name'],
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
const BrandModel = mongoose.model('Brand', brandSchema);

module.exports = BrandModel;
