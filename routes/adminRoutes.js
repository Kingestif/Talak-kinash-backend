const express = require('express');
const router = express.Router();
const {viewAdminProfile, viewUserProfile, viewAllUsers, viewAllSellers, viewPendingProducts, viewAllProducts, updateProductStatus} = require('../controllers/adminController');

router.route('/me').get(viewAdminProfile);
router.route('/userprofile').get(viewUserProfile);
router.route('/users').get(viewAllUsers);
router.route('/sellers').get(viewAllSellers);
router.route('/pendingproducts').get(viewPendingProducts);
router.route('/products').get(viewAllProducts);
router.route('/updateproduct').patch(updateProductStatus);

module.exports = router;