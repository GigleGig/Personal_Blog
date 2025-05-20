import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  // Basic profile info with multilingual support
  fullName: {
    type: String,
    required: true
  },
  title: {
    en: {
      type: String,
      default: 'Software Developer'
    },
    it: {
      type: String,
      default: 'Sviluppatore Software'
    }
  },
  bio: {
    en: {
      type: String,
      required: true
    },
    it: {
      type: String,
      default: ''
    }
  },
  avatar: {
    type: String,
    default: ''
  },
  tagline: {
    en: {
      type: String,
      default: ''
    },
    it: {
      type: String,
      default: ''
    }
  },
  location: {
    type: String,
    default: ''
  },
  // Languages spoken
  languages: [{
    language: String,
    proficiency: {
      type: String,
      enum: ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'],
      default: 'Intermediate'
    }
  }],
  // Technical skills with categories
  skills: {
    programmingLanguages: {
      type: [String],
      default: []
    },
    frameworks: {
      type: [String],
      default: []
    },
    databases: {
      type: [String],
      default: []
    },
    tools: {
      type: [String],
      default: []
    },
    webDevelopment: {
      type: [String],
      default: []
    },
    aiMl: {
      type: [String],
      default: []
    },
    other: {
      type: [String],
      default: []
    }
  },
  // Education with multilingual support
  education: [{
    institution: String,
    degree: {
      en: String,
      it: String
    },
    fieldOfStudy: {
      en: String,
      it: String
    },
    from: Date,
    to: Date,
    current: Boolean,
    description: {
      en: String,
      it: String
    },
    location: String,
    thesis: {
      title: String,
      supervisor: String,
      mark: String
    }
  }],
  // Professional experience with multilingual support
  experience: [{
    title: {
      en: String,
      it: String
    },
    company: String,
    location: String,
    from: Date,
    to: Date,
    current: Boolean,
    description: {
      en: String,
      it: String
    },
    responsibilities: {
      en: [String],
      it: [String]
    },
    skills: [String],
    type: {
      type: String,
      enum: ['Internship', 'Full-time', 'Part-time', 'Freelance', 'Contract'],
      default: 'Full-time'
    }
  }],
  // Project experience with multilingual support
  projectExperience: [{
    name: String,
    description: {
      en: String,
      it: String
    },
    technologies: [String],
    year: String,
    role: String,
    bullets: {
      en: [String],
      it: [String]
    },
    link: String,
    image: String
  }],
  social: {
    github: {
      type: String,
      default: 'https://github.com/GigleGig'
    },
    twitter: {
      type: String,
      default: 'https://x.com/hexaburden'
    },
    linkedin: {
      type: String,
      default: 'https://www.linkedin.com/in/xiaofeng-zhang-61a16b261/'
    },
    email: {
      type: String,
      default: 'zxf19970424@gmail.com'
    }
  }
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile; 