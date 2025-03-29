const express = require('express');
const router = express.Router();

const {getUserProfile, updateUserProfile, searchProduct, scanBarcode, getNotification, addToWishlist, getFromWishlist, removeFromWishlist, getFeaturedProducts} = require('../controllers/userController');
const {protect, verify, isUser} = require('../controllers/authController');


router.route('/profile').get(protect, verify, isUser, getUserProfile).patch(protect, verify, isUser, updateUserProfile);
router.route('/search').get(protect, verify, isUser, searchProduct).post(protect, verify, isUser, scanBarcode);
router.route('/notifications').get(protect, verify, isUser, getNotification);
router.route('/wishlist').get(protect, verify, isUser, getFromWishlist);
router.route('/wishlist/:id').post(protect, verify, isUser, addToWishlist);
router.route('/wishlist/:productId').delete(protect, verify, isUser, removeFromWishlist);
router.route('/featured-products').get(protect, verify, isUser, getFeaturedProducts);

module.exports =  router;
    