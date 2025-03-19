const user = require('../models/users');
const Product = require('../models/product'); 


exports.getUserProfile = async(req, res) => {
    try{
        res.status(200).json({
            status: "success",
            message: "User information fetched successfully"
        });

    }catch(error){
        res.status(400).json({
            status: "error",
            message: "Failed to fetch user info"
        });

    }
}


exports.updateUserProfile = async(req, res) => {
    try{
        res.status(200).json({
            status: "success",
            message: "User Information Updated Successfully",
        });
    }catch(error){
        res.status(400).json({
            status: "error",
            message: "Failed to update user info"
        });
    }
}

exports.searchProduct = async(req, res) => {
    try{
        res.status(200).json({
            status: "success",
            message: "Product found"
        });

    }catch(error){
        res.status(400).json({
            status: "error",
            message: "Failed to find product"
        });
    }
}

exports.scanBarcode = async(req, res) => {
    try{
        res.status(200).json({
            status: "success",
            message: "Found Similar Products",
        });
    }catch(error){
        res.status(400).json({
            status: "error",
            message: "No similar product found"
        });
    }
}

exports.getNotification = async(req, res) =>{
    try{
        res.status(200).json({
            status: "success",
            message: "Notifications fetched successfully",
        });
    }catch(error){
        res.status(400).json({
            status: "error",
            message: "Error fetching notifications"
        });
    }
}

exports.addToWishlist = async(req, res) => {
    try{
        res.status(200).json({
            status: "success",
            message: "Product added to wishlist"
        });
    }catch(error){
        res.status(400).json({
            status: "error",
            message: "Error adding product to wishlist"
        });
    }
}

exports.getFromWishlist = (req, res) => {
    try{
        res.status(200).json({
            status: "success",
            message: "Successfully fetched from wishlist"
        });

    }catch(error){
        res.status().json({
            status: "error",
            message: "Failed to fetch from wishlist"
        });
    }
}

exports.removeFromWishlist = (req, res) => {
    try{
        res.status(204).json({
            status: "success",
            message: "Product removed from wishlist"
        });
    }catch(error){
        res.status(400).json({
            status: "error",
            message: "Error removing product from wishlist"
        });
    }
}



const calculateRecommendations = async (userId) => {
    // const user = await User.findById(userId).populate('wishlist').populate('cart');  ill put it on wishlist and cart endpoint

    // Get all products from the categories and tags the user is interested in
    const interestedProducts = await Product.find({
        category: { $in: user.preferences.categories },
        tag: { $in: user.preferences.tags }
    }).limit(10); 

    // Update the user's recommendations for future use
    user.recommendations = interestedProducts.map(product => product._id);
    await user.save();

    return interestedProducts;
};


const addToWishlist = async (userId, productId) => {
    const user = await User.findById(userId);

    // Add product to wishlist
    user.wishlist.push(productId);

    // Optionally, update preferences based on the product (you could use tags/categories here)
    const product = await Product.findById(productId);
    if (!user.preferences.categories.includes(product.category)) {
        user.preferences.categories.push(product.category);
    }
    product.tag.forEach(tag => {
        if (!user.preferences.tags.includes(tag)) {
            user.preferences.tags.push(tag);
        }
    });

    // Recalculate recommendations
    await calculateRecommendations(userId);

    await user.save();
};

//server the recommendations 
const getRecommendations = async (userId) => {
    const user = await User.findById(userId).populate('recommendations');
    return user.recommendations;
};


exports.verifyEmail = async (req, res) => {
    

}