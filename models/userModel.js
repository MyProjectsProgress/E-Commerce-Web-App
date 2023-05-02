const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Name Is Required'],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        email: {
            type: String,
            required: [true, 'Email Is Required'],
            unique: true,
            lowercase: true,
        },

        phone: String,

        profileImge: String,

        password: {
            type: String,
            required: [true, 'Password Is Required'],
            minlength: [6, 'Too Short Password'],
        },
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

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    // Hashing User Password
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;