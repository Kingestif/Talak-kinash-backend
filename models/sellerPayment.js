const mongoose = require('mongoose');

const SellerPaymentSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: [true, "payment must have a seller"]
    },

    tx_ref: {
        type: String,
        required: true,
        unique: true,
        default: null
    },

    subscriptionPlan: {
        type: String,
        enum: ["monthly", "quarterly", "yearly"],
    },

    amount: {
        type: String,
        required: true
    },

    currency: {
        type: String,
        default: "ETB"
    },

    paymentMethod: {
        type: String,
    },

    status: {
        type: String,
        enum: ["pending", "success", "failed", "cancelled", "refunded"],
        default: "pending"
    },
},
    { timestamps: true }
);

const SellerPayment = mongoose.model('SellerPayment', SellerPaymentSchema);

module.exports = SellerPayment;