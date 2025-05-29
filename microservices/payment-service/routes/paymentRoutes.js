const express = require('express');
const router = express.Router();
const {initializePayment, paymentVerification, initializeFeaturePayment, isSellerSubscribed, fetchSubPlans, fetchPromoPlans, updateSubscriptionPrice, addPromotionPlan, updatePromotionPrice, deletePromotionPlan} = require('../controllers/paymentController');
const {protect, verify, isSeller, isAdmin} = require('../middlewares/userVerification');

/**
 * @swagger
 * /api/v1/payment/initialize:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Initialize subscription payment
 *     description: Allows a seller to initialize a subscription payment via Chapa.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currency
 *               - first_name
 *               - last_name
 *               - subscriptionType
 *             properties:
 *               currency:
 *                 type: string
 *                 example: ETB
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               subscriptionType:
 *                 type: string
 *                 example: monthly
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 checkout_url:
 *                   type: string
 *                   example: https://checkout.chapa.co/txn/ref123
 *                 tx_ref:
 *                   type: string
 *                   example: subscription_1713185789123_661c50b7f5e74e12a1a94c03
 *       400:
 *         description: User has an active subscription or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You already have an active subscription. Please wait until it expires before starting a new one.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: string
 *                   example: Some error message
 */
router.route('/initialize').post(protect, verify, isSeller, initializePayment);


/**
 * @swagger
 * /api/v1/payment/promoteProduct/{id}:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Initialize featured product payment
 *     description: Allows a seller to initiate a promotion payment for featuring a product.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to promote
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currency
 *               - first_name
 *               - last_name
 *               - promotionType
 *             properties:
 *               currency:
 *                 type: string
 *                 example: ETB
 *               first_name:
 *                 type: string
 *                 example: Estifanos
 *               last_name:
 *                 type: string
 *                 example: Mengesha
 *               promotionType:
 *                 type: string
 *                 example: weekly
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 checkout_url:
 *                   type: string
 *                   example: https://checkout.chapa.co/pay/abcdef123456
 *                 tx_ref:
 *                   type: string
 *                   example: promotion_1617809345_60d21b4667d0d8992e610c85
 *       400:
 *         description: Missing fields or product already featured
 *       500:
 *         description: Internal server error
 */
router.route('/promoteProduct/:id').post(protect, verify, isSeller, initializeFeaturePayment);

router.route('/verify').post(paymentVerification);

/**
 * @swagger
 * /api/v1/payment/isSubscribed:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Check if the seller is subscribed
 *     description: Returns `true` if the seller has an active subscription, otherwise `false`.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription status response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSubscribed:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */
router.route('/isSubscribed').get(protect, isSeller, isSellerSubscribed);

/**
 * @swagger
 * /api/v1/payment/fetchPlans:
 *   get:
 *     tags:
 *       - Payment 
 *     summary: Fetch all subscription plans
 *     description: Retrieve a list of all available seller subscription plans.
 *     responses:
 *       200:
 *         description: A list of subscription plans
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 plans:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 661c50b7f5e74e12a1a94c03
 *                       name:
 *                         type: string
 *                         example: Basic Plan
 *                       price:
 *                         type: number
 *                         example: 49.99
 *                       durationInDays:
 *                         type: integer
 *                         example: 30
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */
router.route('/fetchPlans').get(protect, fetchSubPlans);

/**
 * @swagger
 * /api/v1/payment/getPromotion:
 *   get:
 *     summary: Fetch all promotion plans
 *     description: Retrieves a list of all promotion plans available in the system.
 *     tags:
 *       - Payment
 *     responses:
 *       200:
 *         description: List of promotion plans successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 plans:
 *                   type: array
 *                   items:
 *       500:
 *         description: Server error
 */
router.route('/getPromotion').get(protect, fetchPromoPlans);


/**
 * @swagger
 * /api/v1/payment/updatePlan:
 *   patch:
 *     tags:
 *       - Payment
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
 * /api/v1/payment/updatePromotion/{id}:
 *   patch:
 *     summary: Update a promotion plan
 *     description: Allows an admin to update an existing promotion plan by ID.  
 *     tags:
 *       - Payment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the promotion to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the promotion
 *               price:
 *                 type: number
 *                 description: Price of the promotion
 *               duration:
 *                 type: number
 *                 description: Duration of the promotion in days (converted to milliseconds internally)
 *     responses:
 *       200:
 *         description: Promotion updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Promotion plan updated successfuly
 *       500:
 *         description: Server error
 */
router.route('/updatePromotion/:id').patch(protect, isAdmin, updatePromotionPrice);


/**
 * @swagger
 * /api/v1/payment/createPromotion:
 *   post:
 *     tags:
 *       - Payment
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
 * /api/v1/payment/deletePromotion/{id}:
 *   delete:
 *     tags:
 *       - Payment
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

module.exports = router;
