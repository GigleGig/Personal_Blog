import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  importGithubProjects
} from '../controllers/projectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects
router.get('/', getProjects);

// @route   GET /api/projects/:id
// @desc    Get project by ID
router.get('/:id', getProjectById);

// @route   POST /api/projects
// @desc    Create a project
router.post('/', protect, admin, createProject);

// @route   PUT /api/projects/:id
// @desc    Update a project
router.put('/:id', protect, admin, updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete a project
router.delete('/:id', protect, admin, deleteProject);

// @route   POST /api/projects/import-github
// @desc    Import projects from GitHub
router.post('/import-github', protect, admin, importGithubProjects);

export default router; 