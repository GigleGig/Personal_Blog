import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { profileService } from '../services/api';
import EducationForm from '../components/admin/EducationForm';
import GuideBar from './GuideBar';

function EditEducation() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [education, setEducation] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is admin and fetch education data
  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    
    const fetchEducation = async () => {
      try {
        setLoading(true);
        const profileRes = await profileService.getProfile();
        if (!profileRes.data || !profileRes.data.education) {
          toast.error('Could not find education data');
          navigate('/admin');
          return;
        }
        
        const educationItem = profileRes.data.education.find(edu => edu._id === id);
        if (!educationItem) {
          toast.error('Education record not found');
          navigate('/admin');
          return;
        }
        
        setEducation(educationItem);
      } catch (error) {
        console.error('Error fetching education:', error);
        toast.error('Failed to load education data');
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEducation();
  }, [isAdmin, navigate, id]);
  
  const handleSave = async (updatedEducation) => {
    try {
      // We need to implement a specific update endpoint or use a workaround
      // Here we'll delete the old record and add the new one since the backend might not have a direct update endpoint
      await profileService.deleteEducation(id);
      await profileService.addEducation(updatedEducation);
      
      toast.success('Education updated successfully');
      navigate('/admin');
    } catch (error) {
      console.error('Error updating education:', error);
      toast.error('Failed to update education');
    }
  };
  
  return (
    <div className="min-h-screen bg-base-100">
      <GuideBar />
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Edit Education</h1>
          <div className="flex gap-2">
            <button 
              className="btn btn-outline btn-square" 
              onClick={() => navigate('/admin', { state: { activeTab: 'education' } })}
              title="Back to Education"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/admin')}>
              Back to Dashboard
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center my-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <EducationForm 
            existingEducation={education} 
            onSave={handleSave} 
            onCancel={() => navigate('/admin')} 
          />
        )}
      </div>
    </div>
  );
}

export default EditEducation; 