const express = require('express');
const router = express.Router();
const {postProduct, updateProduct, deleteProduct, getAllProducts, initializeFeaturePayment, isSellerSubscribed, fetchSubPlans} = require('../controllers/sellerController');
const {protect, verify, isUser, isAdmin, isSeller} = require('../middlewares/userVerification');
const {sellerPaymentVerified} = require('../middlewares/verifySubscription');
const productImageUpload = require('../middlewares/productImageMiddleware');

router.route('/product').post(protect, verify, isSeller, sellerPaymentVerified, productImageUpload.array('images'), postProduct).get(protect, isSeller, getAllProducts);
router.route('/product/:id').delete(protect, isSeller, deleteProduct).patch(protect, isSeller, updateProduct);
router.route('/promoteProduct/:id').post(protect, verify, isSeller, initializeFeaturePayment);
router.route('/isSubscribed').get(protect, isSeller, isSellerSubscribed);
router.route('/fetchPlans').get(protect, fetchSubPlans);

module.exports =  router; 
