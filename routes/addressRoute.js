const express = require('express');

const {
    updateAddressValidator,
    createAddressValidator,
    deleteAddressValidator
} = require('../utils/validators/addressValidator');

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
    .post(createAddressValidator, addAddress);

router.route('/:addressId')
    .delete(deleteAddressValidator, deleteAddress);

module.exports = router;