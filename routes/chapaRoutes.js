const express = require('express');
const router = express.Router();
const {initializePayment, verifyPayment} = require('../controllers/chapaController');

router.route('/initialize').post(initializePayment);
router.route('/verify/:tx_ref').get(verifyPayment);

module.exports = router;
