import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { profileService } from '../services/api';
import GuideBar from './GuideBar';
import ProfileForm from '../components/admin/ProfileForm';

function ProfileEditPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      navigate('/login');
      toast.error('You must be an admin to access this page');
      return;
    }
    
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await profileService.getProfile();
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
        toast.error('Creating new profile as none exists');
        // Allow creation of a new profile when fetch fails
        setProfile(null);
      }
    };
    
    fetchProfile();
  }, [isAdmin, navigate]);
  
  return (
    <div className="min-h-screen bg-base-100">
      <GuideBar />
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {profile ? 'Edit Profile' : 'Create Profile'}
          </h1>
          <div className="flex gap-2">
            <button 
              className="btn btn-outline btn-square" 
              onClick={() => navigate('/admin', { state: { activeTab: 'profile' } })}
              title="Back to Profile"
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
          <ProfileForm existingProfile={profile} />
        )}
      </div>
    </div>
  );
}

export default ProfileEditPage; 