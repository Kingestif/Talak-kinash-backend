const express = require('express');
const router = express.Router();
const {initializePayment, paymentVerification} = require('../controllers/chapaController');
const {protect, verify, isSeller} = require('../middlewares/userVerification');

/**
 * @swagger
 * /api/v1/chapa/initialize:
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
router.route('/verify').post(paymentVerification);

module.exports = router;
