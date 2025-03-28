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
    images: {
        type: [String],
        required: [true, 'product must have 1 or more image']
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: [true, 'Product must have a seller'],
    },
    
    // isVerfied: {
    //     type: Boolean,
    //     default: false, 
    // },

    isFeatured: {
        type: Boolean,
        default: false
    },

    featuredUntil: {
        type: Date,
        default: null
    }



},
    { timestamps: true }
);


//mock data
const { faker } = require("@faker-js/faker");
const categoryTagMap = {
    "Shoes": ["Nike", "Air Force", "Jordan", "Adidas", "Puma", "Reebok", "Converse", "New Balance", "Vans"],
    "Pc": ["HP", "Dell", "MacBook", "Asus", "Lenovo", "Acer", "MSI", "Razer", "Microsoft"],
    "Mobile": ["iPhone", "Samsung", "Tecno", "Huawei", "OnePlus", "Xiaomi", "Oppo", "Google Pixel", "Sony"],
    "Clothes": ["T-Shirt", "Jeans", "Jacket", "Sweater", "Dress", "Skirt", "Shirt", "Shorts", "Suit", "Blouse"],
    "Groceries": ["Organic", "Fresh", "Discount", "Imported", "Local", "Frozen", "Canned", "Vegan", "Gluten-Free", "Dairy"],
    "Electronics": ["Headphones", "Speakers", "TV", "Camera", "Smartwatch", "Laptop", "Smartphone", "Tablet", "Projector"],
    "Furniture": ["Sofa", "Bed", "Chair", "Table", "Desk", "Bookshelf", "Wardrobe", "Dresser", "Couch", "Coffee Table"],
    "Beauty": ["Skincare", "Makeup", "Haircare", "Fragrance", "Nail Care", "Bath & Body", "Shampoo", "Conditioner", "Perfume"],
    "Toys": ["Action Figures", "Dolls", "Board Games", "Puzzles", "Building Blocks", "Stuffed Animals", "Remote Control Cars", "Video Games"],
    "Books": ["Fiction", "Non-Fiction", "Mystery", "Biography", "Children's Books", "Self-Help", "History", "Cookbooks"]
};


function createRandomProduct() {
    const category = faker.helpers.arrayElement(Object.keys(categoryTagMap));  

    return {
        name: faker.commerce.productName(), 
        description: faker.commerce.productDescription(), 
        price: faker.commerce.price(), 
        category: category,
        tag: faker.helpers.arrayElements(categoryTagMap[category], { min: 1, max: 1}),
        images: [faker.image.url()], 
        seller: faker.database.mongodbObjectId(), 
    };
}

const fakeProduct = Array.from({ length: 5 }, createRandomProduct); 


const Product = mongoose.model('Product', ProductSchema); 

// const testProduct = new Product({ 
//     name: "hi",   
//     description: "dsaf", 
//     price: "123", 
//     category: "a", 
//     images: "ds", 
//     seller: "as", 
// });

// testProduct.save().then(doc => {
//     console.log(doc);
// }).catch(err =>{
//     console.log(err);
// });


const seedProduct = async () => {
    await Product.insertMany(fakeProduct); 
    console.log("Mock products added!"); 
};
  
// seedProduct();

module.exports = Product;
