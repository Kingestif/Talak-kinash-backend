const User = require('../models/users');
const Product = require('../models/product'); 
const sendEmail = require('../utils/sendEmail');

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