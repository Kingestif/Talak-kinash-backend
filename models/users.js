const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcrypt');


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

UserSchema.pre('save', async function(next){        
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;   
});

UserSchema.methods.checkPassword = function(givenPassword, storedPassword){
    return bcrypt.compare(givenPassword, storedPassword);
}

const User = mongoose.model('User', UserSchema);

module.exports = User;