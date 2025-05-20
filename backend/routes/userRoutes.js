import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  requestVerificationCode,
  verifyCodeAndLogin
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/users
// @desc    Register user
router.post('/', registerUser);

// @route   POST /api/users/login
// @desc    Authenticate user & get token (traditional login)
router.post('/login', loginUser);

// @route   POST /api/users/request-code
// @desc    Request verification code for admin login
router.post('/request-code', requestVerificationCode);

// @route   POST /api/users/verify-code
// @desc    Verify code and login
router.post('/verify-code', verifyCodeAndLogin);

// @route   GET /api/users/profile
// @desc    Get user profile
router.get('/profile', protect, getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
router.put('/profile', protect, updateUserProfile);

export default router; 