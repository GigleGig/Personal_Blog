import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { generateVerificationCode, sendVerificationCode } from '../utils/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request verification code for login
// @route   POST /api/users/request-code
// @access  Public
export const requestVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log(`Verification code requested for: ${email}`);
    console.log(`Admin email from env: ${process.env.ADMIN_EMAIL}`);
    
    // Check if the email is the admin email
    if (email !== process.env.ADMIN_EMAIL) {
      console.log('Not authorized as admin - email mismatch');
      return res.status(401).json({ message: 'Not authorized as admin' });
    }

    // Find user by email
    let user = await User.findOne({ email });
    console.log(`User found by email: ${!!user}`);

    if (!user) {
      // Check if admin user exists with different email
      const existingAdmin = await User.findOne({ username: 'admin' });
      
      if (existingAdmin) {
        console.log('Existing admin found, updating email');
        // Update the existing admin's email
        existingAdmin.email = email;
        user = existingAdmin;
      } else {
        // Create a new admin user with a unique username
        console.log('Creating new admin user');
        const timestamp = Date.now();
        user = await User.create({
          username: `admin_${timestamp}`,
          email,
          password: Math.random().toString(36).slice(-8), // Random password, not used for login
          isAdmin: true,
        });
      }
    }
    
    // Generate a verification code
    const verificationCode = generateVerificationCode();
    console.log(`Generated verification code: ${verificationCode}`);
    
    // Set expiration to 10 minutes from now
    const codeExpiration = new Date();
    codeExpiration.setMinutes(codeExpiration.getMinutes() + 10);
    
    // Save the code to the user
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = codeExpiration;
    await user.save();
    console.log('Verification code saved to user');
    
    // Send the code via email
    try {
      await sendVerificationCode(email, verificationCode);
      console.log('Verification code email sent');
      
      res.status(200).json({ 
        message: 'Verification code sent to your email',
        email
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      
      // If email fails, return the error but don't expose sensitive details
      res.status(500).json({ 
        message: 'Failed to send verification code. Please check email configuration.',
        error: process.env.NODE_ENV === 'development' ? emailError.message : undefined
      });
    }
  } catch (error) {
    console.error('Error requesting verification code:', error);
    res.status(500).json({ 
      message: 'Failed to send verification code',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Verify code and login
// @route   POST /api/users/verify-code
// @access  Public
export const verifyCodeAndLogin = async (req, res) => {
  try {
    const { email, code } = req.body;
    
    // Check if the email is the admin email
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ message: 'Not authorized as admin' });
    }

    const user = await User.findOne({ 
      email,
      verificationCode: code,
      verificationCodeExpires: { $gt: new Date() }  // Code hasn't expired
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid or expired verification code' });
    }
    
    // Clear the verification code
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();
    
    // Return user data with token
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ message: 'Failed to verify code' });
  }
};

// @desc    Auth user & get token (Traditional login - keep for backward compatibility)
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 