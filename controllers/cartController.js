const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');
const Cart = require('../models/cartModel');

const clacTotalCartPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach(item => {
        totalPrice += item.quantity * item.price;
    });
    cart.totalPriceAfterDiscount = undefined;
    return totalPrice;
};

// @desc   Add product to cart
// @route  POST /api/v1/cart
// @access Private/User
exports.addProductToCart = asyncHandler(async (req, res, next) => {
    const { productId, color } = req.body;
    const product = await Product.findById(productId);
    // Get cart for logged user
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        // create cart for the new user with the product 
        cart = await Cart.create({
            user: req.user._id,
            cartItems: [{ product: productId, color, price: product.price }]
        });
    } else {
        // if the product is in the cart we will update the quantity only
        // else, push this product to the cartItems array
        const productIndex = cart.cartItems.findIndex(item => item.product.toString() === productId && item.color === color);
        if (productIndex > -1) {
            const cartItem = cart.cartItems[productIndex];
            cartItem.quantity += 1;
            cart.cartItems[productIndex] = cartItem;
        } else {
            cart.cartItems.push({ product: productId, color, price: product.price })
        }
    }

    // calculate total cart price
    const totalPrice = clacTotalCartPrice(cart);

    cart.totalCartPrice = totalPrice;

    await cart.save();

    res.status(200).json({
        status: 'success',
        message: 'Product added to cart successfully',
        numOfCartItems: cart.cartItems.length,
        data: cart
    });

});

// @desc   Get Logged User Cart
// @route  GET /api/v1/cart
// @access Private/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return next(new ApiError(`There is no Cart for this user id: ${req.user._id}`), 404);
    }

    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });
});

// @desc   Delete specific cart item
// @route  Delete /api/v1/cart/:itemId
// @access Private/User
exports.deleteCartItem = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        {
            $pull: { cartItems: { _id: req.params.itemId } }
        },
        { new: true },
    );

    // calculate total cart price
    const totalPrice = clacTotalCartPrice(cart);

    cart.totalCartPrice = totalPrice;

    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });
});

// @desc   Clear logged user cart
// @route  DELETE /api/v1/cart/
// @access Private/User
exports.clearCart = asyncHandler(async (req, res, next) => {

    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(204).send();
});

// @desc   Update specific cart item quantity
// @route  PUT /api/v1/cart/:itemId
// @access Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {

    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return next(new ApiError(`There is no Cart for this user id: ${req.user._id}`), 404);
    };

    const itemIndex = cart.cartItems.findIndex(
        item => item._id.toString() === req.params.itemId
    );

    if (itemIndex > -1) {
        const cartItem = cart.cartItems[itemIndex];
        cartItem.quantity = quantity;
        cart.cartItems[itemIndex] = cartItem;
    } else {
        return next(new ApiError(`There is no item for this id: ${req.params.itemId}`), 404);
    };

    // calculate total cart price
    const totalPrice = clacTotalCartPrice(cart);

    cart.totalCartPrice = totalPrice;

    await cart.save();

    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });

});


// @desc   Apply coupon on logged user cart
// @route  PUT /api/v1/cart/applyCoupon
// @access Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {

    // get coupon based on coupon name
    const coupon = await Coupon.findOne({
        name: req.body.coupon,
    });

    const expirationTime = Date.parse(coupon.expire);

    if (!coupon || expirationTime < Date.now()) {
        return next(new ApiError(`Coupon is invalid or expired`));
    }

    const cart = await Cart.findOne({ user: req.user._id });

    const totalPrice = cart.totalCartPrice;

    // calculate price after discount
    const totalPriceAfterDiscount = (totalPrice - (totalPrice * coupon.discount) / 100).toFixed(2); // 99.3421

    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;

    await cart.save();

    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });

});