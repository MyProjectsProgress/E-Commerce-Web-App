const express = require('express');

// const {
//     getCouponValidator,
//     createCouponValidator,
//     updateCouponValidator,
//     deleteCouponValidator,
// } = require('../utils/validators/couponValidator');

const {
    getCoupons,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
} = require('../controllers/couponController');

const { protect, allowedTo } = require('../controllers/authController');

const router = express.Router();

router.use(protect, allowedTo('admin', 'manager'))

router.route('/')
    .get(getCoupons)
    .post(createCoupon);

router.route('/:id')
    .get(getCoupon)
    .put(updateCoupon)
    .delete(deleteCoupon);

module.exports = router;