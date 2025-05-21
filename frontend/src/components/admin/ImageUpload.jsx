import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function ImageUpload({ currentImage, onImageUpdate, folder = 'project_images', label = 'Project Image' }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('folder', folder);

      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:5000/api/upload/image', 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.imageUrl) {
        // Add a cache buster to force reload of the image
        const imageWithCacheBuster = `${response.data.imageUrl}?t=${new Date().getTime()}`;
        
        toast.success('Image uploaded successfully');
        
        // Call the callback function to update parent component
        if (onImageUpdate) {
          onImageUpdate(imageWithCacheBuster);
        }

        // Reset file input but keep preview with new image
        setSelectedFile(null);
        setPreview(imageWithCacheBuster);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Handle remove image
  const handleRemoveImage = () => {
    setPreview(null);
    setSelectedFile(null);
    if (onImageUpdate) {
      onImageUpdate('');
    }
  };

  return (
    <div className="bg-base-200 p-6 rounded-box shadow-lg mb-6">
      <h3 className="text-lg font-bold mb-4">{label}</h3>
      
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Current image preview */}
        <div className="avatar">
          <div className="w-32 h-24 rounded-lg ring ring-primary ring-offset-base-100 ring-offset-2">
            {(preview || currentImage) ? (
              <img 
                src={preview || currentImage} 
                alt="Image preview" 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Select Image (Max 5MB)</span>
              <span className="label-text-alt">JPG, PNG, GIF, WEBP, SVG</span>
            </label>
            <input 
              type="file" 
              className="file-input file-input-bordered w-full" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Uploading...
                </>
              ) : (
                'Upload Image'
              )}
            </button>
            
            {(preview || currentImage) && (
              <button 
                className="btn btn-error btn-outline"
                onClick={handleRemoveImage}
                disabled={uploading}
              >
                Remove Image
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;