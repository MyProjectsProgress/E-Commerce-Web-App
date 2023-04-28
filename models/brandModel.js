const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

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

const setImageURL = (doc) => {
    // return image base url + image name
    if (doc.image) {
        const imageURL = `${process.env.BASE_URL}/brands/${doc.image}`;
        doc.image = imageURL;
    }
};

// middleware that is excuted with all apis except create
brandSchema.post('init', function (doc) {
    setImageURL(doc);
});

// middleware that is excuted with create
brandSchema.post('save', function (doc) {
    setImageURL(doc);
});

// 2- CREATE MODEL 
const BrandModel = mongoose.model('Brand', brandSchema);

module.exports = BrandModel;
