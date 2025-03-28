const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'seller_ids', 
        format: async (req, file) => 'png', 
        public_id: (req, file) => Date.now() + '-' + file.originalname 
    }
});

const uploadMiddleware = multer({ storage });

module.exports = uploadMiddleware;