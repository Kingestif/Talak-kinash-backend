const express = require('express');
const router = express.Router();

const {searchProduct, getFeaturedProducts, filterByCategory, findSimilarImages, userFeed, getSimilarProducts, nearProducts, postProduct, updateProduct, deleteProduct, getAllProducts, viewAllProducts} = require('../controllers/productController');
const {protect, verify, isUser, isSeller, isAdmin} = require('../middlewares/userVerification');
const similarUpload = require('../middlewares/similarImage');
const {sellerPaymentVerified} = require('../middlewares/verifySubscription');
const productImageUpload = require('../middlewares/productImageMiddleware');

/**
 * @swagger
 * /api/v1/products/search:
 *   get:
 *     tags:
 *       - Product
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

/**
 * @swagger
 * /api/v1/products/featured-products:
 *   get:
 *     tags:
 *       - Product
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
 * /api/v1/products/filterCategory:
 *   get:
 *     tags:
 *       - Product
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
 * /api/v1/products/similarImage:
 *   post:
 *     tags:
 *       - Product
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
 * /api/v1/products/homepage:
 *   get:
 *     tags:
 *       - Product
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
 * /api/v1/products/compare/{id}:
 *   get:
 *     tags:
 *       - Product
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

/**
 * @swagger
 * /api/v1/products/near-products:
 *   get:
 *     summary: Get products near a specific location
 *     description: Retrieves a list of products that are located near the provided latitude and longitude.
 *     tags:
 *       - Product
 *     parameters:
 *       - name: lat
 *         in: query
 *         required: true
 *         description: Latitude of the location
 *         schema:
 *           type: number
 *           example: 8.7
 *       - name: lng
 *         in: query
 *         required: true
 *         description: Longitude of the location
 *         schema:
 *           type: number
 *           example: 38.4
 *       - name: maxDistance
 *         in: query
 *         required: false
 *         description: Maximum distance from the location in meters. Default is 10000 meters (10 km).
 *         schema:
 *           type: number
 *           example: 10000
 *       - name: word
 *         in: query
 *         required: false
 *         description: Search word to filter products by title or description
 *         schema:
 *           type: string
 *           example: "laptop"
 *     responses:
 *       200:
 *         description: Successfully retrieved products near the specified location
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
 *                   example: Successfully returned products based on proximity
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Product ID
 *                       title:
 *                         type: string
 *                         description: Product title
 *                       description:
 *                         type: string
 *                         description: Product description
 *                       price:
 *                         type: number
 *                         description: Product price
 *                       productLocation:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             example: Point
 *                           coordinates:
 *                             type: array
 *                             items:
 *                               type: number
 *                             example: [38.4, 8.7]
 *                       distance:
 *                         type: number
 *                         description: Distance from the provided location in meters
 *                       images:
 *                         type: object
 *                         properties:
 *                           embedding:
 *                             type: string
 *                             description: Image embedding (omitted in this response)
 *       400:
 *         description: Latitude and longitude are required
 *       500:
 *         description: Server error
 */
router.route('/near-products').get(protect, isUser, nearProducts);


/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     tags:
 *       - Product
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
 *               productLink:
 *                 type: string
 *                 example: "jiji.com"
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
router.route('/').post(protect, verify, isSeller, sellerPaymentVerified, productImageUpload.array('images'), postProduct);

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     tags:
 *       - Product
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
 *       500:
 *         description: Failed to fetch seller's products
 */
router.route('/').get(protect, isSeller, getAllProducts);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     tags:
 *       - Product
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
router.route('/:id').delete(protect, isSeller, deleteProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   patch:
 *     tags:
 *       - Product
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
router.route('/:id').patch(protect, isSeller, updateProduct);


/**
 * @swagger
 * /api/v1/products/all:
 *   get:
 *     tags:
 *       - Product
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
router.route('/all').get(protect, isAdmin, viewAllProducts);

module.exports =  router;
    