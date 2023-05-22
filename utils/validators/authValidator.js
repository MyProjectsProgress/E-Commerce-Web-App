const slugify = require('slugify');
const { check } = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');

exports.signupValidator = [
    check('name')
        .notEmpty()
        .withMessage('User Required')
        .isLength({ min: 3 })
        .withMessage('Too Short User Name')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),

    check('email')
        .notEmpty()
        .withMessage('Email Is Required')
        .isEmail()
        .withMessage('Invalid Email Address')
        .custom((val) =>
            User.findOne({ email: val }).then((user) => {
                if (user) {
                    return Promise.reject(new Error('E-mail Is In Use'))
                }
            })
        ),

    check('password')
        .notEmpty()
        .withMessage('Password Is Required')
        .isLength({ min: 6 })
        .withMessage('Password Must Be Longer Tahn 6 Characters')
        .custom((password, { req }) => {
            if (password !== req.body.passwordConfirm) {
                throw new Error('Password Confirmaiton Is Incorrect');
            }
            return true;
        }),

    check('passwordConfirm')
        .notEmpty()
        .withMessage('Password Confirm Is Required'),

    validatorMiddleware,
];

exports.loginValidator = [

    check('email')
        .notEmpty()
        .withMessage('Email Is Required')
        .isEmail()
        .withMessage('Invalid Email Address'),

    check('password')
        .notEmpty()
        .withMessage('Password Is Required')
        .isLength({ min: 6 })
        .withMessage('Password Must Be Longer Tahn 6 Characters'),

    validatorMiddleware,
];