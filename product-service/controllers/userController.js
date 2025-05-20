const User = require('../models/users');
const Product = require('../models/product'); 

exports.getUserProfile = async(req, res) => {
    
    try{

        return res.status(200).json({
            status: "success",
            message: "User information fetched successfully",
            data: {
                user: req.user,
            }
        });

    }catch(error){
        console.log(error.message)
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch user info"
        });

    }
}


exports.updateUserProfile = async(req, res) => {
    try{
        const {role, ...updateData} = req.body
        const user = await User.findByIdAndUpdate(req.user._id, updateData, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({
            status: "success",
            message: "User Information Updated Successfully",
            data: {
                user: user
            }
        });
    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "Failed to update user info",
        });
    }
}

exports.addToWishlist = async(req, res) => {
    try{
        const userId = req.user._id;
        const productId = req.params.id;

        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                status: "erorr",
                message: "Product not found"
            });
        }

        const user = await User.findByIdAndUpdate(userId,
            {$addToSet: {wishlist: productId}},
            {new: true}
        );

        return res.status(200).json({
            status: "success",
            message: "Product added to wishlist"
        });

    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "Error adding product to wishlist",
            error: error.message
        });
    }
}

exports.getFromWishlist = async(req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('wishlist');

    try{
        return res.status(200).json({
            status: "success",
            message: "Successfully fetched from wishlist",
            data: {
                wishlist: user.wishlist
            }
        });

    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch from wishlist"
        });
    }
}

exports.removeFromWishlist = async(req, res) => {
    try{
        const userId = req.user._id;
        const productId = req.params.productId;
        const user = await User.findByIdAndUpdate(userId, 
            {$pull: {wishlist: productId}},
            {new: true}
        );

        return res.status(204).json({
            status: "success",
            message: "Product removed from wishlist",
            wishlist: user.wishlist
        });

    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "Error removing product from wishlist"
        });
    }
}

// exports.getFeaturedProducts = async(req, res) => {
//     try{
//         const now = new Date();
//         const preference = req.user.preferences.categories;


//         const products = await Product.find({
//             isFeatured: true,
//             category: {$in:preference}
//         }).sort({ featuredUntil: 1 }).select('-images.embedding');

//         return res.status(200).json({
//             status: "success",
//             length: products.length,
//             message: "Successfuly fetched featured products",
//             product: products
//         });

//     }catch(error){
//         return res.status(500).json({
//             status: "error",
//             message: "Error fetching featured products"
//         });
//     }
// }

// exports.filterByCategory = async(req, res) => {
//     try{
//         const { category, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;

//         if (!category) {
//             return res.status(400).json({ status: "error", message: "Category is required" });
//         }

//         let query = {category};

//         // price filter
//         if(minPrice || maxPrice){
//             query.price = {};
//             if (minPrice) query.price.$gte = parseFloat(minPrice);
//             if (maxPrice) query.price.$lte = parseFloat(maxPrice);
//         }

//         // sorting
//         let sorting = {};
//         if(sort === "price") sorting.price = 1;
//         if(sort === "-price") sorting.price = -1;
//         if(sort === "latest") sorting.createdAt = -1;

//         // pagination
//         const pageNumber = parseInt(page, 10);
//         const pageSize = parseInt(limit, 10);
//         const skip = (pageNumber - 1) * pageSize;

        
//         const product = await Product.find(query).sort(sorting).skip(skip).limit(pageSize);

//         if(!product || !product.length){
//             return res.status(200).json({
//                 status: "success",
//                 products:  []
//             });
//         }
    
//         return res.status(200).json({
//             status: "success",
//             message: `Successfull fetched ${category} products`,
//             length: product.length,
//             products: product
//         });

//     }catch(error){
//         return res.status(500).json({
//             status: "error",
//             message: `Failed to fetch ${category} products`,
//         });
//     }
// }

// exports.searchProduct = async(req, res) => {
//     try{
//         const { word, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;
//         let query = {};


//         if (!word) {
//             return res.status(400).json({message: "please insert search keyword"});  
//         }

//         query.$text = { $search: word };

//         // price
//         if(minPrice || maxPrice){
//             query.price = {};
//             if (minPrice) query.price.$gte = parseFloat(minPrice);
//             if (maxPrice) query.price.$lte = parseFloat(maxPrice);
//         }

//         // sorting
//         let sorting = {};
//         sorting.score = { $meta: "textScore" };     //IMPORTANT!! this will sort our products by relevance! based on score they get from $text otherwise we will just get the products BUT in random ordering wh is not good. But now it will use the score specified on schema "weight"

//         if (sort === "price") sorting.price = 1;
//         if (sort === "-price") sorting.price = -1;
//         if (sort === "latest") sorting.createdAt = -1;

//         // pagination
//         const pageNumber = parseInt(page, 10);
//         const pageSize = parseInt(limit, 10);
//         const skip = (pageNumber - 1) * pageSize;

