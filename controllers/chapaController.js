require("dotenv").config();
const Chapa = require("chapa");
const crypto = require('crypto');
const User = require('../models/users');
const SellerPayment = require('../models/sellerPayment');
const SubscriptionPlan = require('../models/subscriptionSchema');
const PromotePayment = require('../models/promotionPayment');
const Product = require('../models/product');
const Promotion = require('../models/promotion');

const chapa = new Chapa(process.env.CHAPA_SECRET_KEY);  

exports.initializePayment = async (req, res) => {
    try {
      const seller = req.user;

      const previousPayment = await SellerPayment.findOne({    //check recent transaction user made is not success or have expired
        sellerId: seller._id,
        status: "success",
        expiresAt: { $gt: new Date() }
      }).sort({createdAt: -1}); 

      if (previousPayment){
        return res.status(400).json({message: "You already have an active subscription. Please wait until it expires before starting a new one."});
      }

      const { currency, first_name, last_name, subscriptionType } = req.body;
  
      if (!currency || !first_name || !last_name || !subscriptionType) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const subscription = await SubscriptionPlan.findOne({type: subscriptionType});
      const duration = subscription.duration;
      const amount = subscription.price;
      const tx_ref = `subscription_${Date.now()}_${seller._id}`;

      const customerInfo = {
        amount,
        currency,
        email: seller.email,
        first_name,
        last_name,
        callback_url: process.env.CALLBACKURL_FOR_SUBSCRIPTION,
        customization: {
          title: "Subscription Payment",
          description: "Secure Payment via Chapa",
        },
        tx_ref
      };

      const response = await chapa.initialize(customerInfo);
  
      if (response.status === "success") {
        const newPayment = await SellerPayment.create({
          sellerId: seller._id,
          tx_ref: response.tx_ref,
          subscriptionPlan: subscriptionType,
          amount: amount,
          currency: currency,
          expiresAt: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
          status: "pending"
        });


        return res.status(200).json({
          message: "success",
          checkout_url: response.data.checkout_url,
          tx_ref: response.tx_ref,
        });

      } else {
        res.status(404).json({ message: "Payment initialization failed. Please try again." }); 
      }

    } catch (error) {
      console.error("Payment initialization error:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.paymentVerification = async (req, res) => {
  try{
    console.log('Webhook received:', req.body);
  
    const signature = req.headers['x-chapa-signature'];
    const secretKey = process.env.CHAPA_WEBHOOK_SECRET;
  
    const hash = crypto.createHmac('sha256', secretKey).update(JSON.stringify(req.body)).digest('hex');
    if(signature !== hash){
      console.log('Signature verification failed');
      return res.status(400).json({ message: 'Invalid signature' });
    }
  
    const event = req.body.event;
    const userTx_ref = req.body.tx_ref;

    if(event === "charge.success"){
      console.log("Payment success event received");

      if(userTx_ref.startsWith("subscription_")){
        console.log("SUBSCRIPTION PAID");
        const sellerPayment = await SellerPayment.findOneAndUpdate(
          {tx_ref: userTx_ref},
          {$set: {status: "success"}},
          {new: true}
        );
  
        if (!sellerPayment) {
          return res.status(404).json({ message: "Payment not found" });
        }
    
        return res.status(200).json({ message: "Subscription Payment verified successfully"});

      }else if(userTx_ref.startsWith("promotion_")){
        console.log("PROMOTION PAID");
        const promotionPayment = await PromotePayment.findOneAndUpdate(
          {tx_ref: userTx_ref},
          {$set: {status: "success"}},
          {new: true, runValidators: true}
        );

        if (!promotionPayment) {
          return res.status(404).json({ message: "Payment not found" });
        }

        const now = new Date();
        const productId = promotionPayment.productId;
        const promotion = await Promotion.findOne({type: promotionPayment.promotionPlan});

        const product = await Product.findByIdAndUpdate(productId,
          {isFeatured: true, featuredUntil: new Date(now.getTime() + promotion.duration)},
          {new: true, runValidators: true}
        );

        return res.status(200).json({ message: "Promotion Payment verified successfully"});

      }else {
        console.log("Unknown transaction type");
      }

      // ---------------------Other responses 
    }else if(event === "charge.failed"){
      console.log("Payment failed event received");
      return res.status(200).json({ message: "Payment failed"});
  
    }else if(event === "charge.cancelled"){
      console.log("Payment cancelled event received");
      return res.status(200).json({ message: "Payment cancelled"});
  
    }else if(event === "charge.refunded"){
      console.log("Payment refunded event received");
      return res.status(200).json({ message: "Payment refunded"});
      
    }else if(event === "charge.reversed"){
      console.log("Payment reversed event received");
      return res.status(200).json({ message: "Payment reversed"});
    }else {
      console.log("Unknown event received:", event);
      return res.status(400).json({ message: "Unknown event" });
    }

  }catch(error){
    console.error("Error updating payment status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

