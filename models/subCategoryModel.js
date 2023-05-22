const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            // trim deletes space at the begining and end of input
            trim: true,
            unique: [true, 'Subcategory must be unique'],
            minlength: [2, 'Too short subcategory name'],
            maxlength: [32, 'Too long subcategory name'],
        },

        // A and B => shopping.com/a-and-b
        slug: {
            type: String,
            lowercase: true,
        },

        // each subcategory referes to a category
        category: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
            required: [true, 'Subcategory must belong to parent category'],
        },
    },
    { timestamps: true }
);

const SubcategoryModel = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubcategoryModel;