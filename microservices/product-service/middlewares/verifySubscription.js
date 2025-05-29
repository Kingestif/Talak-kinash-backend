const SellerPayment = require('../models/sellerPayment');

exports.sellerPaymentVerified = async(req, res, next) => {
  try{
    const sellerId = req.user._id;
    const payment = await SellerPayment.findOne({    //check recent transaction user made is success and not expired
      sellerId: sellerId,
      status: "success",
      expiresAt: { $gt: new Date() }
    }).sort({createdAt: -1}); 

    if(!payment){
      return res.status(404).json({
        status: "error",
        message: "Your subscription has expired or not found"
      });
    }
    next();

  }catch(error){
    return res.status(500).json({
      status: "error",
      message: "Can not verify subscription"
    });
  }
}