//         let products = await Product.find(query).sort(sorting).skip(skip).limit(pageSize).select({ score: { $meta: "textScore" } });

//         return res.status(200).json({
//             status: "success",
//             message: "Products found",
//             length: products.length,
//             products: products
//         });

//     }catch(error){
//         console.log(error.message);
//         return res.status(500).json({
//             status: "error",
//             message: "Failed to find product"
//         });
//     }
// }

// exports.findSimilarImages = async(req, res) => {
//     try {
//         if(!req.file){
//             return res.status(400).json({
//                 status: "error",
//                 message: "please upload an image"
//             });
//         }
//         const imageUrl = req.file.path;

//         const response = await axios.post(`${process.env.CLIPAI_BASE_URL}/find-similar-images`, {
//             image_url: imageUrl
//         });

//         if (!response.data || !response.data.similar_images || response.data.similar_images.length === 0) {
//             return res.status(404).json({
//                 status: "error",
//                 message: "No similar products found"
//             });
//         }

//         const productIds = response.data.similar_images.map(image => image.product_id);
//         const products = await Product.find({ '_id': { $in: productIds } });

//         const similarProducts = response.data.similar_images.map(image => {
//             const product = products.find(p => p._id.toString() === image.product_id);
//             if (product) {
//                 return {
//                     imageUrl: image.image_url,  // URL of the similar image
//                     similarityScore: image.similarity_score,  
//                     product: {  
//                         productId: product._id,
//                         name: product.name,
//                         description: product.description,
//                         price: product.price,
//                         category: product.category,
//                         tag: product.tag
//                     }
//                 };
//             }
//         }).filter(product => product); 

//         if (similarProducts.length > 0) {
//             return res.status(200).json({
//                 status: "success",
//                 message: "Successfully found similar products",
//                 similar_products: similarProducts
//             });
//         } else {
//             return res.status(404).json({
//                 status: "error",
//                 message: "No similar products found in the database"
//             });
//         }

//     } catch (error) {
//         return res.status(500).json({
//             status: "error",
//             message: "Unable to find similar products",
//         });
//     }
// }

exports.storeCategory = async(req, res) => {
    try{
        const categories = req.body.categories;
        if(!categories){
            return res.status(400).json({message: "please choose 1 or more categories"});
        }

        const userId = req.user._id;
        await User.findByIdAndUpdate(userId, {
            'preferences.categories': categories
        });

        return res.status(200).json({
            status: "success",
            message: "Successfully saved user preferences",
            categories: categories
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            status: "error",
            message: "error storing user preference"
        });
    }
}

// exports.userFeed = async(req, res) => {
//     try{
//         const { page = 1, limit = 20 } = req.query;

//         const pageNumber = parseInt(page, 10);
//         const pageSize = parseInt(limit, 10);
//         const skip = (pageNumber - 1) * pageSize;


//         const categories = req.user.preferences.categories;
//         let products = await Product.find({ category: { $in: categories } });
//         products = products.sort(() => Math.random() - 0.5); // Shuffle array
//         products = products.slice(skip, skip + pageSize);

//         if (products.length < pageSize) {
//             // Fill remaining space with random products 
//             const remainingSpace = pageSize - products.length;
            
//             const randomProducts = await Product.aggregate([
//                 { $match: { category: { $nin: categories } } },
//                 { $sample: { size: remainingSpace } }  
//             ]);
//             products = products.concat(randomProducts); 
//         }

//         return res.status(200).json({
//             status: "success",
//             message: "Successfully fetched personalized feed",
//             length: products.length,
//             products: products
//         });
//     }catch(error){
//         console.log(error);
//         return res.status(500).json({
//             status: "error",
//             message: "error fetching user feed"
//         });
//     }
// }

// function cosineSimilarity(a, b) {
//     const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
//     const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
//     const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
//     return dot / (magA * magB);
// }
  
// exports.getSimilarProducts = async (req, res) => {
//     try {
//         const productId = req.params.id;
  
//         const clickedProduct = await Product.findById(productId);
//         if (!clickedProduct || !clickedProduct.images[0]?.embedding) {
//             return res.status(404).json({ error: 'Product or embedding not found' });
//         }
    
//         const clickedEmbedding = clickedProduct.images[0].embedding;
    
//         const candidates = await Product.find({
//             _id: { $ne: productId },
//             'images.0.embedding': { $exists: true },
//             category: { $in: clickedProduct.category }  
//         });
    
//         const ranked = candidates.map(product => {
//             const embedding = product.images[0].embedding;
//             const similarity = cosineSimilarity(clickedEmbedding, embedding);
//             return { product, similarity };
//         });
    
//         ranked.sort((a, b) => b.similarity - a.similarity);
    
//         const topSimilar = ranked.slice(0, 10).map(item => ({
//             ...item.product.toObject(),
//             similarity: item.similarity
//         }));
    
