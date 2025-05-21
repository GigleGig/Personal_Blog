import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { profileService } from '../../services/api';

function EducationForm({ existingEducation, onSave, onCancel }) {
  const navigate = useNavigate();
  const [activeLang, setActiveLang] = useState('en');
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    institution: '',
    degree: { en: '', it: '' },
    fieldOfStudy: { en: '', it: '' },
    location: '',
    from: '',
    to: '',
    current: false,
    description: { en: '', it: '' },
    thesis: {
      title: '',
      supervisor: '',
      mark: ''
    }
  });
  
  // Initialize form with existing education data if provided
  useEffect(() => {
    if (existingEducation) {
      const from = existingEducation.from ? new Date(existingEducation.from).toISOString().split('T')[0] : '';
      const to = existingEducation.to ? new Date(existingEducation.to).toISOString().split('T')[0] : '';
      
      setFormData({
        institution: existingEducation.institution || '',
        degree: existingEducation.degree || { en: '', it: '' },
        fieldOfStudy: existingEducation.fieldOfStudy || { en: '', it: '' },
        location: existingEducation.location || '',
        from: from,
        to: to,
        current: existingEducation.current || false,
        description: existingEducation.description || { en: '', it: '' },
        thesis: existingEducation.thesis || {
          title: '',
          supervisor: '',
          mark: ''
        }
      });
    }
  }, [existingEducation]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
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
  
  // Handle thesis field changes
  const handleThesisChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      thesis: {
        ...formData.thesis,
        [name]: value
      }
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Format dates for API
      const payload = {
        ...formData,
        from: formData.from ? new Date(formData.from) : null,
        to: formData.current ? null : (formData.to ? new Date(formData.to) : null)
      };
      
      // If an existing education was provided, this is an update
      if (existingEducation) {
        // Handle update through parent component
        onSave(payload);
      } else {
        // Add new education to profile
        await profileService.addEducation(payload);
        toast.success('Education added successfully');
      }
      
      // Call onSave callback if provided, or navigate back
      if (onSave) {
        onSave(payload);
      } else {
        navigate('/admin');
      }
    } catch (error) {
      console.error('Error saving education:', error);
      toast.error('Failed to save education');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-base-200 p-6 rounded-box shadow-lg">
      <h2 className="text-2xl font-bold mb-6">
        {existingEducation ? 'Edit Education' : 'Add Education'}
      </h2>
      
      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">Institution</span>
        </label>
        <input 
          type="text" 
          name="institution" 
          value={formData.institution} 
          onChange={handleChange} 
          className="input input-bordered w-full" 
          placeholder="University of Bologna (UNIBO)"
        />
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">From</span>
          </label>
          <input 
            type="date" 
            name="from" 
            value={formData.from} 
            onChange={handleChange} 
            className="input input-bordered w-full" 
          />
        </div>
        
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">To</span>
          </label>
          <input 
            type="date" 
            name="to" 
            value={formData.to} 
            onChange={handleChange} 
            className="input input-bordered w-full" 
            disabled={formData.current}
          />
        </div>
      </div>
      
      <div className="form-control w-full mb-6">
        <label className="label cursor-pointer justify-start gap-2">
          <input 
            type="checkbox" 
            name="current" 
            checked={formData.current} 
            onChange={handleChange} 
            className="checkbox checkbox-primary" 
          />
          <span className="label-text">I am currently studying here</span>
        </label>
      </div>
      
      <div className="divider">Thesis Information (Optional)</div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Thesis Title</span>
          </label>
          <input 
            type="text" 
            name="title" 
            value={formData.thesis.title} 
            onChange={handleThesisChange} 
            className="input input-bordered w-full" 
            placeholder="Machine Learning Applications in Healthcare"
          />
        </div>
        
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Supervisor</span>
          </label>
          <input 
            type="text" 
            name="supervisor" 
            value={formData.thesis.supervisor} 
            onChange={handleThesisChange} 
            className="input input-bordered w-full" 
            placeholder="Prof. Example Name"
          />
        </div>
        
        <div className="form-control w-full md:col-span-2">
          <label className="label">
            <span className="label-text">Final Mark</span>
          </label>
          <input 
            type="text" 
            name="mark" 
            value={formData.thesis.mark} 
            onChange={handleThesisChange} 
            className="input input-bordered w-full" 
            placeholder="110/110 with honors"
          />
        </div>
      </div>
      
      {/* Multilingual content */}
      <div className="mb-6">
        <div className="tabs mb-2">
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
              <span className="label-text">Degree</span>
            </label>
            <input 
              type="text" 
              name="degree" 
              value={formData.degree[activeLang]} 
              onChange={(e) => handleMultilingualChange(e, activeLang)} 
              className="input input-bordered w-full" 
              placeholder={activeLang === 'en' ? 'Computer Science' : 'Informatica'}
            />
          </div>
          
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Field of Study</span>
            </label>
            <input 
              type="text" 
              name="fieldOfStudy" 
              value={formData.fieldOfStudy[activeLang]} 
              onChange={(e) => handleMultilingualChange(e, activeLang)} 
              className="input input-bordered w-full" 
              placeholder={activeLang === 'en' ? 'Artificial Intelligence' : 'Intelligenza Artificiale'}
            />
          </div>
          
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea 
              name="description" 
              value={formData.description[activeLang]} 
              onChange={(e) => handleMultilingualChange(e, activeLang)} 
              className="textarea textarea-bordered w-full h-32" 
              style={{ whiteSpace: 'pre-wrap' }}
              placeholder={activeLang === 'en' 
                ? 'Focus on AI, machine learning, and software engineering...' 
                : 'Focus su IA, machine learning e ingegneria del software...'}
            ></textarea>
          </div>
        </div>
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
            'Save Education'
          )}
        </button>
      </div>
    </div>
  );
}

export default EducationForm; 