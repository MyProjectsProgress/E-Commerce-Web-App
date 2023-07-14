const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

// 1- CREATE SCHEMA
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Order must belong to user'],
    },

    cartItems: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
            },
            quantity: Number,
            color: String,
            price: Number
        }
    ],

    taxPrice: {
        type: Number,
        default: 0,
    },

    shippingPrice: {
        type: Number,
        default: 0,
    },

    shippingAddress: {
        details: String,
        phone: String,
        city: String,
        postalCode: String,
    },

    totalOrderPrice: {
        type: Number,
        default: 0,
    },

    paymentType: {
        type: String,
        enum: ['card', 'cash'],
        default: 'cash',
    },

    isPaid: {
        type: Boolean,
        default: 'false',
    },

    paidAt: Date,

    isDelivered: {
        type: Boolean,
        default: 'false',
    },

    deliverdAt: Date,

},
    { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name profileImg email phone' }).populate({
        path: 'cartItems.product',
        select: 'title imageCover',
    });
    next();
});

// 2- CREATE MODEL 
const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;
