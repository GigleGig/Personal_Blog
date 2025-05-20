import express from 'express';
import {
  createOrUpdateProfile,
  getProfile,
  addEducation,
  deleteEducation,
  addExperience,
  deleteExperience,
  addProjectExperience,
  deleteProjectExperience,
  uploadAvatar
} from '../controllers/profileController.js';
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

// @route   GET /api/profile
// @desc    Get profile
router.get('/', getProfile);

// @route   POST /api/profile
// @desc    Create or update profile
router.post('/', protect, admin, createOrUpdateProfile);

// @route   POST /api/profile/avatar
// @desc    Upload avatar image
router.post('/avatar', protect, admin, upload.single('avatar'), uploadAvatar);

// @route   PUT /api/profile/education
// @desc    Add education
router.put('/education', protect, admin, addEducation);

// @route   DELETE /api/profile/education/:edu_id
// @desc    Delete education
router.delete('/education/:edu_id', protect, admin, deleteEducation);

// @route   PUT /api/profile/experience
// @desc    Add experience
router.put('/experience', protect, admin, addExperience);

// @route   DELETE /api/profile/experience/:exp_id
// @desc    Delete experience
router.delete('/experience/:exp_id', protect, admin, deleteExperience);

// @route   PUT /api/profile/project
// @desc    Add project experience
router.put('/project', protect, admin, addProjectExperience);

// @route   DELETE /api/profile/project/:proj_id
// @desc    Delete project experience
router.delete('/project/:proj_id', protect, admin, deleteProjectExperience);

export default router; 