// Backend/middlewares/uploader.js

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: "dsuheum6h",
    api_key: "229554584519868",
    api_secret: "4IiWoPua31sbeoHrSd66Gc8MD_Q" // Click 'View Credentials' below to copy your API secret
});

// Configure storage for multer to use Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // Cloudinary folder name
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});

const parser = multer({ storage: storage });

module.exports = parser;