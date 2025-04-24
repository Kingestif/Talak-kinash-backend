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
        embedding: [Number],
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
    }



},
    { timestamps: true }
);

ProductSchema.index({ category: 1 });
ProductSchema.index({ tag: 1 });
ProductSchema.index({ price: 1 });


//mock data
// const { faker } = require("@faker-js/faker");
// const categoryTagMap = {
//     "Shoes": ["Nike", "Air Force", "Jordan", "Adidas", "Puma", "Reebok", "Converse", "New Balance", "Vans"],
//     "Pc": ["HP", "Dell", "MacBook", "Asus", "Lenovo", "Acer", "MSI", "Razer", "Microsoft"],
//     "Mobile": ["iPhone", "Samsung", "Tecno", "Huawei", "OnePlus", "Xiaomi", "Oppo", "Google Pixel", "Sony"],
//     "Clothes": ["T-Shirt", "Jeans", "Jacket", "Sweater", "Dress", "Skirt", "Shirt", "Shorts", "Suit", "Blouse"],
//     "Groceries": ["Organic", "Fresh", "Discount", "Imported", "Local", "Frozen", "Canned", "Vegan", "Gluten-Free", "Dairy"],
//     "Electronics": ["Headphones", "Speakers", "TV", "Camera", "Smartwatch", "Laptop", "Smartphone", "Tablet", "Projector"],
//     "Furniture": ["Sofa", "Bed", "Chair", "Table", "Desk", "Bookshelf", "Wardrobe", "Dresser", "Couch", "Coffee Table"],
//     "Beauty": ["Skincare", "Makeup", "Haircare", "Fragrance", "Nail Care", "Bath & Body", "Shampoo", "Conditioner", "Perfume"],
//     "Toys": ["Action Figures", "Dolls", "Board Games", "Puzzles", "Building Blocks", "Stuffed Animals", "Remote Control Cars", "Video Games"],
//     "Books": ["Fiction", "Non-Fiction", "Mystery", "Biography", "Children's Books", "Self-Help", "History", "Cookbooks"]
// };


// function createRandomProduct() {
//     const category = faker.helpers.arrayElement(Object.keys(categoryTagMap));  

//     return {
//         name: faker.commerce.productName(), 
//         description: faker.commerce.productDescription(), 
//         price: parseInt(faker.commerce.price(), 10), 
//         category: category,
//         tag: faker.helpers.arrayElements(categoryTagMap[category], { min: 1, max: 1}),
//         images: [{
//             url: faker.image.url(),  // Correct URL generation
//             tags: ["newtag"]         // Correct tags array structure
//         }],
//         seller: faker.database.mongodbObjectId(), 
//     };
// }

// const fakeProduct = Array.from({ length: 200 }, createRandomProduct); 

ProductSchema.index({ name: 'text', description: 'text', tag: 'text', category: 'text' }, { weights: {name: 10, description: 5, tag: 2, category: 2}});

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


// const seedProduct = async () => {
//     await Product.insertMany(fakeProduct); 
//     console.log("Mock products added!"); 
// };
  
// seedProduct();

module.exports = Product;
