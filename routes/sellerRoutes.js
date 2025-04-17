const express = require('express');
const router = express.Router();
const {postProduct, updateProduct, deleteProduct, getAllProducts, initializeFeaturePayment, isSellerSubscribed, fetchSubPlans, fetchPromoPlans} = require('../controllers/sellerController');
const {protect, verify, isUser, isAdmin, isSeller} = require('../middlewares/userVerification');
const {sellerPaymentVerified} = require('../middlewares/verifySubscription');
const productImageUpload = require('../middlewares/productImageMiddleware');

/**
 * @swagger
 * /api/v1/sellers/product:
 *   post:
 *     tags:
 *       - Seller
 *     summary: Upload a new product
 *     description: Allows the user (seller) to upload a new product with details like name, description, price, category, and images.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Smartphone"
 *               description:
 *                 type: string
 *                 example: "A high-end smartphone with excellent features."
 *               price:
 *                 type: number
 *                 example: 999.99
 *               category:
 *                 type: string
 *                 example: "Electronics"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: The images to upload for the product.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Product uploaded successfully
 *       400:
 *         description: At least one image is required
 *       500:
 *         description: Failed to upload the product
 */
router.route('/product').post(protect, verify, isSeller, sellerPaymentVerified, productImageUpload.array('images'), postProduct);

/**
 * @swagger
 * /api/v1/sellers/product:
 *   get:
 *     tags:
 *       - Seller
 *     summary: Get all products of a seller
 *     description: Fetches all products posted by the authenticated seller.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched all seller's products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Successfully fetched all sellers product"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Failed to fetch seller's products
 */
router.route('/product').get(protect, isSeller, getAllProducts);

/**
 * @swagger
 * /api/v1/sellers/product/{id}:
 *   delete:
 *     tags:
 *       - Seller
 *     summary: Delete a product
 *     description: Deletes a product posted by the authenticated seller.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to delete.
 *         schema:
 *           type: string
 *           example: "60d5f7f29b43f5b47cda13a1"
 *     responses:
 *       204:
 *         description: Successfully deleted the product
 *       500:
 *         description: Failed to delete the product
 */
router.route('/product/:id').delete(protect, isSeller, deleteProduct);

/**
 * @swagger
 * /api/v1/sellers/product/{id}:
 *   patch:
 *     tags:
 *       - Seller
 *     summary: Update a product
 *     description: Updates details of an existing product posted by the authenticated seller.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to update.
 *         schema:
 *           type: string
 *           example: "60d5f7f29b43f5b47cda13a1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Product Name"
 *               description:
 *                 type: string
 *                 example: "Updated product description."
 *               price:
 *                 type: number
 *                 example: 99.99
 *               category:
 *                 type: string
 *                 example: "Electronics"
 *               tag:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "tag1"
 *     responses:
 *       200:
 *         description: Successfully updated the product
 *       500:
 *         description: Failed to update the product
 */
router.route('/product/:id').patch(protect, isSeller, updateProduct);

/**
 * @swagger
 * /api/v1/sellers/promoteProduct/{id}:
 *   post:
 *     tags:
 *       - Seller
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

/**
 * @swagger
 * /api/v1/sellers/isSubscribed:
 *   get:
 *     tags:
 *       - Seller
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
 * /api/v1/sellers/fetchPlans:
 *   get:
 *     tags:
 *       - Seller 
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

router.route('/getPromotion').get(protect, fetchPromoPlans);

module.exports =  router; 
