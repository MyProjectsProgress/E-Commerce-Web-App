const express = require('express');

const { getCategories } = require('../controllers/categoryContorller')

const router = express.Router();

router.get('/', getCategories);

module.exports = router;