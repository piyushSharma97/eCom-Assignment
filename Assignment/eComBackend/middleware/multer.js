const multer = require('multer');
const path = require('path');

// Configure multer to save files in the 'uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

// Create the multer instance with the storage configuration
const upload = multer({ storage });

module.exports = upload;