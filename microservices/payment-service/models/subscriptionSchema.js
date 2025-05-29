const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    type: {type: String, required: true, unique: true},
    price: {type: Number, required: true},
    duration: {type: Number, required: true}
});

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionSchema);
module.exports = SubscriptionPlan; 