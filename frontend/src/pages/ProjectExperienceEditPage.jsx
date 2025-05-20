import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { profileService } from '../services/api';
import GuideBar from './GuideBar';
import ProjectExperienceForm from '../components/admin/ProjectExperienceForm';

function ProjectExperienceEditPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // For editing existing project experience
  const [project, setProject] = useState(null);
  const [profile, setProfile] = useState(null);
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
        // Fetch profile data first
        const profileRes = await profileService.getProfile();
        setProfile(profileRes.data || { projectExperience: [] });
        
        // If we have an ID, find the specific project experience
        if (id && profileRes.data && profileRes.data.projectExperience) {
          const foundProject = profileRes.data.projectExperience.find(
            proj => proj._id === id
          );
          
          if (foundProject) {
            setProject(foundProject);
          } else {
            toast.error('Project experience not found');
            navigate('/admin');
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        // Create empty profile with projectExperience array if fetch fails
        setProfile({ projectExperience: [] });
        toast.error('Creating new project as data could not be loaded');
      }
    };
    
    fetchData();
  }, [isAdmin, navigate, id]);
  
  const handleSave = async (formData) => {
    try {
      if (id) {
        // Update existing project experience
        // First remove it from profile's projectExperience array
        const updatedProfile = { ...profile };
        const index = updatedProfile.projectExperience.findIndex(p => p._id === id);
        
        if (index !== -1) {
          // Replace at the same position to maintain order
          updatedProfile.projectExperience[index] = { ...formData, _id: id };
          await profileService.updateProfile(updatedProfile);
          toast.success('Project experience updated successfully');
        } else {
          toast.error('Failed to update: Project not found');
        }
      } else {
        // Add new project experience
        await profileService.addProjectExperience(formData);
        toast.success('Project experience added successfully');
      }
      
      // Return to admin dashboard
      navigate('/admin');
    } catch (error) {
      console.error('Error saving project experience:', error);
      toast.error('Failed to save project experience');
    }
  };
  
  return (
    <div className="min-h-screen bg-base-100">
      <GuideBar />
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {id ? 'Edit Project Experience' : 'Add Project Experience'}
          </h1>
          <button 
            className="btn btn-outline" 
            onClick={() => navigate('/admin')}
          >
            Back to Dashboard
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center my-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <ProjectExperienceForm 
            existingProject={project} 
            onSave={handleSave}
            onCancel={() => navigate('/admin')}
          />
        )}
      </div>
    </div>
  );
}

export default ProjectExperienceEditPage; 