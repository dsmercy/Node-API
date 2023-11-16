const apiResponse = require("../helpers/apiResponse");


module.exports = (err, req, res, next) => {

    if (err instanceof Error) {
        return apiResponse.ErrorResponse(res, err.message, err);
    } else {
        return apiResponse.ErrorResponse(res, 'Internal Server Error');
    }

}