const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

// Cloudinary config
cloudinary.config({
    cloud_name: "dsuheum6h",
    api_key: "229554584519868",
    api_secret: "4IiWoPua31sbeoHrSd66Gc8MD_Q"
});

// Create upload directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'public', 'temp');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config: store files temporarily in 'public/temp' folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Use original file name + timestamp
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max file size
    }
});

// Cloudinary upload function
const uploadfile = async (filepath, folderName, fileType) => {
    try {
        console.log('Uploading file to Cloudinary:', filepath);
        const uploadResult = await cloudinary.uploader.upload(filepath, {
            folder: folderName,
            resource_type: fileType === 'image' ? 'image' : 'raw'
        });
        console.log('Cloudinary upload successful:', uploadResult.secure_url);
        return uploadResult;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};

module.exports = { upload, uploadfile };