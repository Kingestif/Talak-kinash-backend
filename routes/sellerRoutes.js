const express = require('express');
const router = express.Router();
const {postProduct, updateProduct, deleteProduct, getAllProducts, initializeFeaturePayment} = require('../controllers/sellerController');
const {protect, verify, isUser, isAdmin, isSeller} = require('../controllers/authController');
const {sellerPaymentVerified} = require('../controllers/chapaController');
const productImageUpload = require('../middlewares/productImageMiddleware');

router.route('/product').post(protect, verify, isSeller, sellerPaymentVerified, productImageUpload.array('images'), postProduct).get(protect, isSeller, getAllProducts);
router.route('/product/:id').delete(protect, isSeller, deleteProduct).patch(protect, isSeller, updateProduct);
router.route('/promoteProduct/:id').post(protect, verify, isSeller, initializeFeaturePayment);

module.exports =  router; 
