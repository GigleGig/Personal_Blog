import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { blogService } from '../../services/api';

function BlogForm({ existingBlog, onSave, onCancel }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    imageUrl: '',
    tags: [],
    published: true
  });
  
  // Initialize form with existing blog data if provided
  useEffect(() => {
    if (existingBlog) {
      setFormData({
        title: existingBlog.title || '',
        content: existingBlog.content || '',
        summary: existingBlog.summary || '',
        imageUrl: existingBlog.imageUrl || '',
        tags: existingBlog.tags || [],
        published: existingBlog.published !== undefined ? existingBlog.published : true
      });
    }
  }, [existingBlog]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };
  
  // Handle tags changes
  const handleTagsChange = (e) => {
    const { value } = e.target;
    const tagList = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    
    setFormData({
      ...formData,
      tags: tagList
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // If an existing blog was provided, this is an update
      if (existingBlog) {
        await blogService.updateBlog(existingBlog._id, formData);
        toast.success('Blog updated successfully');
      } else {
        // Add new blog
        await blogService.createBlog(formData);
        toast.success('Blog created successfully');
      }
      
      // Call onSave callback if provided, or navigate back
      if (onSave) {
        onSave(formData);
      } else {
        navigate('/admin');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Failed to save blog');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-base-200 p-6 rounded-box shadow-lg">
      <h2 className="text-2xl font-bold mb-6">
        {existingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h2>
      
      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input 
          type="text" 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          className="input input-bordered w-full" 
          placeholder="Enter blog title"
        />
      </div>
      
      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">Summary</span>
        </label>
        <textarea 
          name="summary" 
          value={formData.summary} 
          onChange={handleChange} 
          className="textarea textarea-bordered w-full h-24" 
          style={{ whiteSpace: 'pre-wrap' }}
          placeholder="A brief summary of your blog post"
        ></textarea>
      </div>
      
      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">Content</span>
        </label>
        <textarea 
          name="content" 
          value={formData.content} 
          onChange={handleChange} 
          className="textarea textarea-bordered w-full h-64" 
          style={{ whiteSpace: 'pre-wrap' }}
          placeholder="Write your blog content here..."
        ></textarea>
      </div>
      
      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">Image URL</span>
        </label>
        <input 
          type="text" 
          name="imageUrl" 
          value={formData.imageUrl} 
          onChange={handleChange} 
          className="input input-bordered w-full" 
          placeholder="https://example.com/image.jpg"
        />
      </div>
      
      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">Tags</span>
        </label>
        <textarea 
          value={formData.tags.join(', ')} 
          onChange={handleTagsChange} 
          className="textarea textarea-bordered w-full" 
          placeholder="react, programming, tutorial"
        ></textarea>
        <label className="label">
          <span className="label-text-alt">Separate with commas</span>
        </label>
      </div>
      
      <div className="form-control w-full mb-6">
        <label className="label cursor-pointer justify-start gap-2">
          <input 
            type="checkbox" 
            name="published" 
            checked={formData.published} 
            onChange={handleChange} 
            className="checkbox checkbox-primary" 
          />
          <span className="label-text">Publish immediately</span>
        </label>
      </div>
      
      <div className="flex justify-end gap-4 mt-6">
        <button 
          type="button" 
          className="btn btn-outline" 
          onClick={onCancel || (() => navigate('/admin'))}
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm mr-2"></span>
              Saving...
            </>
          ) : (
            existingBlog ? 'Update Blog' : 'Create Blog'
          )}
        </button>
      </div>
    </div>
  );
}

export default BlogForm; 