const express = require('express');

const {
    createCartValidator,
    updateCartValidator,
    deleteCartValidator,
} = require('../utils/validators/cartValidator');

const {
    addProductToCart,
    getLoggedUserCart,
    deleteCartItem,
    clearCart,
    updateCartItemQuantity,
    applyCoupon
} = require('../controllers/cartController');

const { protect, allowedTo } = require('../controllers/authController');

const router = express.Router();

router.use(protect, allowedTo('user'))

router.route('/')
    .get(getLoggedUserCart)
    .post(createCartValidator, addProductToCart)
    .delete(clearCart);

router.route('/:itemId')
    .put(updateCartValidator, updateCartItemQuantity)
    .delete(deleteCartValidator, deleteCartItem);

router.route('/applyCoupon').put(applyCoupon)

module.exports = router;