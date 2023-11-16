const apiResponse = require("../helpers/apiResponse");


module.exports = (err, req, res, next) => {

    if (err instanceof Error && process.env.NODE_ENV === 'development') {
        return apiResponse.ErrorResponse(res, err.message, err);
    } else {
        return apiResponse.ErrorResponse(res, 'Internal Server Error');
    }

}