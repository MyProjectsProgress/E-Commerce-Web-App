const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');
const bcrypt = require('bcryptjs');

exports.createUserValidator = [
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

    check('phone')
        .optional()
        .isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage('Invalid Phone Number Only Accept EG and SA Phone Numbers'),

    check('profileImg').optional(),

    check('role').optional(),

    validatorMiddleware,
];

exports.getUserValidator = [
    check('id').isMongoId().withMessage("Invalid User ID Format"),
    validatorMiddleware,
];

exports.updateUserValidator = [
    check('id').isMongoId().withMessage("Invalid User ID Format"),
    // This logic could be done as a middleware in the controller file and added to the route file 
    body('name')
        .optional()
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

    check('phone')
        .optional()
        .isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage('Invalid Phone Number Only Accept EG and SA Phone Numbers'),

    check('profileImg').optional(),

    check('role').optional(),
    validatorMiddleware,
];

exports.changeUserPasswordValidator = [
    check('id').isMongoId().withMessage("Invalid User ID Format"),

    check('currentPassword')
        .notEmpty()
        .withMessage('You Must Enter Your Current Password'),

    check('passwordConfirm')
        .notEmpty()
        .withMessage('You Must Enter The Confirmation Password'),

    check('password')
        .notEmpty()
        .withMessage('You Must Enter The New Password')
        .custom(async (val, { req }) => {
            // - Verify Current Password
            const user = await User.findById(req.params.id);
            if (!user) {
                throw new Error('There Is No User for This ID');
            }
            const isCorrectPassword = await bcrypt.compare(req.body.currentPassword, user.password);
            console.log()

            if (!isCorrectPassword) {
                throw new Error('Incorrect Current Password');
            }
            // - Verify Password Confirm
            if (val !== req.body.passwordConfirm) {
                throw new Error('Incorrect Confirmation Password');
            }
            return true;
        }),
    validatorMiddleware,
];

exports.deleteUserValidator = [
    check('id').isMongoId().withMessage("Invalid User ID Format"),
    validatorMiddleware,
];