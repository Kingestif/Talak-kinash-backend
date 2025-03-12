const user = require('../models/users');

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

