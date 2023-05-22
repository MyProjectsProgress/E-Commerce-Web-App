const { validationResult } = require('express-validator');

// this function doesn't need params when it is called as it contains req, res and next by default

// @desc   Finds the validation errors in this request and wraps them in an object with handy functions
const validatorMiddleware = (req, res, next) => {
    // 1- rules "In the validator files"
    // 2- middleware => catch errors from rules if exists "express module"
    // 3- it prevents entering getCategories controller 
    // remember "Senitizing inputs": Check express.validator documentation
    // https://express-validator.github.io/docs/guides/getting-started

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = validatorMiddleware;