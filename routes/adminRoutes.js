const express = require('express');
const router = express.Router();
const {viewAdminProfile, viewUserProfile, viewAllUsers, viewAllSellers, viewAllProducts, pendingSellers, approveSeller, updateSubscriptionPrice, updatePromotionPrice, addPromotionPlan, getPromotionPlans, deletePromotionPlan} = require('../controllers/adminController');
const {protect, verify, isAdmin} = require('../middlewares/userVerification');
const {fetchSubPlans} = require('../controllers/sellerController');


/**
 * @swagger
 * /api/v1/admin/me:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get admin info
 *     description: Returns the details of the authenticated admin.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile fetched successfully
 *       500:
 *         description: Failed to fetch Admin profile
 */
router.route('/me').get(protect, isAdmin, viewAdminProfile);

/**
 * @swagger
 * /api/v1/admin/userprofile/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get users profile
 *     description: Returns the details of the authenticated user either seller or buyer.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user 
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users profile fetched successfully
 *       500:
 *         description: Failed to fetch the user
 */
router.route('/userprofile/:id').get(protect, isAdmin, viewUserProfile);

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all users profile
 *     description: Returns the details of the all authenticated user profiles.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users profile fetched successfully
 *       500:
 *         description: Failed to fetch the user
 */
router.route('/users').get(protect, isAdmin, viewAllUsers);

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all users profile
 *     description: Returns the details of the all authenticated user profiles.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users profile fetched successfully
 *       500:
 *         description: Failed to fetch the user
 */
router.route('/sellers').get(protect, isAdmin, viewAllSellers);


/**
 * @swagger
 * /api/v1/admin/pending:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get pening seller profile
 *     description: Returns a list of sellers who have not yet been identity verified
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending sellers fetched successfully
 *       500:
 *         description: Failed to fetch pending sellers
 */
router.route('/pending').get(protect, isAdmin, pendingSellers);


/**
 * @swagger
 * /api/v1/admin/approve/{id}:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: approve pending sellers
 *     description: Allows admin to approve pending seller
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully approved the seller
 *       500:
 *         description: Failed to approve the seller
 */
router.route('/status/:id').patch(protect, isAdmin, approveSeller);

/**
 * @swagger
 * /api/v1/admin/products:
 *   get:
 *     tags:
 *       - Admin
 *     summary: view all products
 *     description: list all registered products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched all products
 *       500:
 *         description: Failed to fetch all products
 */
router.route('/products').get(protect, isAdmin, viewAllProducts);

/**
 * @swagger
 * /api/v1/admin/updatePlan:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Update subscription price
 *     description: Allows the admin to update the price of a subscription plan by type.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - price
 *             properties:
 *               type:
 *                 type: string
 *                 example: "monthly"
 *               price:
 *                 type: number
 *                 example: 199.99
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription plan updated successfully
 *       500:
 *         description: Failed to update subscription plan
 */

router.route('/updatePlan').patch(protect, isAdmin, updateSubscriptionPrice);

/**
 * @swagger
 * /api/v1/admin/updatePlan:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Update subscription price
 *     description: Allows the admin to update the price of a subscription plan by type.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - price
 *             properties:
 *               type:
 *                 type: string
 *                 example: "monthly"
 *               price:
 *                 type: number
 *                 example: 199.99
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription plan updated successfully
 *       500:
 *         description: Failed to update subscription plan
 */
router.route('/updatePromotion/:id').patch(protect, isAdmin, updatePromotionPrice);


/**
 * @swagger
 * /api/v1/admin/createPromotion:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create Promotion Plan
 *     description: Allows the admin to create Promotion plan for sellers to promote products on.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - price
 *               - duration
 *             properties:
 *               type:
 *                 type: string
 *                 example: "2day"
 *               price:
 *                 type: number
 *                 example: 199.99
 *               duration: 
 *                 type: number
 *                 example: 2
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Promotion plan created successfully
 *       500:
 *         description: Failed to create promotion plan
 */
router.route('/createPromotion').post(protect, isAdmin, addPromotionPlan);


/**
 * @swagger
 * /api/v1/admin/getPromotion:
 *   get:
 *     tags:
 *       - Admin
 *     summary: view all promotion plans
 *     description: list all registered promotion plans
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched all promotion plans
 *       500:
 *         description: Failed to fetch promotion plans
 */
router.route('/getPromotion').get(protect, isAdmin, getPromotionPlans);


/**
 * @swagger
 * /api/v1/admin/deletePromotion/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: delete a promotion plan
 *     description: allow admin to select and delete any promotion plan
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the plan to delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Promotion plan deleted successfuly
 *       500:
 *         description: failed to delete promotion plan
 */
router.route('/deletePromotion/:id').delete(protect, isAdmin, deletePromotionPlan);


/**
 * @swagger
 * /api/v1/admin/fetchPlans:
 *   get:
 *     tags:
 *       - Admin
 *     summary: view all subscription plans
 *     description: list all registered promotion plans
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched all subscription plans
 *       500:
 *         description: Failed to fetch subscription plans
 */
router.route('/fetchPlans').get(protect, fetchSubPlans)
module.exports = router;