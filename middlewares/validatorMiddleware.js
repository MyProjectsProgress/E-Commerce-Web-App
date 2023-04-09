const { validationResult } = require('express-validator');

// @desc   Finds the validation errors in this request and wraps them in an object with handy functions
const validatorMiddleware = (req, res, next) => {
    // 1- rules
    // 2- middleware => catch errors from rules if exists
    // 3- it prevents entering getCategories controller

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = validatorMiddleware;