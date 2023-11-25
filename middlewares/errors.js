const apiResponse = require("../helpers/apiResponse");


module.exports = (err, req, res, next) => {

    if (err instanceof Error) {
        console.log('err',err);

        let error = {...err};

        error.message = err.message;

        // Wrong Mongoose Object ID Error
        if(err.name === 'CastError') {
            return apiResponse.notFoundResponse(res, `Resource not found. Invalid: ${err.path}`);
        }

        // Handling Mongoose Validation Error
        if(err.name === 'ValidationError') {
            return apiResponse.validationErrorWithData(res, Object.values(err.errors).map(value => value.message), err);
        }        

        // Handling Wrong JWT token error
        if(err.name === 'JsonWebTokenError') {
            return apiResponse.ErrorResponse(res, `JSON Web token is invalid. Try Again!`, err);
        }

        // Handling Expired JWT token error
        if(err.name === 'TokenExpiredError') {
            return apiResponse.ErrorResponse(res, `JSON Web token is expired. Try Again!`, err);
        }

        // Handle mongoose duplicate key error
        if(err.code===11000){
            return apiResponse.validationErrorWithData(res, `Duplicate ${Object.keys(err.keyValue)} entered.`, err);
        }
        return apiResponse.ErrorResponse(res, err.message, err);
    } else {
        return apiResponse.ErrorResponse(res, 'Internal Server Error');
    }

}