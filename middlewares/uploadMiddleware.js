const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME2,
    api_key: process.env.CLOUDINARY_API_KEY2,
    api_secret: process.env.CLOUDINARY_API_SECRET2
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'seller_ids', 
    }
});

const uploadMiddleware = multer({ storage });

module.exports = uploadMiddleware;