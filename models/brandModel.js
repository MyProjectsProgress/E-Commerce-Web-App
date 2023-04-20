const mongoose = require('mongoose');

// 1- CREATE SCHEMA
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand is required'],
        unique: [true, 'Brand must be unique'],
        minlength: [3, 'Too short Brand name'],
        maxlength: [32, 'Too long Brand name']
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
