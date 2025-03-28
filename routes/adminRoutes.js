const express = require('express');
const router = express.Router();
const {viewAdminProfile, viewUserProfile, viewAllUsers, viewAllSellers, viewAllProducts, pendingSellers, approveSeller, updateSubscriptionPrice, updatePromotionPrice} = require('../controllers/adminController');
const {protect, verify, isAdmin} = require('../controllers/authController');

router.route('/me').get(viewAdminProfile);
router.route('/userprofile/:id').get(viewUserProfile);
router.route('/users').get(viewAllUsers);
router.route('/sellers').get(viewAllSellers);
router.route('/pending').get(pendingSellers);
router.route('/approve/:id').patch(approveSeller);
router.route('/products').get(viewAllProducts);
router.route('/updatePlan').patch(updateSubscriptionPrice);
router.route('/updatePromotion').patch(updatePromotionPrice);
module.exports = router;