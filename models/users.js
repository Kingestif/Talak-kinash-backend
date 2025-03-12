const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User must have a name']
    },

    email: {
        type: String,
        unique: true,
        required: [true, 'User must have an email'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide valid email']
    },

    phoneNumber: {
        type: String,
        unique: true,
        required: [true, 'Users must have a phone number']
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },

    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        
        validate: {     //custom validator
            validator: function(el){
                return el === this.password;
            },
            message: "Password must be the same"
        },
    },

    preferences: {
        categories: [{type:String}]
    },

    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',  
    }],

    shopName: {
        type: String,
        default: null 
    },

    productsPosted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],

    notifications: [
        {
          title: String,
          message: String,
          isRead: { type: Boolean, default: false },
          timestamp: { type: Date, default: Date.now },
        },
    ],

    referralCode: {
        type: String,
        unique: true,
        required: true,
        default: function() {
            return crypto.randomBytes(6).toString('hex');  
        }
    },

    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        default: null,
    },
  
    role: {
        type: String,
        enum: ['user', 'seller'],
        default: 'user'
    }
},
    { timestamps: true }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;