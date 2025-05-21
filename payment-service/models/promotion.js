const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    type: {type: String, required: true, unique: true},
    price: {type: Number, required: true},
    duration: {type: Number, required: true}
});


const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;
