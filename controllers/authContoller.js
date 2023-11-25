const { request } = require('express');
const User = require('../models/users');
const apiResponse = require("../helpers/apiResponse");
const sendToken = require('../utils/jwtToken');


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

    // Login user  =>  /api/v1/login
    loginUser = async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // Checks if email or password is entered by user
            if (!email || !password) {
                return apiResponse.validationErrorWithData(res, `Please enter valid email & Password`);
            }

            // Finding user in database
            const user = await User.findOne({ email }).select('+password');

            if (user) {
                const isPasswordMatched = await user.comparePassword(password);
                if (!isPasswordMatched) {
                    return apiResponse.unauthorizedResponse(res, `Invalid Email or Password`);
                }
                
                sendToken(user,200,res);
            }else{
                return apiResponse.unauthorizedResponse(res, `Invalid Email`);
            }
        } catch (error) {
            // Pass the error to the next middleware
            next(error);
        }

    };

}

module.exports = new UsersController();