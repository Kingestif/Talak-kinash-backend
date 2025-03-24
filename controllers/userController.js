const User = require('../models/users');
const Product = require('../models/product'); 


exports.getUserProfile = async(req, res) => {
    
    try{
        const user = {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            phoneNumber: req.user.phoneNumber,
            gender: req.user.gender,
            birthday: req.user.birthday.toISOString().split('T')[0],
            referralCode: req.user.referralCode,
            role: req.user.role
        }

        return res.status(200).json({
            status: "success",
            message: "User information fetched successfully",
            data: {
                user: user,
            }
        });

    }catch(error){
        return res.status(400).json({
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
        return res.status(400).json({
            status: "error",
            message: "Failed to update user info",
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
        return res.status(400).json({
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
        return res.status().json({
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
        return res.status(400).json({
            status: "error",
            message: "Error removing product from wishlist"
        });
    }
}