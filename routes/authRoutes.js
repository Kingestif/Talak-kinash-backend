const express = require('express');
const router = express.Router();
const {signup, login, verifyEmail} = require('../controllers/authController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

router.route('/register').post(uploadMiddleware.single('identification'), signup);
router.route('/login').post(login);
router.route('/verify/:token').post(verifyEmail);

module.exports = router;  