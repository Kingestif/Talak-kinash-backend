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
        required: [true, 'Users must have a phone number'],
        validate: {                 
            validator: function (v) {
              return /^\+\d{1,3}\d{6,14}$/.test(v); 
            }, 
            message: props => `${props.value} is not a valid phone number!`
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },

    gender: {
        type: String,
        enum: ["male", "female"],
        default: null
    },

    birthday: {
        type: Date,
        default: null
    },

    preferences: {
        categories: [String],  
        tags: [String],       
    },

    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',  
    }],

    shopName: { type: String, required: function () { return this.role === "seller"; }},

    storeLocation: { 
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        }, 
        coordinates: {
            type: [Number],  // [longitude, latitude]
        }       
    },

    storeLink: { type: String, required: function () { return this.role === "seller"; },},

    productsPosted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],

    referralCode: {
        type: String,
        unique: true,
        required: true,
        default: function() {
            return crypto.randomBytes(3).toString('hex').toUpperCase(); 
        }
    },

    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        default: null,
    },

    rewardPoints: {
        type: Number,
        default: 0
    },

    identification: { type: String, required: function () { return this.role === "seller"; } },

    chapaApi: {
        type: String,
    },

    emailVerified: {
        type: Boolean,
        default: false
    },

    sellerVerified: {
        type: Boolean,
        default: false
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending'
    },

    verificationToken: {
        type: String
    },

    resetPasswordToken:{
        type: String
    },

    resetPasswordExpires:{
        type: Date
    },

    role: {
        type: String,
        enum: ['user', 'seller', 'admin'],
        default: 'user'
    },

    refreshTokens: [
        {
            token: {
                type: String,
            },
            createdAt: Date,
            device: String 
        }
    ],

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

UserSchema.index({ storeLocation: '2dsphere' });
const User = mongoose.model('User', UserSchema);

module.exports = User;