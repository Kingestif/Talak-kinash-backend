const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product must have a name'],
    },
    description: {
        type: String,
        required: [true, 'Product must have a description'],
    },
    price: {
        type: String,
        required: [true, 'Product must have a price'],
    },
    category: {
        type: String,
        required: [true, 'Product must have a category'],
    },
    images: [String], 

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: [true, 'Product must have a seller'],
    },

},
    { timestamps: true }
);

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
