const User = require('../models/users');

exports.viewAdminProfile = async(req, res) => {
    try{
        res.status(200).json({
            status: "success",
            message: "Admin profile fetched successfully"
        });
    }catch(error){
        res.status(400).json({
            status: "error",
            message: error.message
        }); 
    }
}

exports.viewUserProfile = async(req, res) => {
    try{
        res.status(200).json({
            status: "success",
            message: "Users profile fetched successfully"
        });
    }catch(error){
        res.status(400).json({
            status: "error",
            message: error.message
        });
        
    }
}

exports.viewAllUsers = async(req, res) => {
    try{
        res.status(200).json({
            status: "success",
            message: "Successfully fetched all users"
        });

    }catch(error){
        res.status(400).json({
            status: "error",
            message: "Failed to fetch all users"
        });
    }
}

exports.viewAllSellers = async(req, res) => {
    try{
        res.status(200).json({
            status: "success",
            message: "Successfully fetched all sellers"
        });

    }catch(error){
        res.status(400).json({
            status: "error",
            message: "Failed to fetch all sellers"
        });
    }
}


exports.viewPendingProducts = async(req, res) => {
    try{
        res.status(200).json({
            status: "success",
            message: "Successfully fetched all pending products"
        });

    }catch(error){
        res.status(400).json({
            status: "error",
            message: "Failed to fetched pending products"
        });
    }
}

exports.viewAllProducts = async(req, res) => {
    try{
        res.status(200).json({
            status: "success",
            message: "Successfully fetched all products"
        });

    }catch(error){
        res.status(400).json({
            status: "error",
            message: "Failed to fetched all products"
        });
    }
}

exports.updateProductStatus = async(req, res) => {
    try{
        res.status(200).json({
            status: "success",
            message: "Successfully updated the product"
        });

    }catch(error){
        res.status(400).json({
            status: "error",
            message: "Failed to update the product"
        });
    }
}

exports.pendingSellers = async(req, res) => {
    try{
        const pendingSeller = await User.find({role: 'seller', sellerVerified: false});
        res.status(200).json({
            status: "success",
            message: "Pending sellers fetched successfully",
            data: {
                user: pendingSeller
            } 
        });
    }catch(error){
        return res.status(400).json({
            status: "error",
            message: "Failed to fetch pending sellers"
        });
        
    }
}

exports.approveSeller = async(req, res) => {
    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { sellerVerified: true },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Seller not found" });
        }

        return res.status(200).json({
            status: "success",
            message: "Successfully approved the seller",
            user: updatedUser,
        });

    }catch(error){
        res.status(400).json({
            status: "error",
            message: "Failed to approve the seller"
        })
    }
}