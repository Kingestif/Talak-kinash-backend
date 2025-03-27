const express = require('express');
const router = express.Router();
const {postProduct, updateProduct, deleteProduct, getAllProducts} = require('../controllers/sellerController');
const {protect, verify, isUser, isAdmin, isSeller} = require('../controllers/authController');
const {sellerPaymentVerified} = require('../controllers/chapaController');

router.route('/product').post(protect, verify, isSeller, sellerPaymentVerified, postProduct);
router.route('/product/:id').get(protect, verify, isSeller, sellerPaymentVerified, getAllProducts).delete(protect, verify, isSeller, sellerPaymentVerified, deleteProduct).patch(protect, verify, isSeller, sellerPaymentVerified, updateProduct);

module.exports =  router; 
