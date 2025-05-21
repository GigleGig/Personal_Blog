import cloudinary from '../config/cloudinaryConfig.js';
import { promises as fs } from 'fs';

// @desc    Upload image for projects or other purposes
// @route   POST /api/upload/image
// @access  Private/Admin
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const { folder } = req.body; // Allow specifying folder via form data
    const uploadFolder = folder || 'blog_images'; // Default folder
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: uploadFolder,
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' }
      ]
    });
    
    // Delete local file after upload to Cloudinary
    await fs.unlink(req.file.path).catch(err => console.log('Error deleting local file:', err));
    
    // Return the image URL
    res.json({ 
      message: 'Image uploaded successfully', 
      imageUrl: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Image upload error:', error);
    // If there was a local file, try to delete it
    if (req.file && req.file.path) {
      await fs.unlink(req.file.path).catch(err => console.log('Error deleting local file:', err));
    }
    res.status(500).json({ message: error.message });
  }
};
