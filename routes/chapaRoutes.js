const express = require('express');
const router = express.Router();
const {initializePayment, paymentVerification} = require('../controllers/chapaController');
const {protect, verify, isSeller} = require('../middlewares/userVerification');


router.route('/initialize').post(protect, verify, isSeller, initializePayment);
router.route('/verify').post(paymentVerification);

module.exports = router;
