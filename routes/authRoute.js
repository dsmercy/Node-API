const express = require('express');
const router = express.Router();
const authController = require('../controllers/authContoller');


router.route('/register').post(authController.registerUser);

module.exports = router;