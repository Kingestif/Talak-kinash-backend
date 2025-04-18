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
 *       400:
 *         description: Missing search keyword
 *       500:
 *         description: Server error while searching for products
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
 * /api/v1/users/featured-products:
 *   get:
 *     tags:
 *       - User
 *     summary: Get featured products
 *     description: Fetch all products marked as featured and still within their featured duration.
 *     responses:
 *       200:
 *         description: Featured products fetched successfully
 *       500:
 *         description: Server error while fetching featured products
 */
router.route('/featured-products').get(protect, isUser, getFeaturedProducts);

/**
 * @swagger
 * /api/v1/users/filterCategory:
 *   get:
 *     tags:
 *       - User
 *     summary: Filter products by category
 *     description: Fetch products by a specific category with optional filters for price, sorting, and pagination.
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name to filter products
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price, -price, latest]
 *         description: Sort by price (asc/desc) or latest
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of products per page
 *     responses:
 *       200:
 *         description: Products successfully fetched by category
 *       400:
 *         description: Missing category in query
 *       500:
 *         description: Server error during filtering
 */
router.route('/filterCategory').get(protect, isUser, filterByCategory);

/**
 * @swagger
 * /api/v1/users/similarImage:
 *   post:
 *     tags:
 *       - User
 *     summary: Find similar products based on image
 *     description: Upload an image and get similar products using an external AI-powered similarity service.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to be uploaded
 *     responses:
 *       200:
 *         description: Successfully found similar products
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
 *                   example: Successfully found similar products
 *                 similar_products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       imageUrl:
 *                         type: string
 *                         example: https://example.com/similar/image1.jpg
 *                       similarityScore:
 *                         type: number
 *                         format: float
 *                         example: 0.92
 *                       product:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             example: 661cbcba485a4b9eebdd52cb
 *                           name:
 *                             type: string
 *                             example: Wireless Headphones
 *                           description:
 *                             type: string
 *                             example: Noise-canceling wireless headphones
 *                           price:
 *                             type: number
 *                             format: float
 *                             example: 99.99
 *                           category:
 *                             type: string
 *                             example: Electronics
 *                           tag:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["audio", "headphones"]
 *       400:
 *         description: No image uploaded
 *       404:
 *         description: No similar products found
 *       500:
 *         description: Server error while finding similar products
 */
router.route('/similarImage').post(protect, isUser, similarUpload.single('image'), findSimilarImages);

/**
 * @swagger
 * /api/v1/users/homepage:
 *   get:
 *     tags:
 *       - User
 *     summary: Get personalized product feed for user
 *     description: Returns a personalized product feed based on user's preferred categories. If there are not enough products in the preferred categories, the rest are filled with random products.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of products per page
 *     responses:
 *       200:
 *         description: Successfully fetched personalized feed
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
 *                   example: Successfully fetched personalized feed
 *                 length:
 *                   type: integer
 *                   example: 20
 *                 products:
 *                   type: array
 *       500:
 *         description: Error fetching user feed
 */
router.route('/homepage').get(protect, isUser, userFeed);

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
 * /api/v1/users/compare/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get similar products based on image embedding
 *     description: Fetches products that are most similar to the given product based on image embeddings using cosine similarity.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the product to find similar items for
 *         schema:
 *           type: string
 *           example: 67eb0723a7ae4befc9982802
 *     responses:
 *       200:
 *         description: Successfully retrieved similar products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 length:
 *                   type: integer
 *                   example: 10
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       category:
 *                         type: string
 *                       similarity:
 *                         type: number
 *                         description: Cosine similarity score with the queried product
 *       404:
 *         description: Product or embedding not found
 *       500:
 *         description: Server error while fetching similar products
 */
router.route('/compare/:id').get(protect, isUser, getSimilarProducts);

module.exports =  router;
    