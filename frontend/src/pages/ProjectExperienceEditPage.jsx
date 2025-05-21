import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { profileService } from '../services/api';
import GuideBar from './GuideBar';
import ProjectExperienceForm from '../components/admin/ProjectExperienceForm';

function ProjectExperienceEditPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // For editing existing project experience
  const location = useLocation(); // Get the location object
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
    
    // Check if the project is coming from the GitHub import page
    const githubProjectData = sessionStorage.getItem('github_project_edit');
    if (githubProjectData && location.state?.fromGithub) {
      try {
        const parsedData = JSON.parse(githubProjectData);
        // Format GitHub data to match project experience format
        const formattedData = {
          ...parsedData,
          description: parsedData.description 
            ? { en: parsedData.description, it: parsedData.description } 
            : { en: '', it: '' },
          bullets: parsedData.bullets || { en: [], it: [] },
          technologies: parsedData.technologies || []
        };
        setProject(formattedData);
        sessionStorage.removeItem('github_project_edit'); // Clear after use
        setLoading(false);
        return;
      } catch (error) {
        console.error('Error parsing GitHub project data:', error);
      }
    }
    
    // If there is no ID, it means it is a new project, so do not try to get existing project
    if (!id) {
      setLoading(false);
      return;
    }
    
  // In ProjectExperienceEditPage.jsx
  const fetchData = async () => {
    try {
      setLoading(true);
      // First try to find the project in the Project model
      try {
        const projectRes = await projectService.getProjectById(id);
        if (projectRes.data) {
          // Convert Project format to ProjectExperience format
          const projectData = {
            name: projectRes.data.name,
            description: { 
              en: projectRes.data.description, 
              it: projectRes.data.description 
            },
            technologies: projectRes.data.technologies || [],
            year: new Date().getFullYear().toString(),
            role: 'Developer',
            bullets: { en: [], it: [] },
            link: projectRes.data.repoUrl,
            image: projectRes.data.imageUrl
          };
          setProject(projectData);
          setLoading(false);
          return;
        }
      } catch (projectError) {
        console.log('Project not found in Project model, trying Profile model');
      }
      
      // If not found in Project model, try in Profile's projectExperience
      const profileRes = await profileService.getProfile();
      
      if (!profileRes.data) {
        setProfile({ projectExperience: [] });
        setLoading(false);
        return;
      }
      
      setProfile(profileRes.data || { projectExperience: [] });
      
      if (id && profileRes.data && profileRes.data.projectExperience) {
        const foundProject = profileRes.data.projectExperience.find(
          proj => proj._id === id
        );
        
        if (foundProject) {
          setProject(foundProject);
        } else {
          toast.error('Project experience not found');
          navigate('/admin', { state: { activeTab: 'experiences' } });
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      setProfile({ projectExperience: [] });
      if (id) {
        toast.error('Project not found. You can create a new one.');
        navigate('/admin', { state: { activeTab: 'experiences' } });
      }
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
          <div className="flex gap-2">
            <button 
              className="btn btn-outline btn-square" 
              onClick={() => navigate('/admin', { state: { activeTab: id ? 'experiences' : 'projects' } })}
              title={id ? "Back to Project Experiences" : "Back to Projects"}
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