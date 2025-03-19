const express = require('express');
const router = express.Router();
const {signup, login, verifyEmail} = require('../controllers/authController');

router.route('/register').post(signup);
router.route('/login').post(login);
router.route('/verify/:token').get(verifyEmail);

module.exports = router;  