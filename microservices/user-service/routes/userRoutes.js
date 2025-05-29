const express = require('express');
const router = express.Router();

const {getUserProfile, updateUserProfile, addToWishlist, getFromWishlist, removeFromWishlist, storeCategory, viewAdminProfile, viewUserProfile, viewAllUsers, viewAllSellers, pendingSellers, approveSeller} = require('../controllers/userController');
const {protect, isUser, isAdmin} = require('../middlewares/userVerification');

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
 */
router.route('/profile').patch(protect, isUser, updateUserProfile);


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

/**
 * @swagger
 * /api/v1/users/wishlist/{id}:
 *   post:
 *     tags:
 *       - User
 *     summary: Add a product to the wishlist
 *     description: Adds a product to the authenticated user's wishlist by product ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the product to add
 *         schema:
 *           type: string
 *           example: 67eb0723a7ae4befc9982802
 *     responses:
 *       200:
 *         description: Product added to wishlist successfully
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
 *                   example: Product added to wishlist
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Server error while adding product to wishlist
 */
router.route('/wishlist/:id').post(protect, isUser, addToWishlist);

/**
 * @swagger
 * /api/v1/users/wishlist/{productId}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Remove a product from the wishlist
 *     description: Removes a product from the authenticated user's wishlist using the product ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: ID of the product to remove from wishlist
 *         schema:
 *           type: string
 *           example: 67eb0723a7ae4befc9982802
 *     responses:
 *       204:
 *         description: Product removed from wishlist successfully
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
 *                   example: Product removed from wishlist
 *                 wishlist:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Server error while removing product from wishlist
 */
router.route('/wishlist/:productId').delete(protect, isUser, removeFromWishlist);

/**
 * @swagger
 * /api/v1/users/category:
 *   post:
 *     tags:
 *       - User
 *     summary: Save user category preferences
 *     description: Stores selected category preferences for a user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Electronics", "Fashion", "Groceries"]
 *     responses:
 *       200:
 *         description: Successfully saved user preferences
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
 *                   example: Successfully saved user preferences
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Electronics", "Fashion"]
 *       400:
 *         description: No categories provided
 *       500:
 *         description: Server error while storing preferences
 */
router.route('/category').post(protect, isUser, storeCategory);


/**
 * @swagger
 * /api/v1/users/admin:
 *   get:
 *     tags:
 *       - User
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
router.route('/admin').get(protect, isAdmin, viewAdminProfile);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags:
 *       - User
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
router.route('/').get(protect, isAdmin, viewAllUsers);

/**
 * @swagger
 * /api/v1/users/sellers:
 *   get:
 *     tags:
 *       - User
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
 * /api/v1/users/sellers/pending:
 *   get:
 *     tags:
 *       - User
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
router.route('/sellers/pending').get(protect, isAdmin, pendingSellers);

/**
 * @swagger
 * /api/v1/users/status/{id}:
 *   patch:
 *     summary: Approve or decline a seller application
 *     description: Allows an admin to approve or decline a seller.  
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the seller to approve or decline
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approve, decline]
 *                 description: Status to update the seller with
 *               reason:
 *                 type: string
 *                 description: Reason for declining the seller (required if status is 'decline')
 *     responses:
 *       200:
 *         description: Seller status successfully updated
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
 *                   example: Successfully updated sellers status
 *       400:
 *         description: Bad request due to missing or invalid inputs
 *       404:
 *         description: Seller not found
 *       500:
 *         description: Server error
 */
router.route('/status/:id').patch(protect, isAdmin, approveSeller);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     tags:
 *       - User
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
router.route('/:id').get(protect, viewUserProfile);

module.exports =  router;
    