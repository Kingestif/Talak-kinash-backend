const User = require('../models/users');
const SubscriptionPlan = require('../models/subscriptionSchema');
const jwt = require('jsonwebtoken');
const Product = require('../models/product');
const Promotion = require('../models/promotion');
const sendEmail = require('../utils/sendEmail');


exports.viewAdminProfile = async(req, res) => {
    try{
        const userId = req.user.id;
        const user = await User.findById(userId);

        return res.status(200).json({
            status: "success",
            message: "Admin profile fetched successfully",
            data: user
        });

    }catch(error){
        return res.status(500).json({
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
        return res.status(500).json({
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
        return res.status(500).json({
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
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch all sellers"
        });
    }
}

exports.viewAllProducts = async(req, res) => {
    try{
        const products = await Product.find();

        return res.status(200).json({
            status: "success",
            message: "Successfully fetched all products",
            data: products
        });

    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch all products"
        });
    }
}

exports.pendingSellers = async(req, res) => {
    try{
        const pendingSellers = await User.find({role: 'seller', status: 'pending'});
        return res.status(200).json({
            status: "success",
            message: "Pending sellers fetched successfully",
            length: pendingSellers.length,
            pendingSellers
        });
    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch pending sellers"
        });
        
    }
}

exports.approveSeller = async(req, res) => {
    try{
        const sellerId = req.params.id;
        const status = req.body.status;
        const declineReason = req.body.reason;
        const user = await User.findById(sellerId);

        if(!user){
            return res.status(404).json({ message: "Seller not found!" });
        }

        if(!status){
            return res.status(404).json({ message: "Status is required!" });
        }

        let updateFields = {};
        if(status === "approve"){
            updateFields = { sellerVerified: true, status: "approved" };
            await sendEmail({
                email: user.email,
                subject: 'Your Seller Application Was Approved',
                message: `
                    <p>Hello ${user.name},</p>
                    <p>We're happy to inform you that your application has been approved!</p>
                    <p>You can now start listing products and manage your store.</p>
                    <p>If you have any questions or need assistance, feel free to reach out to us.</p>
                    <p>Welcome aboard!</p>
                `,
            });

        }else if(status === "decline"){
            if(!declineReason){
                return res.status(400).json({ message: "Decline reason is required" });
            }

            updateFields = { sellerVerified: false, status: "declined"};
            await sendEmail({
                email: user.email,
                subject: 'Your Seller Application Was Declined',
                message: `<p>Hello ${user.name},</p><p>We're sorry to inform you that your application was declined for the following reason:</p><blockquote>${declineReason}</blockquote>`,
            });
        }else{
            return res.status(400).json({ message: "Unexpected Status inserted!!" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            sellerId,
            updateFields,  
            { new: true }  
        );


        if (!updatedUser) {
            return res.status(404).json({ message: "Seller not found" });
        }

        return res.status(200).json({
            status: "success",
            message: "Successfully updated sellers status",
            user: updatedUser,
        });

    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "Failed to update sellers status"
        });
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
        return res.status(200).json({
            status: "success",
            message: "Subscription plan updated successfuly",
            data: plan
        });
    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "failed to update subscription plan"
        });
    }
}

exports.addPromotionPlan = async(req, res) => {
    try{
        let {type, price, duration} = req.body;
        duration = duration * 24 * 60 * 60 * 1000
        const newPlan = await Promotion.create({type, price, duration});

        return res.status(200).json({
            status: "success",
            message: "Successfully added promotion plan"
        });
    }catch(error){
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

exports.getPromotionPlans = async(req, res) => {
    try{
        const plans = await Promotion.find();
        return res.status(200).json({
            status: "success",
            message: "Successfully fetched promotion plans",
            plan: plans
        });

    }catch(error){
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

exports.updatePromotionPrice = async(req, res) => {
    try{
        const promotionId = req.params.id; 
        const updatedData = req.body;

        if (updatedData.duration) {
            updatedData.duration = updatedData.duration * 24 * 60 * 60 * 1000
        }
        const promotion = await Promotion.findByIdAndUpdate(promotionId,
            updatedData,
            {new: true, runValidators: true}
        );

        return res.status(200).json({
            status: "success",
            message: "Promotion plan updated successfuly",
            data: promotion
        });
 
    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "failed to update promotion plan"
        });
    }
}

exports.deletePromotionPlan = async(req, res) => {
    try{
        const productId = req.params.id;
        await Promotion.findByIdAndDelete(productId);
        
        return res.status(204).json({
            status: "success",
            message: "Promotion plan deleted successfuly",
        });
 
    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "failed to delete promotion plan"
        });
    }
}