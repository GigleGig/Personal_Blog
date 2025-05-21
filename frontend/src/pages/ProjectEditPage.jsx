import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { projectService } from '../services/api';
import GuideBar from './GuideBar';
import ImageUpload from '../components/admin/ImageUpload';

function ProjectEditPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    repoUrl: '',
    demoUrl: '',
    imageUrl: '',
    technologies: [],
    featured: false,
    order: 0
  });
  
  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      navigate('/login');
      toast.error('You must be an admin to access this page');
      return;
    }
    
    const fetchProject = async () => {
      try {
        setLoading(true);
        if (id) {
          const response = await projectService.getProjectById(id);
          if (response.data) {
            setProject(response.data);
            setFormData({
              name: response.data.name || '',
              description: response.data.description || '',
              repoUrl: response.data.repoUrl || '',
              demoUrl: response.data.demoUrl || '',
              imageUrl: response.data.imageUrl || '',
              technologies: response.data.technologies || [],
              featured: response.data.featured || false,
              order: response.data.order || 0
            });
          } else {
            toast.error('Project not found');
            navigate('/admin');
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project:', error);
        setLoading(false);
        toast.error('Failed to load project data');
        navigate('/admin');
      }
    };
    
    fetchProject();
  }, [isAdmin, navigate, id]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
    });
  };
  
  // Handle technologies changes
  const handleTechnologiesChange = (e) => {
    const { value } = e.target;
    const techList = value.split(',').map(tech => tech.trim()).filter(tech => tech !== '');
    
    setFormData({
      ...formData,
      technologies: techList
    });
  };
  
  // Handle image update from the upload component
  const handleImageUpdate = (imageUrl) => {
    setFormData({
      ...formData,
      imageUrl: imageUrl
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (id) {
        // Update existing project
        await projectService.updateProject(id, formData);
        toast.success('Project updated successfully');
      } else {
        // Create new project
        await projectService.createProject(formData);
        toast.success('Project created successfully');
      }
      
      // Return to admin dashboard
      navigate('/admin', { state: { activeTab: 'projects' } });
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-base-100">
      <GuideBar />
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {id ? 'Edit Project' : 'Create New Project'}
          </h1>
          <div className="flex gap-2">
            <button 
              className="btn btn-outline btn-square" 
              onClick={() => navigate('/admin', { state: { activeTab: 'projects' } })}
              title="Back to Projects"
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
          <div className="bg-base-200 p-6 rounded-box shadow-lg">
            <h2 className="text-2xl font-bold mb-6">
              {id ? 'Edit Project' : 'Create New Project'}
            </h2>
            
            {/* Add Image Upload Component */}
            <ImageUpload 
              currentImage={formData.imageUrl} 
              onImageUpdate={handleImageUpdate}
              folder="project_images"
              label="Project Image"
            />
            
            <form onSubmit={handleSubmit}>
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Project Name</span>
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="input input-bordered w-full" 
                  placeholder="My Awesome Project"
                  required
                />
              </div>
              
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  className="textarea textarea-bordered w-full h-24" 
                  placeholder="Describe your project..."
                  required
                ></textarea>
              </div>
              
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Repository URL</span>
                </label>
                <input 
                  type="url" 
                  name="repoUrl" 
                  value={formData.repoUrl} 
                  onChange={handleChange} 
                  className="input input-bordered w-full" 
                  placeholder="https://github.com/username/project"
                  required
                />
              </div>
              
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Demo URL (Optional)</span>
                </label>
                <input 
                  type="url" 
                  name="demoUrl" 
                  value={formData.demoUrl} 
                  onChange={handleChange} 
                  className="input input-bordered w-full" 
                  placeholder="https://myproject.com"
                />
              </div>
              
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Image URL (Optional - or use upload above)</span>
                </label>
                <input 
                  type="url" 
                  name="imageUrl" 
                  value={formData.imageUrl} 
                  onChange={handleChange} 
                  className="input input-bordered w-full" 
                  placeholder="https://example.com/project-image.jpg"
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <label className="label">
                      <span className="label-text-alt">Preview:</span>
                    </label>
                    <img 
                      src={formData.imageUrl} 
                      alt="Project preview" 
                      className="w-32 h-20 object-cover rounded"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Technologies</span>
                </label>
                <textarea 
                  value={formData.technologies.join(', ')} 
                  onChange={handleTechnologiesChange} 
                  className="textarea textarea-bordered w-full" 
                  placeholder="React, Node.js, MongoDB, Express"
                ></textarea>
                <label className="label">
                  <span className="label-text-alt">Separate with commas</span>
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="form-control w-full">
                  <label className="label cursor-pointer justify-start gap-2">
                    <input 
                      type="checkbox" 
                      name="featured" 
                      checked={formData.featured} 
                      onChange={handleChange} 
                      className="checkbox checkbox-primary" 
                    />
                    <span className="label-text">Featured Project</span>
                  </label>
                </div>
                
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Display Order</span>
                  </label>
                  <input 
                    type="number" 
                    name="order" 
                    value={formData.order} 
                    onChange={handleChange} 
                    className="input input-bordered w-full" 
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-6">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => navigate('/admin', { state: { activeTab: 'projects' } })}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                      Saving...
                    </>
                  ) : (
                    id ? 'Update Project' : 'Create Project'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectEditPage;