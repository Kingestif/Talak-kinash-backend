const express = require('express');
const router = express.Router();
const {postProduct, updateProduct, deleteProduct} = require('../controllers/sellerController');

router.route('/product').post(postProduct).patch(updateProduct)
router.route('/product/:productId').delete(deleteProduct);

module.exports =  router; 
