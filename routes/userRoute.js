const express = require('express');

const {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changeUserPasswordValidator,
    updateLoggedUserValidator,
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
    getLoggedUserData,
    updateLoggedUserPassword,
    updateLoggedUserData,
    deleteLoggedUserData,
} = require('../controllers/userController');

const { protect, allowedTo } = require('../controllers/authController');

const router = express.Router();

router.use(protect);

// special route for changing password
router.put('/changePassword/:id', changeUserPasswordValidator, changeUserPassword);
router.get('/getMe', getLoggedUserData, getUser);
router.put('/changeMyPassword', updateLoggedUserPassword);
router.put('/updateMe', updateLoggedUserValidator, updateLoggedUserData);
router.delete('/deleteMe', deleteLoggedUserData);

// Admin
router.use(allowedTo('admin', 'manager'));

router.route('/')
    .get(getUsers)
    .post(uploadUserImage, imageProcessing, createUserValidator, createUser);

router.route('/:id')
    .get(getUserValidator, getUser)
    .put(uploadUserImage, imageProcessing, updateUserValidator, updateUser)
    .delete(deleteUserValidator, deleteUser);

module.exports = router;