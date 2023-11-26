const jwt = require('jsonwebtoken');
const User = require('../models/users');
const apiResponse = require("../helpers/apiResponse");

// Check if the user is authenticated or not
exports.isAuthenticatedUser = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            // return next(new ErrorHandler('Login first to access this resource.', 401));
            return apiResponse.unauthorizedResponse(res, `Unauthorized!`);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        // Pass the error to the next middleware
        next(error);
    }
};

// handling users roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return apiResponse.unauthorizedResponse(res, `Role: (${req.user.role}) is not allowed to access this resource.`);
        }
        next();
    }
}