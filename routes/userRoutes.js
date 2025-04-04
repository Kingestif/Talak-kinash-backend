const express = require('express');
const router = express.Router();

const {getUserProfile, updateUserProfile, searchProduct, scanBarcode, getNotification, addToWishlist, getFromWishlist, removeFromWishlist, getFeaturedProducts, filterByCategory, findSimilarImages} = require('../controllers/userController');
const {protect, verify, isUser} = require('../controllers/authController');
const similarUpload = require('../middlewares/similarImage');

router.route('/profile').get(protect, isUser, getUserProfile).patch(protect, isUser, updateUserProfile);
router.route('/search').get(protect, isUser, searchProduct).post(protect, isUser, scanBarcode);
router.route('/notifications').get(protect, isUser, getNotification);
router.route('/wishlist').get(protect, isUser, getFromWishlist);
router.route('/wishlist/:id').post(protect, isUser, addToWishlist);
router.route('/wishlist/:productId').delete(protect, isUser, removeFromWishlist);
router.route('/featured-products').get(protect, isUser, getFeaturedProducts);
router.route('/filterCategory').get(protect, isUser, filterByCategory);
router.route('/similarImage').post(protect, isUser, similarUpload.single('image'), findSimilarImages);

module.exports =  router;
    