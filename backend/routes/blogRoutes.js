import express from 'express';
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/blogs
// @desc    Get all blogs
router.get('/', getBlogs);

// @route   GET /api/blogs/:id
// @desc    Get blog by ID
router.get('/:id', getBlogById);

// @route   POST /api/blogs
// @desc    Create a blog
router.post('/', protect, admin, createBlog);

// @route   PUT /api/blogs/:id
// @desc    Update a blog
router.put('/:id', protect, admin, updateBlog);

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
router.delete('/:id', protect, admin, deleteBlog);

export default router; 