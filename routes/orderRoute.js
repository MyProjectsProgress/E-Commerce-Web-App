const express = require('express');

// const {
//     getBrandValidator,
//     createBrandValidator,
//     updateBrandValidator,
//     deleteBrandValidator,
// } = require('../utils/validators/brandValidator');

const {
    createCashOrder,
    filterObjectForLoggedUser,
    findAllOrders,
    findSpecificOrder,
    updateOrderPaymentStatus,
    updateOrderDeliverStatus,
    checkoutSession
} = require('../controllers/orderController');

const { protect, allowedTo } = require('../controllers/authController');

const router = express.Router();

router.route('/')
    .get(protect, allowedTo('user', 'admin', 'manager'), filterObjectForLoggedUser, findAllOrders);

router.route('/:id')
    .get(findSpecificOrder);

router.route('/:id/pay')
    .put(protect, allowedTo('admin', 'manager'), updateOrderPaymentStatus);

router.route('/:id/deliver')
    .put(protect, allowedTo('admin', 'manager'), updateOrderDeliverStatus);

router.route('/:cartId')
    .post(protect, allowedTo('user'), createCashOrder);

router.route('/checkout-session/:cartId')
    .get(protect, allowedTo('user'), checkoutSession);

module.exports = router;