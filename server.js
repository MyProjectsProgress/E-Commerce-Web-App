// CORE MODULES
const path = require('path'); // core module that exists in node.js itself

// THIRD PARTY MODULES
const express = require('express');  // for creating express application
const dotenv = require('dotenv');    // for reading enviormenment variables
const morgan = require('morgan');    // to print GET /api/v1/users 200 339.065 ms - 1218
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// PROJECT FILES
dotenv.config({ path: 'config.env' });
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const dbConncetion = require('./config/database'); // requiring yhe database connection file to connect database with the server

// REQUIRING ROUTES
const mountRoutes = require('./routes');

// CONNECT WITH DATABASE
dbConncetion();

const app = express();

// MIDDLEWARES
app.use(express.json({ limit: '20kb' })); // to parse the posted request from string to json object
app.use(express.static(path.join(__dirname, 'uploads'))); // to serve static files 'allows the files to be got from server'
app.use(hpp({ whitelist: ['price', 'sold', 'quantity', 'raingsQuantity', 'ratingsAverage'] })); // middleware to protect against HTTP parameter pollution attacks

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`${process.env.NODE_ENV}`);
};

// To remove data using these defaults: 
app.use(mongoSanitize()); // jquery detection
app.use(xss()); // sanitize the malicious input data

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window (here, per 15 minutes)
    standardHeaders: true, // retrun rate limit info in the rate  limit-* headers
    legacyHeaders: false, // Disable the X-RateLimit-* headers
    message: 'Too many requests from this IP',
});

// apply rate limiti on all routes
app.use('/api', limiter);

// MOUNT ROUTES
mountRoutes(app);

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
 * the cycle is called request respond cycle also known as three tier cycle => client server database
 * validation layer is a middleware
 * we move through a middleware and not stuck in it we use a keyword called next(), res.send() finishes the middleware as well
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
 * It is a function that returns the contents of the corresponding id in the category table
 * hence category table could be any other table
 * Take care: it os a query that costs time in req-res process so it must be done for a purpose
 */

// REQUEST QUERY DESTRUCTION
/**
 * Take care:
 * 1- const queryStringObj = req.query --> pass by refrerence
 * 2- const queryStringObj = { ... req.query } this destruction means pass by value
 * used when we don't want to change the whole response
 */

// Embedding documents in mongoDB database:
/**
 * if there are lots of documents "like comments on a post" so it is better to separate
 * the disadvantages of separation is that you have to excute two queries to populate certain comments
 * if you embedded document in a model then you will have faster access to it by one query
 */

// Given a document, `populate()` lets you pull in referenced docs

