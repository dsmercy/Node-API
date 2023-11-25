const express = require('express');
const router = express.Router();
const authController = require('../controllers/authContoller');


router.route('/register').post(authController.registerUser);
router.route('/login').post(authController.loginUser);

module.exports = router;