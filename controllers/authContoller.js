const { request } = require('express');
const User = require('../models/users');
const apiResponse = require("../helpers/apiResponse");


class UsersController {
    constructor(userModel) {
        this.User = userModel;
    }

    // Register user   =>    /api/v1/me/register
    registerUser = async (req, res, next) => {
        try {
            const { name, email, password, role } = req.body;

            const user = await User.create({
                name,
                email,
                password,
                role
            });

            // Exclude the password field when converting the document to JSON
            const userJson = { ...user._doc };
            delete userJson.password;

const token = user.getJwtToken();

            return apiResponse.successResponseWithData(res, `JWT Token: ${token}`, userJson);
        } catch (error) {
            // Pass the error to the next middleware
            next(error);
        }
    }

}

module.exports = new UsersController();