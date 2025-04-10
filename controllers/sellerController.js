require("dotenv").config();
const User = require('../models/users');
const Product = require('../models/product');  
const Chapa = require("chapa");
const crypto = require('crypto');
const Promotion = require('../models/promotion');
const PromotePayment = require('../models/promotionPayment');
const chapa = new Chapa(process.env.CHAPA_SECRET_KEY);
const cloudinary = require('cloudinary').v2; 
const axios = require('axios'); 

exports.postProduct = async(req, res) => {
    try{
        const {name, description, price, category} = req.body;

        // ---product image
        let images = [];
        let tag = [];

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "At least one image is required"
            });
        }
        
        if (req.files) {
            for (let file of req.files) {
                const imageUrl = file.path;  // Cloudinary URL
                const filename = file.filename; 

                const cloudinaryResult = await cloudinary.api.resource(filename, {
                    image_metadata: true,
                    colors: true,
                    tags: true
                });

                const fileTags = cloudinaryResult.tags || [];

                
                tag = [...new Set([...tag, ...fileTags])];  
                
                // Sent the image URL to FastAPI to get the embedding
                const response = await axios.post(`${process.env.CLIPAI_BASE_URL}/get-embedding`, {
                    image_url: imageUrl
                });

                let embedding = [];
                if (response.data.embedding) {
                    embedding = response.data.embedding;  
                }

                images.push({
                    url: imageUrl,
                    tags: fileTags,
                    public_id: cloudinaryResult.public_id,  
                    embedding: embedding,
                });
            }
        }
        
        const seller = req.user._id;

        const newProduct = await Product.create({name, description, price, category, tag, images, seller});
        // newProduct.images.forEach(image => {
        //     image.embedding = undefined;  
        // });

        await User.findByIdAndUpdate(newProduct.seller, {
            $push: {productsPosted: newProduct._id}
        })

        return res.status(201).json({
            status: "success",
            message: "Product uploaded successfully",
            product: newProduct
        });

    }catch(error){
        console.log(error.message);
        return res.status(500).json({
            status: "error",
            message: "Failed to upload product"
        });
    }
}

exports.updateProduct = async(req, res) => {
    try{
        const updateData = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });
        return res.status(200).json({
            status: "success",
            message: "Product updated successfully",
            data: product
        });
    }catch(error){
        console.log(error.message);
        return res.status(400).json({
            status: "error",
            message: "Failed to update product"
        });
    }
}

exports.deleteProduct = async(req, res) => {
    
    try{
        await Product.findByIdAndDelete(req.params.id);
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { productsPosted: req.params.id }
        });

        return res.status(204).json({
            status: "success",
            message: "Product deleted successfully"
        });
    }catch(error){
        return res.status(400).json({
            status: "error",
            message: "Failed to delete product"
        });
    }
}

exports.getAllProducts = async(req, res) => {
    try{
        const seller = await User.findById(req.user._id).populate('productsPosted');
        const sellerProducts = seller.productsPosted;

        return res.status(200).json({
            status: "success",
            message: "Successfuly fetched all sellers product",
            data: sellerProducts || []
        });
        
    }catch(error){
        res.status(400).json({
            status: "error",
            message: "Failed to fetch sellers products"
        });
    }
}

exports.initializeFeaturePayment = async (req, res) => {
    try {
      const seller = req.user;
      const productId = req.params.id;

      const product = await Product.findById(productId);
      const previousPayment = product.isFeatured;
      
      if (previousPayment){
        return res.status(400).json({message: "You already have featured this product. Please wait until it expires before starting a new one."});
      }

      const { currency, first_name, last_name, promotionType } = req.body;
  
      if (!currency || !first_name || !last_name || !promotionType) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const promotion = await Promotion.findOne({type: promotionType});
      const amount = promotion.price;

      console.log("updated Amount", amount);
      const tx_ref = `promotion_${Date.now()}_${seller._id}`;

      const customerInfo = {
        amount,
        currency,
        email: seller.email,
        first_name,
        last_name,
        callback_url: process.env.CALLBACKURL_FOR_PROMOTION,
        customization: {
          title: "Promotion Payment",
          description: "Secure Payment via Chapa",
        },
        tx_ref 
      };

      const response = await chapa.initialize(customerInfo);
  
      if (response.status === "success") {
        const newPayment = await PromotePayment.create({
          sellerId: seller._id,
          productId: productId,
          tx_ref: response.tx_ref,
          promotionPlan: promotionType,
          amount: amount,
          currency: currency,
          status: "pending"
        });


        return res.status(200).json({
          message: "success",
          checkout_url: response.data.checkout_url,
          tx_ref: response.tx_ref
        });

      } else {
        res.status(404).json({ message: "Payment initialization failed. Please try again." }); 
      }

    } catch (error) {
      console.error("Payment initialization error:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};