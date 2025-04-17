const express = require('express');
const router = express.Router();
const {signup, login, verifyEmail, confirmLink} = require('../controllers/authController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Registers a new user and sends an email verification link. Can handle referrals and file upload (identification).
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: "+251912345678"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: mySecret123
 *               role:
 *                 type: string
 *                 example: seller
 *               gender:
 *                 type: string
 *                 example: male
 *               birthday:
 *                 type: string
 *                 format: date
 *                 example: 1998-01-15
 *               referredBy:
 *                 type: string
 *                 example: REF12345
 *               shopName:
 *                 type: string
 *                 example: John's Electronics
 *               storeLocation:
 *                 type: string
 *                 example: Addis Ababa, Bole
 *               storeLink:
 *                 type: string
 *                 example: https://johnstore.com
 *               chapaApi:
 *                 type: string
 *                 example: chp_live_123456789
 *               identification:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully. Verification email sent.
 *       400:
 *         description: Invalid input (e.g., duplicate email or bad referral code).
 *       500:
 *         description: Internal server error
 */
router.route('/register').post(uploadMiddleware.single('identification'), signup);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Log in a user
 *     description: Authenticates a user with email and password and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: mySecret123
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR...
 *                 role:
 *                   type: string
 *                   example: seller
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.route('/login').post(login);

/**
 * @swagger
 * /api/v1/auth/confirmation-link/{token}:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Email confirmation page
 *     description: Returns a verification form to confirm a user's email but since swagger can't excute HTML directly it have to be opened on browsers.
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: The email verification token.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: HTML form to verify email is returned
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<h1>Email Verification</h1>..."
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Internal server error
 */
router.route('/confirmation-link/:token').get(confirmLink);

/**
 * @swagger
 * /api/v1/auth/verify/{token}:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify user's email
 *     description: Verifies the user's email using the one time verification token sent to their email.
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: The verification token sent to the user's email.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email successfully verified and user redirected
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Server error
 */
router.route('/verify/:token').post(verifyEmail);

module.exports = router;  