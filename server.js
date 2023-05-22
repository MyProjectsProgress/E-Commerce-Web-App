// CORE MODULES
const path = require('path'); // core module that exists in node.js itself

// THIRD PARTY MODULES
const express = require('express');  // for creating express application
const dotenv = require('dotenv');    // for reading enviormenment variables
const morgan = require('morgan');    // to print GET /api/v1/users 200 339.065 ms - 1218

// PROJECT FILES
dotenv.config({ path: 'config.env' });
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const dbConncetion = require('./config/database'); // requiring yhe database connection file to connect database with the server

// REQUIRING ROUTES
const categoryRoute = require('./routes/categoryRoute');
const subCategoryRoute = require('./routes/subCategoryRoute');
const brandRoute = require('./routes/brandRoute');
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute.js');

// CONNECT WITH DATABASE
dbConncetion();

const app = express();

// MIDDLEWARES
app.use(express.json()); // to parse the posted request from string to json object
app.use(express.static(path.join(__dirname, 'uploads'))); // to serve static files 'allows the files to be got from server'

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

// WORKS WHEN THE URL IS NOT IN THE PREDEFINED URIS
app.all("*", (req, res, next) => {
    // CREATE ERROR AND SEND IT TO GLOBAL ERROR HANDLING MIDDLEWARE
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// GLOBAL ERROR HANDLING MIDDLEWARE FOR EXPRESS
// EXPLAINATION: any error occurs in req - res process is caught here.
app.use(globalError);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
    console.log(`App Running on PORT ${PORT}`);
});

// HANDLING REJECTION OUTSIDE EXPRESS
// EXPLAINATION: IT IS FOR ERRORS OUT OF EXPRESS, COULD BE WRONG URL DATABASE CONNECTION THAT IS IN config.env FILE
process.on("unhandledRejection", (err) => {
    console.error(`UnhandledRejection Erorrs: ${err.name} | ${err.message}`);
    server.close(() => {
        console.error(`Shutting down....`);
        process.exit(1);
    });
});


// ALL PROJECT NOTES:

// EXPRESS APP
/**
 * Everything inside express is a middleware.
 * example: logging then user auth then json parsing then static files and app routing
 * the cycle is called request respond cycle
 * validation layer is a middleware
 * we move through keyword called next()
 */

// ERROR HANDLING
/*
how does error occures?
for exampele asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);
})
in this code example if the id is not found by mongoose schema it throws
an error to express then express sends it as HTML.

we can use .then() .catch()
we can use try{} catch {}
we can use asyncHandler() produced by express

Finally we can customize the error:
when express receieves 4 params, it detects that it is a middleware
you can customize the error in this function
*/

// POPULATE('category')
/**
 * It is a function that returns the contents of the coressponding id in the category table
 * hence category table could be any other table
 * Take care: it os a query that costs time in req-res process so it must be done for a purpose
 */

// REQUEST QUERY DESTRUCTION
/**
 * Take care: 
 * 1- const queryStringObj = req.query --> pass by refrerence
 * 2- const queryStringObj = { ... req.query } this destruction means pass by value
 */