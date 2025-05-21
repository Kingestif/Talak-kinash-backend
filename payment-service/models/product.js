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
        type: Number,
        required: [true, 'Product must have a price'],
    },
    category: {
        type: String,
        required: [true, 'Product must have a category'],
    },
    tag: {
        type: [String],
        required: [true, 'Product must have a tag'],
    },
    
    images: [{
        url: String,
        tags: [String],
        public_id: String,     
        embedding: {
            type: [Number],
        }
    }],
    
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: [true, 'Product must have a seller'],
    },

    isFeatured: {
        type: Boolean,
        default: false
    },

    featuredUntil: {
        type: Date,
        default: null
    },

    productLink: {
        type: String,
        required: [true, 'Product must have a redirection link']
    },

    productLocation: { 
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        }, 
        coordinates: {
            type: [Number],  
        }       
    },

},
    { timestamps: true }
);

ProductSchema.index({ productLocation: '2dsphere' });

ProductSchema.index({ category: 1 });
ProductSchema.index({ tag: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ name: 'text', description: 'text', tag: 'text', category: 'text' }, { weights: {name: 10, description: 5, tag: 2, category: 2}});

const Product = mongoose.model('Product', ProductSchema); 

module.exports = Product;
