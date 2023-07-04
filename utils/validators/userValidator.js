const slugify = require('slugify');
const { check, body } = require('express-validator');
const bcrypt = require('bcryptjs');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');

exports.createUserValidator = [
    check('name')
        .notEmpty()
        .withMessage('User Required')
        .isLength({ min: 3 })
        .withMessage('Too short user name')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),

    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address')
        .custom((val) =>
            // check if input email is in used before
            User.findOne({ email: val }).then((user) => {
                if (user) {
                    return Promise.reject(new Error('E-mail is in use'))
                }
            })
        ),

    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be longer than 6 characters')
        // check if password doesn't match the confirmation password
        .custom((password, { req }) => {
            if (password !== req.body.passwordConfirm) {
                throw new Error('Password confirmaiton is incorrect');
            }
            return true;
        }),

    // not existing in schema because we don't need to save it
    check('passwordConfirm')
        .notEmpty()
        .withMessage('Password confirm is required'),

    check('phone')
        .optional()
        // check if input phone number is ehyptian or saudi arabian
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

            // validate user is in database
            const user = await User.findById(req.params.id);
            if (!user) {
                throw new Error('There Is No User for This ID');
            }

            // - Verify Current Password is equal from the password existing in database
            // compare takes the not hashed pass and the hashed one, if equal will return true
            const isCorrectPassword = await bcrypt.compare(req.body.currentPassword, user.password);

            if (!isCorrectPassword) {
                throw new Error('Incorrect Current Password');
            }

            // - Verify the new password doesn't equal the old one
            const equalOldPassword = await bcrypt.compare(val, admin.password);

            if (equalOldPassword) {
                throw new Error('Please, enter a new password');
            }

            // - Verify Password Confirm is equal to the new password
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

exports.updateLoggedUserValidator = [
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
    validatorMiddleware,
];