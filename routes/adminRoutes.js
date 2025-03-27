const express = require('express');
const router = express.Router();
const {viewAdminProfile, viewUserProfile, viewAllUsers, viewAllSellers, viewPendingProducts, viewAllProducts, updateProductStatus, pendingSellers, approveSeller, updateSubscriptionPrice} = require('../controllers/adminController');

router.route('/me').get(viewAdminProfile);
router.route('/userprofile').get(viewUserProfile);
router.route('/users').get(viewAllUsers);
router.route('/sellers').get(viewAllSellers);
router.route('/pending').get(pendingSellers);
router.route('/approve/:id').patch(approveSeller);
router.route('/pendingproducts').get(viewPendingProducts);
router.route('/products').get(viewAllProducts);
router.route('/updateproduct').patch(updateProductStatus);
router.route('/updatePlan').patch(updateSubscriptionPrice);
module.exports = router;