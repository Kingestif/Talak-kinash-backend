const SellerPayment = require('../models/sellerPayment');

exports.sellerPaymentVerified = async(req, res, next) => {
  try{
    const sellerId = req.user._id;
    const payment = await SellerPayment.findOne({sellerId: sellerId}).sort({createdAt: -1});  //get recent transaction user made

    if(!payment || payment.status !== "success"){
      return res.status(404).json({
        status: "error",
        message: "Please Subscribe to do this operation"
      });
    }
    next();

  }catch(error){
    return res.status(500).json({
      status: "error",
      message: "Can not verify subscription"
    })
  }
}