const express = require('express');
const router = express.Router();
const {postProduct, updateProduct, deleteProduct} = require('../controllers/sellerController');
const {protect, verify, isUser, isAdmin, isSeller} = require('../controllers/authController');

router.route('/product').post(protect, verify, isSeller, postProduct).patch(updateProduct);
router.route('/product/:productId').delete(deleteProduct);

module.exports =  router; 
