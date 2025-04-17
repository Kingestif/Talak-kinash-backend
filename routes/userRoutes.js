const express = require('express');
const router = express.Router();

const {getUserProfile, updateUserProfile, searchProduct, scanBarcode, getNotification, addToWishlist, getFromWishlist, removeFromWishlist, getFeaturedProducts, filterByCategory, findSimilarImages, storeCategory, userFeed, getSimilarProducts} = require('../controllers/userController');
const {protect, verify, isUser} = require('../middlewares/userVerification');
const similarUpload = require('../middlewares/similarImage');

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     tags:
 *       - User
 *     summary: Get User Profile
 *     description: Returns the authenticated user's profile information.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
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
 *                   example: User information fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 609e12e05f35421adc876e97
 *                         name:
 *                           type: string
 *                           example: John Doe
 *                         email:
 *                           type: string
 *                           example: johndoe@example.com
 *                         role:
 *                           type: string
 *                           example: user
 *                         emailVerified:
 *                           type: boolean
 *                           example: true
 *       500:
 *         description: Failed to fetch user info
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
 *                   example: Failed to fetch user info
 */
router.route('/profile').get(protect, getUserProfile);

/**
 * @swagger
 * /api/v1/users/profile:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update User Profile
 *     description: Updates the authenticated user's profile information. The user's role cannot be updated through this endpoint.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               phone:
 *                 type: string
 *                 example: "+251911223344"
 *     responses:
 *       200:
 *         description: User profile updated successfully
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
 *                   example: User Information Updated Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 609e12e05f35421adc876e97
 *                         name:
 *                           type: string
 *                           example: John Doe
 *                         email:
 *                           type: string
 *                           example: johndoe@example.com
 *                         phone:
 *                           type: string
 *                           example: "+251911223344"
 *                         emailVerified:
 *                           type: boolean
 *                           example: true
 *       500:
 *         description: Failed to update user info
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
 *                   example: Failed to update user info
 */
router.route('/profile').patch(protect, isUser, updateUserProfile);

/**
 * @swagger
 * /api/v1/users/search:
 *   get:
 *     tags:
 *       - User
 *     summary: Search products
 *     description: Performs a full-text search for products using a keyword. Allows optional filtering by price, sorting, and pagination.
 *     parameters:
 *       - in: query
 *         name: word
 *         schema:
 *           type: string
 *         required: true
 *         description: Keyword to search products by name, description, or other indexed fields.
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         required: false
 *         description: Minimum price filter.
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         required: false
 *         description: Maximum price filter.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price, -price, latest]
 *         required: false
 *         description: Sort options `price` (asc), `-price` (desc), or `latest` (by newest).
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         required: false
 *         description: Number of results per page.
 *     responses:
 *       200:
 *         description: Products retrieved successfully
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
 *                   example: Products found
 *                 length:
 *                   type: integer
 *                   example: 3
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Missing search keyword
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: please insert search keyword
 *       500:
 *         description: Server error while searching for products
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
 *                   example: Failed to find product
 */
router.route('/search').get(protect, isUser, searchProduct);
router.route('/search').post(protect, isUser, scanBarcode);
router.route('/notifications').get(protect, isUser, getNotification);


/**
 * @swagger
 * /api/v1/users/wishlist:
 *   get:
 *     tags:
 *       - User
 *     summary: get products from wishlist
 *     description: list all products user saved on wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched from wishlist
 *       500:
 *         description: Failed to fetch from wishlist
 */
router.route('/wishlist').get(protect, isUser, getFromWishlist);
router.route('/wishlist/:id').post(protect, isUser, addToWishlist);
router.route('/wishlist/:productId').delete(protect, isUser, removeFromWishlist);
router.route('/featured-products').get(protect, isUser, getFeaturedProducts);
router.route('/filterCategory').get(protect, isUser, filterByCategory);
router.route('/similarImage').post(protect, isUser, similarUpload.single('image'), findSimilarImages);
router.route('/homepage').get(protect, isUser, userFeed);
router.route('/category').post(protect, isUser, storeCategory);
router.route('/compare/:id').get(protect, isUser, getSimilarProducts);

module.exports =  router;
    