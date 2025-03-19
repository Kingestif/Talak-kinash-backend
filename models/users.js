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

    shopName: {
        type: String,
        default: null 
    },

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

    identification: { type: String, required: function () { return this.role === "seller"; } },

    chapaApi: {
        type: String,
        // unique: true
    },

    emailVerified: {
        type: Boolean,
        default: false
    },

    sellerVerified: {
        type: Boolean,
        default: false
    },

    verificationToken: {
        type: String
    },
  
    role: {
        type: String,
        enum: ['user', 'seller', 'admin'],
        default: 'user'
    },

    recommendations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], 
},
    { timestamps: true }
);

//mock data
const { faker } = require("@faker-js/faker");

const categories = ["Shoes", "Pc", "Mobile", "Clothes", "Groceries", "Electronics", "Furniture", "Beauty", "Toys", "Books"];
const tags = ["Nike", "Air Force", "Jordan", "Adidas", "Puma", "HP", "Dell", "MacBook", "Asus", "Lenovo", "iPhone", "Samsung", "Tecno", "Huawei", "OnePlus", "T-Shirt", "Jeans", "Jacket", "Sweater", "Dress", "Organic", "Fresh", "Discount", "Imported", "Local", "Reebok", "Converse", "New Balance", "Vans", "Acer", "MSI", "Razer", "Microsoft", "Xiaomi", "Oppo", "Google Pixel", "Sony", "Skirt", "Shirt", "Shorts", "Suit", "Blouse", "Frozen", "Canned", "Vegan", "Gluten-Free", "Dairy", "Headphones", "Speakers", "TV", "Camera", "Smartwatch", "Laptop", "Smartphone", "Tablet", "Projector", "Sofa", "Bed", "Chair", "Table", "Desk", "Bookshelf", "Wardrobe", "Dresser", "Couch", "Coffee Table", "Skincare", "Makeup", "Haircare", "Fragrance", "Nail Care", "Bath & Body", "Shampoo", "Conditioner", "Perfume", "Action Figures", "Dolls", "Board Games", "Puzzles", "Building Blocks", "Stuffed Animals", "Remote Control Cars", "Video Games", "Fiction", "Non-Fiction", "Mystery", "Biography", "Children's Books", "Self-Help", "History", "Cookbooks"];



function createRandomUser() {
    const now = new Date(); 

    return {
        name: faker.internet.username(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number("+2519########"),
        password: faker.internet.password(),
        shopName: faker.company.name(),
        createdAt: now,
    };
}

const fakeUser = Array.from({ length: 1 }, createRandomUser);

UserSchema.pre('save', async function(next){        
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;   
});

UserSchema.methods.checkPassword = function(givenPassword, storedPassword){
    return bcrypt.compare(givenPassword, storedPassword);
}

const User = mongoose.model('User', UserSchema);

const seedUsers = async () => {
    await User.insertMany(fakeUser); 
    console.log("Mock users added!"); 
};
  
// seedUsers();

module.exports = User;