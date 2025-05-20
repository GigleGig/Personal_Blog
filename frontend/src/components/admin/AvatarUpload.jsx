import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function AvatarUpload({ currentAvatar, onAvatarUpdate }) {
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
      formData.append('avatar', selectedFile);

      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:5000/api/profile/avatar', 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.avatarUrl) {
        // Add a cache buster to force reload of the image
        const avatarWithCacheBuster = `${response.data.avatarUrl}?t=${new Date().getTime()}`;
        
        toast.success('Avatar uploaded successfully');
        
        // Call the callback function to update parent component with the cache-busted URL
        if (onAvatarUpdate) {
          onAvatarUpdate(avatarWithCacheBuster);
        }

        // Reset file input but keep preview with new image
        setSelectedFile(null);
        setPreview(avatarWithCacheBuster);
        
        // Reload the image in any img tags that might be using it
        const allImages = document.querySelectorAll('img[src*="avatar"]');
        allImages.forEach(img => {
          const currentSrc = img.src;
          img.src = avatarWithCacheBuster;
        });
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error(error.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-base-200 p-6 rounded-box shadow-lg mb-6">
      <h3 className="text-lg font-bold mb-4">Update Avatar</h3>
      
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Current avatar preview */}
        <div className="avatar">
          <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img 
              src={preview || currentAvatar || "https://avatars.githubusercontent.com/u/GigleGig"} 
              alt="Avatar preview" 
            />
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
              'Upload Avatar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvatarUpload; 