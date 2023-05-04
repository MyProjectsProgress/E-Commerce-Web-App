//core modules
const path = require('path'); // core module that exists in node.js itself

// third party modules
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// project files
dotenv.config({ path: 'config.env' });
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const dbConncetion = require('./config/database');

// ROUTES
const categoryRoute = require('./routes/categoryRoute');
const subCategoryRoute = require('./routes/subCategoryRoute');
const brandRoute = require('./routes/brandRoute');
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute.js');

// CONNECT WITH DATABASE
dbConncetion();

// EXPRESS APP
/**
 * Everything inside express is a middleware.
 * example: logging then user auth then json parsing then static files and app routing 
 * the cycle is called request respond cycle
 * validation layer is a middleware 
 * we move through keyword called next()
 */
const app = express();

// MIDDLEWARES
app.use(express.json()); // to parse the posting request from string to json object
app.use(express.static(path.join(__dirname, 'uploads'))); // to serve static files

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`${process.env.NODE_ENV}`);
}

// MOUNT ROUTES
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/subcategories', subCategoryRoute);
app.use('/api/v1/brands', brandRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/auth', authRoute);

// WORKS WHEN THE URI IS NOT IN THE PREDEFINED URIS
app.all("*", (req, res, next) => {
    // CREATE ERROR AND SEND IT TO GLOBAL ERROR HANDLING MIDDLEWARE
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// GLOBAL ERROR HANDLING MIDDLEWARE FOR EXPRESS
app.use(globalError);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
    console.log(`App Running on PORT ${PORT}`);
});

// HANDLING REJECTION OUTSIDE EXPRESS
// ONCE WE SEE THIS ERROR WE UNDERSTAND THAT IT IS OUT OF EXPRESS, COULD BE WRONG URI DATABASE CONNECTION
process.on("unhandledRejection", (err) => {
    console.error(`UnhandledRejection Erorrs: ${err.name} | ${err.message}`);
    server.close(() => {
        console.error(`Shutting down....`);
        process.exit(1);
    });
});