//         res.status(200).json({
//             length: topSimilar.length,
//             products: topSimilar
//         });

//     } catch (error) {
//         console.error('Error fetching similar products:', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };

// exports.forgotPassword = async(req, res) => {
//     try{
//         const email = req.body.email;
//         const user = await User.findOne({email: email});

//         if (!user) {
//             return res.status(404).json({ message: "User not found!" });
//         }

//         const resetToken = crypto.randomBytes(32).toString("hex");
//         const hash = crypto.createHash("sha256").update(resetToken).digest("hex");

//         user.resetPasswordToken = hash;
//         user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
//         await user.save();

//         const resetURL = `${process.env.FRONTEND_BASE_URL}/forgot-password/${resetToken}`;
//         const message = `
//             <p>Hello ${user.name},</p>
//             <p>You requested to reset your password. Click the link below:</p>
//             <a href="${resetURL}">${resetURL}</a>
//             <p>This link will expire in 15 minutes.</p>
//         `;

//         await sendEmail({
//             email: user.email,
//             subject: 'Password reset request',
//             message
//         });


//         return res.status(200).json({
//             status: "success",
//             message: "Reset link is sent. please check your email"
//         });

//     }catch(error){
//         return res.status(500).json({
//             status: "error",
//             message: error.message
//         });
//     }
// };

// exports.resetPassword = async(req, res) => {
//     try{
//         const resetToken = req.params.token;
//         const password = req.body.password;

//         const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
//         const user = await User.findOne({
//             resetPasswordToken: hashedToken,
//             resetPasswordExpires: { $gt: Date.now() },
//         });

//         if(!user){
//             return res.status(400).json({ message: "Token is invalid or has expired" });
//         }

//         user.password = password;
//         user.refreshTokens = []; // Invalidate all refresh tokens
        
//         user.resetPasswordToken = undefined;
//         user.resetPasswordExpires = undefined;
//         await user.save();

//         return res.status(200).json({ message: "Password successfully updated!" });

//     }catch(error){
//         return res.status(500).json({
//             status: "error",
//             message: "Server error"
//         });
//     }
// };

// exports.logout = async(req, res) => {
//     try{
//         const {refreshToken} = req.body;
//         if (!refreshToken) return res.status(403).json({message: 'Refresh token required'});

//         const decoded = await promisify(jwt.verify)(refreshToken, process.env.REFRESH_SECRET);  
//         if (!decoded) {
//             return res.status(403).json({ message: 'Invalid refresh token' });
//         } 
        
//         const user = await User.findById(decoded.id);
//         if (!user) return res.status(404).json({ message: 'User not found' });
//         user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);        //just let users logout even if logged out before
//         await user.save();

//         return res.status(200).json({
//             status: 'success',
//             message: 'Logged out from current device',
//         });

//     }catch(error){
//         return res.status(500).json({
//             status: "error",
//             message: "Server error"
//         });
//     }
// }

// exports.logoutAll = async(req, res) => {
//     try{
//         const {refreshToken} = req.body;
//         if (!refreshToken) return res.status(403).json({message: 'Refresh token required'});

//         const decoded = await promisify(jwt.verify)(refreshToken, process.env.REFRESH_SECRET);  

//         if (!decoded) {
//             return res.status(403).json({ message: 'Invalid refresh token' });
//         } 

//         const user = await User.findById(decoded.id);
//         if (!user) return res.status(404).json({ message: 'User not found' });
//         user.refreshTokens = []
//         await user.save();

//         return res.status(200).json({
//             status: 'success',
//             message: 'Logged out from all devices',
//         });

//     }catch(error){
//         return res.status(500).json({
//             status: "error",
//             message: "Server error"
//         });
//     }
// }

// exports.nearProducts = async(req, res) => {
//     try{
//         const { lat, lng, maxDistance = 10000, word } = req.query;

//         if (!lat || !lng) {
//             return res.status(400).json({ message: "Latitude and longitude are required" });
//         }

//         const latNum = parseFloat(lat);
//         const lngNum = parseFloat(lng);

//         const products = await Product.aggregate([
//             {
//                 $geoNear: {
//                     near: {
//                         type: 'Point',
//                         coordinates: [lngNum, latNum]
//                     },
//                     distanceField: 'distance',
//                     spherical: true,
//                     // maxDistance: parseInt(maxDistance),
//                     key: 'productLocation' 
//                 }
//             },

//             {$match: {
//                 $or: [
//                     { title: { $regex: word, $options: 'i' } },
//                     { description: { $regex: word, $options: 'i' } }
//                 ]
//             }},

//             { $sort: { distance: 1,} },

//             {
//                 $project: {
//                     "images.embedding": 0
//                 }
//             }
//         ]);

//         return res.status(200).json({
//             status: 'success',
//             message: 'Successfully returned products based on proximity',
//             products
//         });
//     }catch(error){
//         return res.status(500).json({
//             status: "error",
//             message: "Server error"
//         });
//     }
// }