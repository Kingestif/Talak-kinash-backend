const User = require('../models/users');
const SubscriptionPlan = require('../models/subscriptionSchema');
const jwt = require('jsonwebtoken');
const Product = require('../models/product');
const Promotion = require('../models/promotion');


exports.viewAdminProfile = async(req, res) => {
    
    try{
        const token = req.headers.authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const userid = verified.id;
        const user = await User.findById(userid);

        return res.status(200).json({
            status: "success",
            message: "Admin profile fetched successfully",
            data: user
        });

    }catch(error){
        return res.status(400).json({
            status: "error",
            message: "Failed to fetch user profile"
        }); 
    }
}

exports.viewUserProfile = async(req, res) => {
    try{
        const user = await User.findById(req.params.id);

        return res.status(200).json({
            status: "success",
            message: "Users profile fetched successfully",
            data: user
        });
    }catch(error){
        return res.status(400).json({
            status: "error",
            message: "Failed to fetch the user"
        });
        
    }
}

exports.viewAllUsers = async(req, res) => {
    try{
        const users = await User.find();

        return res.status(200).json({
            status: "success",
            message: "Successfully fetched all users",
            data: users
        });

    }catch(error){
        return res.status(400).json({
            status: "error",
            message: "Failed to fetch all users"
        });
    }
}

exports.viewAllSellers = async(req, res) => {
    try{
        const seller = await User.find({role: "seller"});
        return res.status(200).json({
            status: "success",
            message: "Successfully fetched all sellers",
            data: seller
        });

    }catch(error){
        return res.status(400).json({
            status: "error",
            message: "Failed to fetch all sellers"
        });
    }
}

exports.viewAllProducts = async(req, res) => {
    try{
        const products = await Product.find();

        res.status(200).json({
            status: "success",
            message: "Successfully fetched all products",
            data: products
        });

    }catch(error){
        res.status(400).json({
            status: "error",
            message: "Failed to fetched all products"
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

exports.updateSubscriptionPrice = async(req, res) => {
    try{
        const data = req.body;
        const plan = await SubscriptionPlan.findOneAndUpdate(
            {type: data.type}, 
            {$set: {price: data.price}},
            {new: true}
        );
        res.status(200).json({
            status: "success",
            message: "Subscription plan updated successfuly",
            data: plan
        });
    }catch(error){
        res.status(400).json({
            status: "error",
            message: "failed to update subscription plan"
        });
    }
}

exports.updatePromotionPrice = async(req, res) => {
    try{
        const data = req.body;
        const promotion = await Promotion.findOneAndUpdate(
            {type: data.type}, 
            {$set: {price: data.price}},
            {new: true}
        );
        res.status(200).json({
            status: "success",
            message: "Promotion plan updated successfuly",
            data: promotion
        });
 
    }catch(error){
        res.status(400).json({
            status: "error",
            message: "failed to update promotion plan"
        });
    }
}