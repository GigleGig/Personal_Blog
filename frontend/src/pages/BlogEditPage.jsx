import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { blogService } from '../services/api';
import BlogForm from '../components/admin/BlogForm';
import GuideBar from './GuideBar';

function BlogEditPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      navigate('/login');
      toast.error('You must be an admin to access this page');
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // If we have an ID, find the specific blog post
        if (id) {
          const response = await blogService.getBlogById(id);
          if (response.data) {
            setBlog(response.data);
          } else {
            toast.error('Blog post not found');
            navigate('/admin');
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setLoading(false);
        toast.error('Failed to load blog data');
        navigate('/admin');
      }
    };
    
    fetchData();
  }, [isAdmin, navigate, id]);
  
  const handleSave = async (formData) => {
    try {
      if (id) {
        // Update existing blog
        await blogService.updateBlog(id, formData);
        toast.success('Blog post updated successfully');
      } else {
        // Add new blog
        await blogService.createBlog(formData);
        toast.success('Blog post created successfully');
      }
      
      // Return to admin dashboard
      navigate('/admin');
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Failed to save blog post');
    }
  };
  
  return (
    <div className="min-h-screen bg-base-100">
      <GuideBar />
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {id ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
          <div className="flex gap-2">
            <button 
              className="btn btn-outline btn-square" 
              onClick={() => navigate('/admin', { state: { activeTab: 'blogs' } })}
              title="Back to Blog Posts"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <button 
              className="btn btn-outline" 
              onClick={() => navigate('/admin')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center my-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <BlogForm 
            existingBlog={blog} 
            onSave={handleSave}
            onCancel={() => navigate('/admin')}
          />
        )}
      </div>
    </div>
  );
}

export default BlogEditPage; 