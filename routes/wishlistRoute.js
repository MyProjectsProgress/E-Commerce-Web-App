const express = require('express');

// const {

// } = require('../utils/validators/wishlistValidator');

const {
    addProductToWishlist,
    deleteProductFromWishlist,
    getWishlist,
} = require('../controllers/wishlistController');

const { protect, allowedTo } = require('../controllers/authController');

const router = express.Router();

router.use(protect);

router.use(allowedTo('user'));

router.route('/')
    .get(getWishlist)
    .post(addProductToWishlist);

router.route('/:productId')
    .delete(deleteProductFromWishlist);

module.exports = router;