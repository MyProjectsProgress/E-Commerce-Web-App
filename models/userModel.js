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

        role: {
            type: String,
            // don't accept any role but user or admin
            enum: ['user', 'admin'],
            default: 'user',
        },

        active: {
            type: Boolean,
            default: true,
        },
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