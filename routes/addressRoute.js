const express = require('express');

// const {

// } = require('../utils/validators/addressValidator');

const {
    addAddress,
    deleteAddress,
    getAddresses,
} = require('../controllers/addressController');

const { protect, allowedTo } = require('../controllers/authController');

const router = express.Router();

router.use(protect);

router.use(allowedTo('user'));

router.route('/')
    .get(getAddresses)
    .post(addAddress);

router.route('/:addressId')
    .delete(deleteAddress);

module.exports = router;