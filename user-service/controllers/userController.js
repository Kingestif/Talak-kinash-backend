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
