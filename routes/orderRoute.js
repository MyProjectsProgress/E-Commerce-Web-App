const express = require('express');

const {
    validateOrderId,
    createCashOrderValidator,
} = require('../utils/validators/orderValidator');

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
    .get(validateOrderId, findSpecificOrder);

router.route('/:id/pay')
    .put(protect, allowedTo('admin', 'manager'), validateOrderId, updateOrderPaymentStatus);

router.route('/:id/deliver')
    .put(protect, allowedTo('admin', 'manager'), validateOrderId, updateOrderDeliverStatus);

router.route('/:cartId')
    .post(protect, allowedTo('user'), createCashOrderValidator, createCashOrder);

router.route('/checkout-session/:cartId')
    .get(protect, allowedTo('user'), checkoutSession);

module.exports = router;