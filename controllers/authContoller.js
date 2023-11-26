const { request } = require('express');
const User = require('../models/users');
const apiResponse = require("../helpers/apiResponse");
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');


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

            return apiResponse.successResponseWithData(res, `User Registered`, userJson);
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

                sendToken(user, res);
            } else {
                return apiResponse.unauthorizedResponse(res, `Invalid Email`);
            }
        } catch (error) {
            // Pass the error to the next middleware
            next(error);
        }

    };

    // Forgot Password  =>  /api/v1/password/forgot
    forgotPassword = async (req, res, next) => {
        const user = await User.findOne({ email: req.body.email });

        // Check user email is database
        if (!user) {
            return apiResponse.notFoundResponse(res, `No user found with this email.`);
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        // Create reset password url
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

        const message = `Your password reset link is as follow:\n\n${resetUrl}\n\n If you have not request this, then please ignore that.`

        try {
            await sendEmail({
                email: user.email,
                subject: 'Jobbee-API Password Recovery',
                message
            });

            res.status(200).json({
                success: true,
                message: `Email sent successfully to: ${user.email}`
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });
            return apiResponse.ErrorResponse(res, `Email is not sent.`, error);
        }

    };

    // Reset Password   =>   /api/v1/password/reset/:token
    resetPassword = async (req, res, next) => {
        try {
            // Hash url token
            const resetPasswordToken = crypto
                .createHash('sha256')
                .update(req.params.token)
                .digest('hex');

            const user = await User.findOne({
                resetPasswordToken,
                resetPasswordExpire: { $gt: Date.now() }
            });

            if (!user) {
                return apiResponse.validationErrorWithData(res, `Password Reset token is invalid or has been expired.`);
            }

            // Setup new password
            user.password = req.body.password;

            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            sendToken(user, res);
        } catch (error) {
            // Pass the error to the next middleware
            next(error);
        }
    };

    // Logout user   =>   /api/v1/logout
    logout = async (req, res, next) => {
        res.cookie('token', 'none', {
            expires: new Date(Date.now()),
            httpOnly: true
        });
        let token= '';
        return apiResponse.successResponseWithData(res, `Logged out successfully`, token);
    };

}

module.exports = new UsersController();