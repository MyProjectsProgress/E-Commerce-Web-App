const express = require('express');

const {
    signupValidator
} = require('../utils/validators/authValidator');

const {
    signup
} = require('../controllers/authController');

const router = express.Router();

// router
//     .put('/changePassword/:id', changeUserPasswordValidator, changeUserPassword);

router.route('/signup')
    // .get(getUsers)
    .post(signupValidator, signup);

// router.route('/:id')
//     .get(getUser)
//     .put(uploadUserImage, imageProcessing, updateUserValidator, updateUser)
//     .delete(deleteUser);

module.exports = router;