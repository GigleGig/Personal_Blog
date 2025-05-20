import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { profileService } from '../../services/api';
import AvatarUpload from './AvatarUpload';

function ProfileForm({ existingProfile }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [activeLang, setActiveLang] = useState('en');
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    title: { en: '', it: '' },
    bio: { en: '', it: '' },
    tagline: { en: '', it: '' },
    avatar: '',
    location: '',
    languages: [
      { language: 'Mandarin', proficiency: 'Native' },
      { language: 'English', proficiency: 'Fluent' },
      { language: 'Italian', proficiency: 'Intermediate' }
    ],
    skills: {
      programmingLanguages: [],
      frameworks: [],
      databases: [],
      tools: [],
      webDevelopment: [],
      aiMl: [],
      other: []
    },
    education: [],
    experience: [],
    projectExperience: [],
    social: {
      github: 'https://github.com/GigleGig',
      twitter: 'https://x.com/hexaburden',
      linkedin: 'https://www.linkedin.com/in/xiaofeng-zhang-61a16b261/',
      email: 'zxf19970424@gmail.com'
    }
  });
  
  // Initialize form with existing profile data if provided
  useEffect(() => {
    if (existingProfile) {
      setFormData({
        fullName: existingProfile.fullName || '',
        title: existingProfile.title || { en: '', it: '' },
        bio: existingProfile.bio || { en: '', it: '' },
        tagline: existingProfile.tagline || { en: '', it: '' },
        avatar: existingProfile.avatar || '',
        location: existingProfile.location || '',
        languages: existingProfile.languages || [
          { language: 'Mandarin', proficiency: 'Native' },
          { language: 'English', proficiency: 'Fluent' },
          { language: 'Italian', proficiency: 'Intermediate' }
        ],
        skills: existingProfile.skills || {
          programmingLanguages: [],
          frameworks: [],
          databases: [],
          tools: [],
          webDevelopment: [],
          aiMl: [],
          other: []
        },
        education: existingProfile.education || [],
        experience: existingProfile.experience || [],
        projectExperience: existingProfile.projectExperience || [],
        social: existingProfile.social || {
          github: 'https://github.com/GigleGig',
          twitter: 'https://x.com/hexaburden',
          linkedin: 'https://www.linkedin.com/in/xiaofeng-zhang-61a16b261/',
          email: 'zxf19970424@gmail.com'
        }
      });
    }
  }, [existingProfile]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle multilingual field changes
  const handleMultilingualChange = (e, lang) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: {
        ...formData[name],
        [lang]: value
      }
    });
  };
  
  // Handle skills changes
  const handleSkillsChange = (e, category) => {
    const { value } = e.target;
    const skillsList = value.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
    
    setFormData({
      ...formData,
      skills: {
        ...formData.skills,
        [category]: skillsList
      }
    });
  };
  
  // Handle language changes
  const handleLanguageChange = (index, field, value) => {
    const updatedLanguages = [...formData.languages];
    updatedLanguages[index] = {
      ...updatedLanguages[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      languages: updatedLanguages
    });
  };
  
  // Add a new language
  const addLanguage = () => {
    setFormData({
      ...formData,
      languages: [
        ...formData.languages,
        { language: '', proficiency: 'Intermediate' }
      ]
    });
  };
  
  // Remove a language
  const removeLanguage = (index) => {
    const updatedLanguages = [...formData.languages];
    updatedLanguages.splice(index, 1);
    
    setFormData({
      ...formData,
      languages: updatedLanguages
    });
  };
  
  // Handle social media changes
  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      social: {
        ...formData.social,
        [name]: value
      }
    });
  };
  
  // Handle avatar update from the upload component
  const handleAvatarUpdate = (avatarUrl) => {
    setFormData({
      ...formData,
      avatar: avatarUrl
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await profileService.updateProfile(formData);
      toast.success('Profile updated successfully');
      navigate('/admin');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-base-200 p-6 rounded-box shadow-lg">
      <h2 className="text-2xl font-bold mb-6">
        {existingProfile ? 'Edit Profile' : 'Create Profile'}
      </h2>
      
      {/* Add Avatar Upload Component */}
      <AvatarUpload 
        currentAvatar={formData.avatar} 
        onAvatarUpdate={handleAvatarUpdate} 
      />
      
      <div className="tabs tabs-boxed mb-6">
        <button 
          className={`tab ${activeTab === 'general' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
        <button 
          className={`tab ${activeTab === 'skills' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          Skills
        </button>
        <button 
          className={`tab ${activeTab === 'languages' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('languages')}
        >
          Languages
        </button>
        <button 
          className={`tab ${activeTab === 'social' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('social')}
        >
          Social
        </button>
      </div>
      
      {activeTab === 'general' && (
        <div className="mb-6">
          <div className="tabs">
            <button 
              className={`tab tab-lifted ${activeLang === 'en' ? 'tab-active' : ''}`}
              onClick={() => setActiveLang('en')}
            >
              English
            </button>
            <button 
              className={`tab tab-lifted ${activeLang === 'it' ? 'tab-active' : ''}`}
              onClick={() => setActiveLang('it')}
            >
              Italian
            </button>
          </div>
          
          <div className="p-4 border rounded-b-box border-base-300">
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input 
                type="text" 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleChange} 
                className="input input-bordered w-full" 
                placeholder="Xiaofeng Zhang"
              />
            </div>
            
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input 
                type="text" 
                name="title" 
                value={formData.title[activeLang]} 
                onChange={(e) => handleMultilingualChange(e, activeLang)} 
                className="input input-bordered w-full" 
                placeholder={activeLang === 'en' ? 'Software Developer' : 'Sviluppatore Software'}
              />
            </div>
            
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Tagline</span>
              </label>
              <input 
                type="text" 
                name="tagline" 
                value={formData.tagline[activeLang]} 
                onChange={(e) => handleMultilingualChange(e, activeLang)} 
                className="input input-bordered w-full" 
                placeholder={activeLang === 'en' ? 'REPEAT THEN CREATE.' : 'RIPETI POI CREA.'}
              />
            </div>
            
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea 
                name="bio" 
                value={formData.bio[activeLang]} 
                onChange={(e) => handleMultilingualChange(e, activeLang)} 
                className="textarea textarea-bordered w-full h-32" 
                placeholder={activeLang === 'en' 
                  ? 'Write your bio in English...' 
                  : 'Scrivi la tua biografia in italiano...'}
              ></textarea>
            </div>
            
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Avatar URL</span>
              </label>
              <input 
                type="text" 
                name="avatar" 
                value={formData.avatar} 
                onChange={handleChange} 
                className="input input-bordered w-full" 
                placeholder="https://avatars.githubusercontent.com/u/GigleGig"
                readOnly
              />
              <label className="label">
                <span className="label-text-alt">Use the avatar upload section above to change this</span>
              </label>
            </div>
            
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <input 
                type="text" 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                className="input input-bordered w-full" 
                placeholder="Bologna, Italy"
              />
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Programming Languages</span>
            </label>
            <textarea 
              value={formData.skills.programmingLanguages.join(', ')} 
              onChange={(e) => handleSkillsChange(e, 'programmingLanguages')} 
              className="textarea textarea-bordered w-full" 
              placeholder="C/C++, Python, Java, JavaScript"
            ></textarea>
            <label className="label">
              <span className="label-text-alt">Separate with commas</span>
            </label>
          </div>
          
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Frameworks</span>
            </label>
            <textarea 
              value={formData.skills.frameworks.join(', ')} 
              onChange={(e) => handleSkillsChange(e, 'frameworks')} 
              className="textarea textarea-bordered w-full" 
              placeholder="MVC, Spring, React, Vue"
            ></textarea>
            <label className="label">
              <span className="label-text-alt">Separate with commas</span>
            </label>
          </div>
          
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Databases</span>
            </label>
            <textarea 
              value={formData.skills.databases.join(', ')} 
              onChange={(e) => handleSkillsChange(e, 'databases')} 
              className="textarea textarea-bordered w-full" 
              placeholder="MySQL, SQL, SQLite, MongoDB"
            ></textarea>
            <label className="label">
              <span className="label-text-alt">Separate with commas</span>
            </label>
          </div>
          
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Tools</span>
            </label>
            <textarea 
              value={formData.skills.tools.join(', ')} 
              onChange={(e) => handleSkillsChange(e, 'tools')} 
              className="textarea textarea-bordered w-full" 
              placeholder="Git, Docker, TensorFlow"
            ></textarea>
            <label className="label">
              <span className="label-text-alt">Separate with commas</span>
            </label>
          </div>
          
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Web Development</span>
            </label>
            <textarea 
              value={formData.skills.webDevelopment.join(', ')} 
              onChange={(e) => handleSkillsChange(e, 'webDevelopment')} 
              className="textarea textarea-bordered w-full" 
              placeholder="HTML, CSS, JavaScript"
            ></textarea>
            <label className="label">
              <span className="label-text-alt">Separate with commas</span>
            </label>
          </div>
          
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">AI/ML</span>
            </label>
            <textarea 
              value={formData.skills.aiMl.join(', ')} 
              onChange={(e) => handleSkillsChange(e, 'aiMl')} 
              className="textarea textarea-bordered w-full" 
              placeholder="Neural Networks, Machine Learning Algorithms"
            ></textarea>
            <label className="label">
              <span className="label-text-alt">Separate with commas</span>
            </label>
          </div>
          
          <div className="form-control w-full mb-4 md:col-span-2">
            <label className="label">
              <span className="label-text">Other Skills</span>
            </label>
            <textarea 
              value={formData.skills.other.join(', ')} 
              onChange={(e) => handleSkillsChange(e, 'other')} 
              className="textarea textarea-bordered w-full" 
              placeholder="Other skills..."
            ></textarea>
            <label className="label">
              <span className="label-text-alt">Separate with commas</span>
            </label>
          </div>
        </div>
      )}
      
      {activeTab === 'languages' && (
        <div>
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-bold">Languages</h3>
            <button 
              type="button" 
              className="btn btn-sm btn-primary" 
              onClick={addLanguage}
            >
              Add Language
            </button>
          </div>
          
          {formData.languages.map((lang, index) => (
            <div key={index} className="card bg-base-100 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="card-title text-md mb-0">Language #{index + 1}</h4>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-error btn-outline" 
                    onClick={() => removeLanguage(index)}
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Language</span>
                    </label>
                    <input 
                      type="text" 
                      value={lang.language} 
                      onChange={(e) => handleLanguageChange(index, 'language', e.target.value)} 
                      className="input input-bordered w-full" 
                      placeholder="English"
                    />
                  </div>
                  
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Proficiency</span>
                    </label>
                    <select 
                      value={lang.proficiency} 
                      onChange={(e) => handleLanguageChange(index, 'proficiency', e.target.value)} 
                      className="select select-bordered w-full"
                    >
                      <option value="Native">Native</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Basic">Basic</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activeTab === 'social' && (
        <div>
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">GitHub</span>
            </label>
            <input 
              type="text" 
              name="github" 
              value={formData.social.github} 
              onChange={handleSocialChange} 
              className="input input-bordered w-full" 
              placeholder="https://github.com/GigleGig"
            />
          </div>
          
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Twitter/X</span>
            </label>
            <input 
              type="text" 
              name="twitter" 
              value={formData.social.twitter} 
              onChange={handleSocialChange} 
              className="input input-bordered w-full" 
              placeholder="https://x.com/hexaburden"
            />
          </div>
          
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">LinkedIn</span>
            </label>
            <input 
              type="text" 
              name="linkedin" 
              value={formData.social.linkedin} 
              onChange={handleSocialChange} 
              className="input input-bordered w-full" 
              placeholder="https://www.linkedin.com/in/xiaofeng-zhang-61a16b261/"
            />
          </div>
          
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input 
              type="email" 
              name="email" 
              value={formData.social.email} 
              onChange={handleSocialChange} 
              className="input input-bordered w-full" 
              placeholder="zxf19970424@gmail.com"
            />
          </div>
        </div>
      )}
      
      <div className="flex justify-end gap-4 mt-6">
        <button 
          type="button" 
          className="btn btn-outline" 
          onClick={() => navigate('/admin')}
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
            'Save Profile'
          )}
        </button>
      </div>
    </div>
  );
}

export default ProfileForm; 