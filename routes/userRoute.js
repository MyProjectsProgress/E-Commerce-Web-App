const express = require('express');

const {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changeUserPasswordValidator,
} = require('../utils/validators/userValidator');

const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    imageProcessing,
    uploadUserImage,
    changeUserPassword,
} = require('../controllers/userController');

const router = express.Router();

// special route for changing password
router
    .put('/changePassword/:id', changeUserPasswordValidator, changeUserPassword);

router.route('/')
    .get(getUsers)
    .post(uploadUserImage, imageProcessing, createUserValidator, createUser);

router.route('/:id')
    .get(getUser)
    .put(uploadUserImage, imageProcessing, updateUserValidator, updateUser)
    .delete(deleteUser);

module.exports = router;