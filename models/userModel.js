const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Name is required'],
        },

        slug: {
            type: String,
            lowercase: true,
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
        },

        phone: String,

        profileImge: String,

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Too short password'],
        },

        passwordChangedAt: Date,

        passwordResetCode: String,

        passwordResetExpiration: Date,

        passwordResetVerification: Boolean,

        role: {
            type: String,
            // don't accept any role but these
            enum: ['user', 'manager', 'admin'],
            default: 'user',
        },

        active: {
            type: Boolean,
            default: true,
        },

        // child reference, one to many
        wishlist: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
            },
        ],

        // Embedded Document
        addresses: [{
            id: { type: mongoose.Schema.Types.ObjectId },
            alias: String,
            details: String,
            phone: String,
            postalCode: Number,
            city: String,
        }],
    },
    { timestamps: true }
);

// applying mongoose middleware before saving the model
userSchema.pre('save', async function (next) {
    // if the password field is not modified, skip the hashing 
    if (!this.isModified('password')) return next();
    // Hashing User Password
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;