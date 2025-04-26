const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
    code: {type: String, required: true, unique: true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expirationDate: { 
        type: Date, 
        required: true,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    },
});

const PromoCode = mongoose.model('PromoCode', promoSchema);
module.exports = PromoCode;