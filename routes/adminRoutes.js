const express = require('express');
const router = express.Router();
const {viewAdminProfile, viewUserProfile, viewAllUsers, viewAllSellers, viewAllProducts, pendingSellers, approveSeller, updateSubscriptionPrice, updatePromotionPrice} = require('../controllers/adminController');
const {protect, verify, isAdmin} = require('../controllers/authController');

router.route('/me').get(protect, verify, isAdmin, viewAdminProfile);
router.route('/userprofile/:id').get(protect, verify, isAdmin, viewUserProfile);
router.route('/users').get(protect, verify, isAdmin, viewAllUsers);
router.route('/sellers').get(protect, verify, isAdmin, viewAllSellers);
router.route('/pending').get(protect, verify, isAdmin, pendingSellers);
router.route('/approve/:id').patch(protect, verify, isAdmin, approveSeller);
router.route('/products').get(protect, verify, isAdmin, viewAllProducts);
router.route('/updatePlan').patch(protect, verify, isAdmin, updateSubscriptionPrice);
router.route('/updatePromotion').patch(protect, verify, isAdmin, updatePromotionPrice);
module.exports = router;