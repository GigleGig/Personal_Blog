import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Set up multer storage for temporary files
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/temp/');  // Use a temporary directory
  },
  filename: function(req, file, cb) {
    cb(null, `temp-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Initialize upload
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max file size
});

// @route   POST /api/upload/image
// @desc    Upload image
router.post('/image', protect, admin, upload.single('image'), uploadImage);

export default router;