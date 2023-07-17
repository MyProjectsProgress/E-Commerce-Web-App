const mongoose = require('mongoose');

// 1- CREATE SCHEMA
const copounSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, ' Copoun name is required'],
            unique: true,
        },

        expire: {
            type: Date,
            required: [true, 'Copoun expire time is required']
        },

        discount: {
            type: Number,
            required: [true, 'Copoun discount vaue is required'],
        }
    },
    { timestamps: true },
);

// 2- CREATE MODEL 
const copounModel = mongoose.model('Copoun', copounSchema);



module.exports = copounModel;
