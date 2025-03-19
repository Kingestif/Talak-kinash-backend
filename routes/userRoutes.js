const express = require('express');
const router = express.Router();

const {getUserProfile, updateUserProfile, searchProduct, scanBarcode, getNotification, addToWishlist, getFromWishlist, removeFromWishlist} = require('../controllers/userController');
const {protect, verify, isUser} = require('../controllers/authController');


router.route('/profile').get(protect, verify, isUser, getUserProfile).patch(updateUserProfile);
router.route('/search').get(searchProduct).post(scanBarcode);
router.route('/notifications').get(getNotification);
router.route('/wishlist').get(getFromWishlist).post(addToWishlist);
router.route('/wishlist/:productId').delete(removeFromWishlist);

module.exports =  router;
    