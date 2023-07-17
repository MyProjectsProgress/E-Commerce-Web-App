const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        cartItems: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'Product',
                },
                quantity: {
                    type: Number,
                    default: 1,
                    min: 1,
                },
                color: String,
                price: Number
            }
        ],

        totalCartPrice: {
            type: Number,
            min: 0,
        },

        totalPriceAfterDiscount: {
            type: Number,
            min: 0,
        },

        user: {
            type: mongoose.Schema.ObjectId,
        }
    },
    { timestamps: true }
);

const CartModel = mongoose.model('Cart', cartSchema);

module.exports = CartModel;