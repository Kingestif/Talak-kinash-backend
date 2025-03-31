const express = require('express');
const router = express.Router();
const {viewAdminProfile, viewUserProfile, viewAllUsers, viewAllSellers, viewAllProducts, pendingSellers, approveSeller, updateSubscriptionPrice, updatePromotionPrice, addPromotionPlan, getPromotionPlans} = require('../controllers/adminController');
const {protect, verify, isAdmin} = require('../controllers/authController');

router.route('/me').get(protect, isAdmin, viewAdminProfile);
router.route('/userprofile/:id').get(protect, isAdmin, viewUserProfile);
router.route('/users').get(protect, isAdmin, viewAllUsers);
router.route('/sellers').get(protect, isAdmin, viewAllSellers);
router.route('/pending').get(protect, isAdmin, pendingSellers);
router.route('/approve/:id').patch(protect, isAdmin, approveSeller);
router.route('/products').get(protect, isAdmin, viewAllProducts);
router.route('/updatePlan').patch(protect, isAdmin, updateSubscriptionPrice);
router.route('/updatePromotion/:id').patch(protect, isAdmin, updatePromotionPrice);
router.route('/createPromotion').post(protect, isAdmin, addPromotionPlan);
router.route('/getPromotion').get(protect, isAdmin, getPromotionPlans);
module.exports = router;