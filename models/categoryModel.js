const mongoose = require('mongoose');

// CREATE SCHEMA
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category is required'],
        unique: [true, 'Category must be unique'],
        minlength: [3, 'Too short category name'],
        maxlength: [32, 'Too long category name'],
    },

    // A and B => shopping.com/a-and-b
    slug: {
        type: String,
        lowercase: true,
    },

    image: {
        type: String,
        required: [true, 'Category must be uploaded'],
    }
},
    { timestamps: true } // time stamps will create two fields in database, "created at and updated at"
);

const setImageURL = (doc) => {
    // return image base url + image name
    if (doc.image) {
        const imageURL = `${process.env.BASE_URL}/categories/${doc.image}`;
        doc.image = imageURL;
    }
};

// middleware that is excuted with all apis except create
// init apply its call back function before returning the response
categorySchema.post('init', function (doc) {
    setImageURL(doc);
});

// middleware that is excuted with create
categorySchema.post('save', function (doc) {
    setImageURL(doc);
});

// CREATE MODEL 
const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;
