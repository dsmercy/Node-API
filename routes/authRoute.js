const express = require('express');
const router = express.Router();
const authController = require('../controllers/authContoller');
const { isAuthenticatedUser } = require('../middlewares/auth');


router.route('/register').post(isAuthenticatedUser, authController.registerUser);
router.route('/login').post(authController.loginUser);

module.exports = router;