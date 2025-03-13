const User = require('../models/users');

exports.viewAdminProfile = (req, res) => {
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

exports.viewUserProfile = (req, res) => {
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

exports.viewAllUsers = (req, res) => {
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

exports.viewAllSellers = (req, res) => {
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


exports.viewPendingProducts = (req, res) => {
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

exports.viewAllProducts = (req, res) => {
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

exports.updateProductStatus = (req, res) => {
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
