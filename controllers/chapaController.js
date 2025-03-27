require("dotenv").config();
const Chapa = require("chapa");
const crypto = require('crypto');
const User = require('../models/users');
const SellerPayment = require('../models/sellerPayment');
const SubscriptionPlan = require('../models/subscriptionSchema');

const chapa = new Chapa(process.env.CHAPA_SECRET_KEY);  

exports.initializePayment = async (req, res) => {
    try {
      const seller = req.user;
      const previousPayment = await SellerPayment.findOne({sellerId: seller._id});

      if (previousPayment.status === "success"){
        return res.status(400).json({message: "You already have an active subscription. Please wait until it expires before starting a new one."});
      }

      const { currency, first_name, last_name, subscriptionType } = req.body;
  
      if (!currency || !first_name || !last_name || !subscriptionType) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const subscription = await SubscriptionPlan.findOne({type: subscriptionType});
      amount = subscription.price;

      console.log("updated Amount", amount);

      const customerInfo = {
        amount,
        currency,
        email: seller.email,
        first_name,
        last_name,
        callback_url: "https://talakkinash/verified.com/", 
        customization: {
          title: "Deal & Promotion Payment",
          description: "Secure Payment via Chapa",
        },
      };

      const response = await chapa.initialize(customerInfo, { autoRef: true });
  
      if (response.status === "success") {
        const newPayment = await SellerPayment.create({
          sellerId: seller._id,
          tx_ref: response.tx_ref,
          subscriptionPlan: subscriptionType,
          amount: amount,
          currency: currency,
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
      const sellerPayment = await SellerPayment.findOneAndUpdate(
        {tx_ref: userTx_ref},
        {$set: {status: "success"}},
        {new: true}
      );

      if (!sellerPayment) {
        console.log("Payment not found for tx_ref:", userTx_ref);
        return res.status(404).json({ message: "Payment not found" });
      }
  
      return res.status(200).json({ message: "Payment verified successfully"});
  
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

exports.sellerPaymentVerified = async(req, res, next) => {
  try{
    const sellerId = req.user._id;
    const order = await SellerPayment.findOne({sellerId: sellerId}).sort({createdAt: -1});

    if(!order || order.status !== "success"){
      return res.status(404).json({
        status: "error",
        message: "Please Subscribe to do this operation"
      });
    }
    next();

  }catch(error){
    return res.status(400).json({
      status: "error",
      message: "Can not verify subscription"
    })
  }
}