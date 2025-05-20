import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { profileService } from '../../services/api';

function ProjectExperienceForm({ existingProject, onSave, onCancel }) {
  const navigate = useNavigate();
  const [activeLang, setActiveLang] = useState('en');
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: { en: '', it: '' },
    technologies: [],
    year: '',
    role: '',
    bullets: { en: [], it: [] },
    link: '',
    image: ''
  });
  
  // Initialize form with existing project data if provided
  useEffect(() => {
    if (existingProject) {
      setFormData({
        name: existingProject.name || '',
        description: existingProject.description || { en: '', it: '' },
        technologies: existingProject.technologies || [],
        year: existingProject.year || '',
        role: existingProject.role || '',
        bullets: existingProject.bullets || { en: [], it: [] },
        link: existingProject.link || '',
        image: existingProject.image || ''
      });
    }
  }, [existingProject]);
  
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
  
  // Handle technologies changes
  const handleTechnologiesChange = (e) => {
    const { value } = e.target;
    const techList = value.split(',').map(tech => tech.trim()).filter(tech => tech !== '');
    
    setFormData({
      ...formData,
      technologies: techList
    });
  };
  
  // Handle bullets changes
  const handleBulletsChange = (e, lang) => {
    const { value } = e.target;
    const bulletList = value.split('\n').map(bullet => bullet.trim()).filter(bullet => bullet !== '');
    
    setFormData({
      ...formData,
      bullets: {
        ...formData.bullets,
        [lang]: bulletList
      }
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // If an existing project was provided, this is an update
      if (existingProject) {
        // Handle update through parent component
        onSave(formData);
      } else {
        // Add new project experience to profile
        await profileService.addProjectExperience(formData);
        toast.success('Project experience added successfully');
      }
      
      // Call onSave callback if provided, or navigate back
      if (onSave) {
        onSave(formData);
      } else {
        navigate('/admin');
      }
    } catch (error) {
      console.error('Error saving project experience:', error);
      toast.error('Failed to save project experience');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-base-200 p-6 rounded-box shadow-lg">
      <h2 className="text-2xl font-bold mb-6">
        {existingProject ? 'Edit Project Experience' : 'Add Project Experience'}
      </h2>
      
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
          placeholder="Product Recognition & Classification"
        />
      </div>
      
      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">Role</span>
        </label>
        <input 
          type="text" 
          name="role" 
          value={formData.role} 
          onChange={handleChange} 
          className="input input-bordered w-full" 
          placeholder="Lead Developer"
        />
      </div>
      
      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">Year</span>
        </label>
        <input 
          type="text" 
          name="year" 
          value={formData.year} 
          onChange={handleChange} 
          className="input input-bordered w-full" 
          placeholder="2024"
        />
      </div>
      
      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">Technologies</span>
        </label>
        <textarea 
          value={formData.technologies.join(', ')} 
          onChange={handleTechnologiesChange} 
          className="textarea textarea-bordered w-full" 
          placeholder="TensorFlow, Keras, OpenCV"
        ></textarea>
        <label className="label">
          <span className="label-text-alt">Separate with commas</span>
        </label>
      </div>
      
      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">Project Link</span>
        </label>
        <input 
          type="text" 
          name="link" 
          value={formData.link} 
          onChange={handleChange} 
          className="input input-bordered w-full" 
          placeholder="https://github.com/GigleGig/project-name"
        />
      </div>
      
      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">Image URL</span>
        </label>
        <input 
          type="text" 
          name="image" 
          value={formData.image} 
          onChange={handleChange} 
          className="input input-bordered w-full" 
          placeholder="https://example.com/project-image.jpg"
        />
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
              <span className="label-text">Description</span>
            </label>
            <textarea 
              name="description" 
              value={formData.description[activeLang]} 
              onChange={(e) => handleMultilingualChange(e, activeLang)} 
              className="textarea textarea-bordered w-full h-24" 
              placeholder={activeLang === 'en' 
                ? 'Project description in English...' 
                : 'Descrizione del progetto in italiano...'}
            ></textarea>
          </div>
          
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Key Points (one per line)</span>
            </label>
            <textarea 
              value={formData.bullets[activeLang].join('\n')} 
              onChange={(e) => handleBulletsChange(e, activeLang)} 
              className="textarea textarea-bordered w-full h-32" 
              placeholder={activeLang === 'en' 
                ? '• Led the development of a machine learning model\n• Utilized TensorFlow, Keras, and OpenCV\n• Achieved high classification accuracy' 
                : '• Guidato lo sviluppo di un modello di machine learning\n• Utilizzato TensorFlow, Keras e OpenCV\n• Raggiunto alta precisione di classificazione'}
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
            'Save Project'
          )}
        </button>
      </div>
    </div>
  );
}

export default ProjectExperienceForm; 