
// EXPRESS KNOWS THAT 4 PARAMS REFER TO ERROR HANDLING MIDDLEWARE
const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV == "development") {
        sendErrorDev(err, res);
    } else {
        sendErrorProd(err, res);
    }

};

const sendErrorDev = (err, res) => {
    res.status(400).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    res.status(400).json({
        status: err.status,
        message: err.message,
    });
};

module.exports = globalError;