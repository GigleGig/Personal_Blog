import Profile from '../models/profileModel.js';
import cloudinary from '../config/cloudinaryConfig.js';
import { promises as fs } from 'fs';

// @desc    Create or update profile
// @route   POST /api/profile
// @access  Private/Admin
export const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      fullName,
      title,
      bio,
      avatar,
      tagline,
      location,
      languages,
      skills,
      education,
      experience,
      projectExperience,
      social
    } = req.body;

    // Check if profile exists
    let profile = await Profile.findOne();

    if (profile) {
      // Update existing profile
      profile.fullName = fullName || profile.fullName;
      
      // Handle multilingual fields
      if (title) {
        profile.title.en = title.en !== undefined ? title.en : profile.title.en;
        profile.title.it = title.it !== undefined ? title.it : profile.title.it;
      }
      
      if (bio) {
        profile.bio.en = bio.en || profile.bio.en;
        profile.bio.it = bio.it !== undefined ? bio.it : profile.bio.it;
      }
      
      if (tagline) {
        profile.tagline.en = tagline.en !== undefined ? tagline.en : profile.tagline.en;
        profile.tagline.it = tagline.it !== undefined ? tagline.it : profile.tagline.it;
      }
      
      profile.avatar = avatar !== undefined ? avatar : profile.avatar;
      profile.location = location !== undefined ? location : profile.location;
      
      // Handle languages
      if (languages) {
        profile.languages = languages;
      }
      
      // Handle categorized skills
      if (skills) {
        // Update individual skill categories if provided
        if (skills.programmingLanguages) profile.skills.programmingLanguages = skills.programmingLanguages;
        if (skills.frameworks) profile.skills.frameworks = skills.frameworks;
        if (skills.databases) profile.skills.databases = skills.databases;
        if (skills.tools) profile.skills.tools = skills.tools;
        if (skills.webDevelopment) profile.skills.webDevelopment = skills.webDevelopment;
        if (skills.aiMl) profile.skills.aiMl = skills.aiMl;
        if (skills.other) profile.skills.other = skills.other;
      }
      
      if (education) {
        profile.education = education;
      }
      
      if (experience) {
        profile.experience = experience;
      }
      
      if (projectExperience) {
        profile.projectExperience = projectExperience;
      }
      
      if (social) {
        profile.social = {
          ...profile.social,
          ...social
        };
      }

      await profile.save();
      
      res.json(profile);
    } else {
      // Create new profile with defaults for multilingual fields
      const newProfile = await Profile.create({
        fullName,
        title: title || {
          en: 'Software Developer',
          it: 'Sviluppatore Software'
        },
        bio: bio || {
          en: 'Software developer with a passion for creating innovative solutions.',
          it: 'Sviluppatore di software con una passione per la creazione di soluzioni innovative.'
        },
        avatar,
        tagline: tagline || {
          en: 'REPEAT THEN CREATE.',
          it: 'RIPETI POI CREA.'
        },
        location,
        languages: languages || [
          { language: 'Mandarin', proficiency: 'Native' },
          { language: 'English', proficiency: 'Fluent' },
          { language: 'Italian', proficiency: 'Intermediate' }
        ],
        skills: skills || {
          programmingLanguages: ['C/C++', 'Python', 'Java', 'JavaScript'],
          frameworks: ['MVC', 'Spring', 'React', 'Vue'],
          databases: ['MySQL', 'SQL', 'SQLite', 'MongoDB'],
          tools: ['Git', 'Docker', 'TensorFlow'],
          webDevelopment: ['HTML', 'CSS', 'JavaScript'],
          aiMl: ['Neural Networks', 'Machine Learning Algorithms'],
          other: []
        },
        education: education || [],
        experience: experience || [],
        projectExperience: projectExperience || [],
        social: social || {
          github: 'https://github.com/GigleGig',
          twitter: 'https://x.com/hexaburden',
          linkedin: 'https://www.linkedin.com/in/xiaofeng-zhang-61a16b261/',
          email: 'zxf19970424@gmail.com'
        }
      });
      
      res.status(201).json(newProfile);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get profile
// @route   GET /api/profile
// @access  Public
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add education
// @route   PUT /api/profile/education
// @access  Private/Admin
export const addEducation = async (req, res) => {
  try {
    const {
      institution,
      degree,
      fieldOfStudy,
      from,
      to,
      current,
      description,
      location,
      thesis
    } = req.body;

    const profile = await Profile.findOne();
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    profile.education.unshift({
      institution,
      degree,
      fieldOfStudy,
      from,
      to,
      current,
      description,
      location,
      thesis
    });
    
    await profile.save();
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete education
// @route   DELETE /api/profile/education/:edu_id
// @access  Private/Admin
export const deleteEducation = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    // Get index to remove
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);
      
    if (removeIndex === -1) {
      return res.status(404).json({ message: 'Education not found' });
    }
    
    profile.education.splice(removeIndex, 1);
    
    await profile.save();
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add experience
// @route   PUT /api/profile/experience
// @access  Private/Admin
export const addExperience = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
      responsibilities,
      skills,
      type
    } = req.body;
    
    const profile = await Profile.findOne();
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    profile.experience.unshift({
      title,
      company,
      location,
      from,
      to,
      current,
      description,
      responsibilities,
      skills,
      type
    });
    
    await profile.save();
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete experience
// @route   DELETE /api/profile/experience/:exp_id
// @access  Private/Admin
export const deleteExperience = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    // Get index to remove
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);
      
    if (removeIndex === -1) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    
    profile.experience.splice(removeIndex, 1);
    
    await profile.save();
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add project experience
// @route   PUT /api/profile/project
// @access  Private/Admin
export const addProjectExperience = async (req, res) => {
  try {
    const {
      name,
      description,
      technologies,
      year,
      role,
      bullets,
      link,
      image
    } = req.body;
    
    const profile = await Profile.findOne();
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    profile.projectExperience.unshift({
      name,
      description,
      technologies,
      year,
      role,
      bullets,
      link,
      image
    });
    
    await profile.save();
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project experience
// @route   DELETE /api/profile/project/:proj_id
// @access  Private/Admin
export const deleteProjectExperience = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    // Get index to remove
    const removeIndex = profile.projectExperience
      .map(item => item.id)
      .indexOf(req.params.proj_id);
      
    if (removeIndex === -1) {
      return res.status(404).json({ message: 'Project experience not found' });
    }
    
    profile.projectExperience.splice(removeIndex, 1);
    
    await profile.save();
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload avatar image
// @route   POST /api/profile/avatar
// @access  Private/Admin
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'blog_avatars',
      transformation: [
        { width: 500, height: 500, crop: 'limit' },
        { quality: 'auto' }
      ]
    });
    
    // Delete local file after upload to Cloudinary
    await fs.unlink(req.file.path).catch(err => console.log('Error deleting local file:', err));
    
    // Get avatar URL from Cloudinary response
    const avatarUrl = result.secure_url;
    
    // Find the profile
    const profile = await Profile.findOne();
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    // Update the avatar URL
    profile.avatar = avatarUrl;
    
    // Save the updated profile
    await profile.save();
    
    res.json({ 
      message: 'Avatar uploaded successfully', 
      avatarUrl: avatarUrl 
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    // If there was a local file, try to delete it
    if (req.file && req.file.path) {
      await fs.unlink(req.file.path).catch(err => console.log('Error deleting local file:', err));
    }
    res.status(500).json({ message: error.message });
  }
}; 