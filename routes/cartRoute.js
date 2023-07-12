const express = require('express');

// const {
//     getBrandValidator,
//     createBrandValidator,
//     updateBrandValidator,
//     deleteBrandValidator,
// } = require('../utils/validators/brandValidator');

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
    .post(addProductToCart)
    .delete(clearCart);

// router.route('/:itemId')
//     .put(updateCartItemQuantity)
//     .delete(deleteCartItem);

router.route('/applyCoupon').put(applyCoupon)

module.exports = router;