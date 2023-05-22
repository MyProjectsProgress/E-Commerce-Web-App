// @desc   this calss is responsible for operational errors (Errors that I can predict).
class ApiError extends Error {
    constructor(message, statusCode) {
        // because the parent class 'Error' takes the message as a parameter
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(4) ? 'Failed Request' : '500 Internal Server Error';
        this.isOperational = true;
    }
};

module.exports = ApiError;