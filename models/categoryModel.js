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

const setImageURL = (doc) => {
    // return image base url + image name
    if (doc.image) {
        const imageURL = `${process.env.BASE_URL}/categories/${doc.image}`;
        doc.image = imageURL;
    }
};

// middleware that is excuted with all apis except create
categorySchema.post('init', function (doc) {
    setImageURL(doc);
});

// middleware that is excuted with create
categorySchema.post('save', function (doc) {
    setImageURL(doc);
});

// 2- CREATE MODEL 
const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;
