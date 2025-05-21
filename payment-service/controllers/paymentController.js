const Chapa = require("chapa");
const crypto = require('crypto');
const SellerPayment = require('../models/sellerPayment');
const SubscriptionPlan = require('../models/subscriptionSchema');
const PromotePayment = require('../models/promotionPayment');
const Product = require('../models/product');
const Promotion = require('../models/promotion');
const sendEmail = require('../utils/sendEmail');

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

exports.paymentVerification = async (req, res) => {   //Always respond with 200 OK after receiving this webhook to acknowledge that we have processed the event, even if it’s a failure. This prevents Chapa from continuously retrying.
  try{
    console.log('Webhook received');
  
    const rawBody = req.body.toString('utf8');
    const signature = req.headers['x-chapa-signature'];
    const secretKey = process.env.CHAPA_WEBHOOK_SECRET;
  
    const hash = crypto.createHmac('sha256', secretKey).update(rawBody).digest('hex');
    const data = JSON.parse(rawBody); // Parse manually 

    console.log("DATA", data);


    if(signature !== hash){
      console.log('Signature verification failed');
      return res.status(200).json({ message: 'Invalid signature' });
    }
  
    const event = data.event;
    const userTx_ref = data.tx_ref;

    if(event === "charge.success"){
      console.log("Payment success event received");

      if(userTx_ref.startsWith("subscription_")){
        console.log("SUBSCRIPTION PAID");
        let paidPrice = parseInt(data.amount);
        const plan = await SubscriptionPlan.findOne({price:paidPrice});
        const subscriptionType = plan.type;

        const sellerPayment = await SellerPayment.findOneAndUpdate(
          {tx_ref: userTx_ref},
          {$set: {status: "success"}},
          {new: true}
        );

        const message = `
          <p>Congratulations! you have successfully subscribed to the <strong>${subscriptionType}</strong> plan.</p>
          <p><strong>Amount Paid:</strong> ${data.amount} birr</p>
          <br>
          <p>Your subscription is now active. Enjoy all the benefits of your new plan!</p>
        `;
        await sendEmail({
          email: data.email,
          subject: `Subscription Confirmation - ${subscriptionType} Plan`,
          message: message
        });
  
        if (!sellerPayment) {
          return res.status(200).json({ message: "Payment not found" });
        }
    
        return res.status(200).json({ message: "Subscription Payment verified successfully"});

      }else if(userTx_ref.startsWith("promotion_")){
        console.log("PROMOTION PAID");
        let paidPrice = parseInt(data.amount);
        const plan = await Promotion.findOne({price:paidPrice});
        const promotionType = plan.type;

        console.log("PROMOTION Type", promotionType);

        const promotionPayment = await PromotePayment.findOneAndUpdate(
          {tx_ref: userTx_ref},
          {$set: {status: "success"}},
          {new: true, runValidators: true}
        );

        const message = `
          <p>Congratulations! you have successfully Promoted your product.</p>
          <p>Your Promotion is now active for <strong>${promotionType}</strong>. you can track your product status right from the app!! Enjoy your new plan!</p>
        `;

        await sendEmail({
          email: data.email,
          subject: `Promotion Confirmation`,
          message: message
        });

        if (!promotionPayment) {
          return res.status(200).json({ message: "Payment not found" });
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
        return res.status(200).json({ message: "Unknown transaction reference type" });
      }

      // ---------------------Other responses 
    }else if(event === "charge.failed/cancelled"){
      console.log("Payment failed event received");

      const message = `
        <p>We're sorry, but your attempt to subscribe to one of our plans was unsuccessful.</p>
        <p>Please try again, or contact our support team if the issue persists.</p>
        <p>We apologize for the inconvenience and appreciate your interest in our services.</p>
      `;

      await sendEmail({
        email: data.email,
        subject: `Subscription Failed`,
        message: message
      });

      return res.status(200).json({ message: "Payment failed"});
  
    }else if(event === "charge.refunded"){
      console.log("Payment refunded event received");
      return res.status(200).json({ message: "Payment refunded"});
      
    }else if(event === "charge.reversed"){
      console.log("Payment reversed event received");
      return res.status(200).json({ message: "Payment reversed"});
    }else {
      console.log("Unknown event received:", event);
      return res.status(200).json({ message: "Unknown event" });
    }

  }catch(error){
    console.error("Error updating payment status:", error);
    return res.status(200).json({ message: "Internal server error" });
  }
}


exports.initializeFeaturePayment = async (req, res) => {
    try {
      const seller = req.user;
      const productId = req.params.id;

      const product = await Product.findById(productId);
      if(!product){
        return res.status(404).json({
            status: 'error',
            message: 'Product not found'
        });
      }
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


exports.isSellerSubscribed = async(req, res) => {
  try{
    const sellerId = req.user._id;

    const payment = await SellerPayment.findOne({
      sellerId: sellerId,
      status: "success",
      expiresAt: { $gt: new Date() }
    }).sort({createdAt: -1}); 

    if(payment){
      return res.status(200).json({isSubscribed: true});
    }

    return res.status(200).json({isSubscribed: false});

  }catch(error){
    return res.status(500).json({
      status: "error ",
      message: error.message
    });
  }
}

exports.fetchSubPlans = async(req, res) => {
  try{
    const plans = await SubscriptionPlan.find();
    return res.status(200).json({plans});
      
  }catch(error){
    return res.status(500).json({
      status: "error ",
      message: error.message
    });
  }
}

exports.fetchPromoPlans = async(req, res) => {
  try{
    const plans = await Promotion.find();
    return res.status(200).json({plans});
      
  }catch(error){
    return res.status(500).json({
      status: "error ",
      message: error.message
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