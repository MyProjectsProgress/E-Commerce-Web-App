const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET)

const factory = require('./zHandlersFactory');
const ApiError = require('../utils/apiError');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');

// @desc   Create cash order
// @route  POST /api/v1/order
// @access Public
exports.createCashOrder = asyncHandler(async (req, res, next) => {

    // app setting
    const taxPrice = 0;
    const shippingPrice = 0;

    // 1- Get cart based on cartId.
    const cart = await Cart.findById(req.params.cartId);

    if (!cart) {
        return next(new ApiError(`There is no cart with this cart ID: ${req.params.cartId}`), 404);
    };

    // 2- Get order price based on cart price "check if coupon is applied".
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;

    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    // 3- create order with cash payment type.
    const order = await Order.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        totalOrderPrice: totalOrderPrice,
        shippingAddress: req.body.shippingAddress,
    });

    // 4- after creating order, decrement product quantity and increment product sold
    if (order) {
        const bulkOption = cart.cartItems.map(item => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
            }
        }));

        await Product.bulkWrite(bulkOption, {});

        // 5- Clear cart based on cartId 
        await Cart.findByIdAndDelete(req.params.cartId);

        res.status(201).json({
            status: 'success',
            data: order,
        });
    };

});

exports.filterObjectForLoggedUser = asyncHandler(async (req, res, next) => {
    if (req.user.role === 'user') {
        req.filterObj = { user: req.user._id }
    };

    next();
});

// @desc   Get all orders
// @route  GET /api/v1/order
// @access Protected/User-Admin-Manager
exports.findAllOrders = factory.getAll(Order);

// @desc   Get specific
// @route  GET /api/v1/order
// @access Protected/User-Admin-Manager
exports.findSpecificOrder = factory.getOne(Order);

// @desc   Update order payment status
// @route  PUT /api/v1/order/:id/pay
// @access Protected/Admin-Manager
exports.updateOrderPaymentStatus = asyncHandler(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ApiError(`There is no ordr for this ID: ${req.paramas.id}`), 404);
    };

    // Update order status
    order.isPaid = true;

    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({ status: 'success', data: updatedOrder })
});

// @desc   Update order delivered status
// @route  PUT /api/v1/order/:id/deliver
// @access Protected/Admin-Manager
exports.updateOrderDeliverStatus = asyncHandler(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ApiError(`There is no ordr for this ID: ${req.paramas.id}`), 404);
    };

    // Update order status
    order.isDelivered = true;

    order.deliverdAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({ status: 'success', data: updatedOrder })
});

// @desc   Get checkout session from stripe and send it as a response
// @route  GET /api/v1/order/checkout-session/cartId
// @access Protected/User
exports.checkoutSession = asyncHandler(async (req, res, next) => {

    // app setting
    const taxPrice = 0;
    const shippingPrice = 0;

    // 1- Get cart based on cartId.
    const cart = await Cart.findById(req.params.cartId);

    if (!cart) {
        return next(new ApiError(`There is no cart with this cart ID: ${req.params.cartId}`), 404);
    };

    // 2- Get order price based on cart price "check if coupon is applied".
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;

    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    // 3- create stripe checkout session
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                // name: req.user.name,
                // amount: totalOrderPrice * 100,
                // currency: "egp",
                // quantity: 1,
                price_data: {
                    currency: 'egp',
                    product_data: {
                        name: req.user.name,
                    },
                    unit_amount: totalOrderPrice * 100,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/order`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart`,
        customer_email: req.user.email,
        client_reference_id: cart._id,
        metadata: req.body.shippingAddress,
    });

    // 4- send session to response
    res.status(200).json({
        status: 'success',
        session
    });
});