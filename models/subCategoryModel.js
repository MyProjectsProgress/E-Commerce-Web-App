const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: [true, "Subcategory Must Be Unique"],
            minlength: [2, "Too Short Subcategory Name"],
            maxlength: [32, "Too Long Subcategory Name"]
        },
        slug: {
            type: String,
            lowercase: true,
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            required: [true, "Subcategory Must Belong to Parent Category"],
        },
    },
    { timestamps: true }
);

const SubcategoryModel = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubcategoryModel;