const express = require('express');
const router = express.Router();
const authController = require('../controllers/authContoller');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');


router.route('/register').post(isAuthenticatedUser, authorizeRoles('admin'), authController.registerUser);
router.route('/login').post(authController.loginUser);

module.exports = router;