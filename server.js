const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');

dotenv.config({ path: 'config.env' });
const dbConncetion = require('./config/database');
const categoryRoute = require('./routes/categoryRoute');

// CONNECT WITH DATABASE
dbConncetion();

// EXPRESS APP
/**
 * Everything inside express is a middleware.
 * example: logging then user auth then json parsing then static files and app routing 
 * the cycel is called request respond cycle
 * validation layer is a middleware 
 * we move through keyword called next()
 */
const app = express();

// MIDDLEWARES
app.use(express.json()); // to parse the posting request from string to json object.

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`${process.env.NODE_ENV}`);
}

// MOUNT ROUTES
app.use('/api/v1/categories', categoryRoute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`App Running on PORT ${PORT}`);
});