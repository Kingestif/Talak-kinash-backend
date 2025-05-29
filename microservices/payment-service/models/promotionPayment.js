const mongoose = require('mongoose');

const promotionPaymentSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: [true, "payment must have a seller"]
    },

    productId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Product",
        required: [true, "payment must have associated product"]
    },

    tx_ref: {
        type: String,
        required: true,
        unique: true,
        default: null
    },

    promotionPlan: {
        type: String,
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

const PromotePayment = mongoose.model('PromotePayment', promotionPaymentSchema);

module.exports = PromotePayment;