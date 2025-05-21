import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import Blog from './models/blogModel.js';
import Project from './models/projectModel.js';
import Profile from './models/profileModel.js';

dotenv.config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

// Default profile data
const defaultProfile = {
  fullName: 'Xiaofeng Zhang',
  title: { en: 'Software Developer', it: 'Sviluppatore Software' },
  tagline: { en: 'REPEAT THEN CREATE.', it: 'RIPETI POI CREA.' },
  bio: { 
    en: "I'm a passionate developer focused on building innovative solutions and exploring new technologies. My journey in software development has been driven by curiosity and the desire to create meaningful applications.", 
    it: "Sono uno sviluppatore appassionato, concentrato sulla creazione di soluzioni innovative e sull'esplorazione di nuove tecnologie. Il mio percorso nello sviluppo software è stato guidato dalla curiosità e dal desiderio di creare applicazioni significative."
  },
  skills: {
    programmingLanguages: ['C/C++', 'Python', 'Java', 'JavaScript'],
    frameworks: ['MVC', 'Spring', 'React', 'Vue'],
    databases: ['MySQL', 'SQL', 'SQLite', 'MongoDB'],
    tools: ['Git', 'Docker', 'TensorFlow'],
    webDevelopment: ['HTML', 'CSS', 'JavaScript'],
    aiMl: ['Neural Networks', 'Machine Learning Algorithms']
  },
  languages: [
    { language: 'Mandarin', proficiency: 'Native' },
    { language: 'English', proficiency: 'Fluent' },
    { language: 'Italian', proficiency: 'Intermediate' }
  ],
  education: [
    {
      institution: 'University of Bologna (UNIBO)',
      degree: { en: 'Computer Science', it: 'Informatica' },
      location: 'Bologna, Italy'
    }
  ],
  projectExperience: [
    {
      name: 'Product Recognition & Classification',
      description: { 
        en: 'Machine learning model for food product classification.',
        it: 'Modello di apprendimento automatico per la classificazione dei prodotti alimentari.' 
      },
      technologies: ['TensorFlow', 'Keras', 'OpenCV'],
      year: '2024',
      bullets: {
        en: [
          'Led the development of a machine learning model for food product classification',
          'Utilized TensorFlow, Keras, and OpenCV for training CNN-based models',
          'Achieved high classification accuracy through data augmentation and feature engineering'
        ],
        it: [
          'Guidato lo sviluppo di un modello di machine learning per la classificazione dei prodotti alimentari',
          'Utilizzato TensorFlow, Keras e OpenCV per addestrare modelli basati su CNN',
          'Raggiunto alta precisione di classificazione grazie all\'aumento dei dati e all\'ingegneria delle caratteristiche'
        ]
      }
    }
  ],
  experience: [
    {
      title: { en: 'Game Developer (Internship)', it: 'Sviluppatore di Giochi (Stage)' },
      company: 'Beijing Fangshan Game Company',
      location: 'China',
      from: new Date('2019-01-01'),
      to: new Date('2020-01-01'),
      description: { 
        en: 'Developed and optimized gameplay mechanics using Cocos2d-X and C++.',
        it: 'Sviluppato e ottimizzato meccaniche di gioco utilizzando Cocos2d-X e C++.' 
      },
      responsibilities: {
        en: [
          'Developed and optimized gameplay mechanics using Cocos2d-X and C++',
          'Collaborated with a team to design new game features and debug existing ones',
          'Conducted user testing and provided feedback for improving player experience'
        ],
        it: [
          'Sviluppato e ottimizzato meccaniche di gioco utilizzando Cocos2d-X e C++',
          'Collaborato con un team per progettare nuove funzionalità e risolvere bug esistenti',
          'Condotto test utente e fornito feedback per migliorare l\'esperienza di gioco'
        ]
      }
    }
  ],
  social: {
    github: 'https://github.com/GigleGig',
    twitter: 'https://x.com/hexaburden',
    linkedin: 'https://www.linkedin.com/in/xiaofeng-zhang-61a16b261/',
    email: 'zxf19970424@gmail.com'
  }
};

// Sample blog posts
const defaultBlogs = [
  {
    title: 'Getting Started with React',
    content: '# Getting Started with React\n\nReact is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications.\n\nHere\'s a simple React component:\n\n```jsx\nfunction HelloWorld() {\n  return <h1>Hello, world!</h1>;\n}\n```',
    summary: 'An introduction to React and its core concepts',
    author: 'Xiaofeng Zhang',
    tags: ['React', 'JavaScript', 'Frontend'],
    published: true,
    featured: true
  },
  {
    title: 'Understanding MongoDB',
    content: '# Understanding MongoDB\n\nMongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.\n\nHere\'s how to connect to MongoDB using Node.js:\n\n```javascript\nconst { MongoClient } = require("mongodb");\nconst uri = "mongodb://localhost:27017";\nconst client = new MongoClient(uri);\n\nasync function run() {\n  try {\n    await client.connect();\n    const database = client.db("sample_mflix");\n    const movies = database.collection("movies");\n    // Query for a movie that has the title "Back to the Future"\n    const query = { title: "Back to the Future" };\n    const movie = await movies.findOne(query);\n    console.log(movie);\n  } finally {\n    // Ensures that the client will close when you finish/error\n    await client.close();\n  }\n}\nrun().catch(console.dir);\n```',
    summary: 'Learn about MongoDB and how to use it with Node.js',
    author: 'Xiaofeng Zhang',
    tags: ['MongoDB', 'Database', 'Backend'],
    published: true
  }
];

// Sample projects
const defaultProjects = [
  {
    name: 'Personal Blog',
    description: 'A full-stack blogging platform built with React, Express, and MongoDB.',
    imageUrl: 'https://placehold.co/600x400?text=Blog+Project',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'TailwindCSS'],
    repoUrl: 'https://github.com/GigleGig/blog',
    demoUrl: 'https://blog.xiaofengzhang.com',
    featured: true
  },
  {
    name: 'E-commerce API',
    description: 'A RESTful API for e-commerce applications with user authentication and product management.',
    imageUrl: 'https://placehold.co/600x400?text=E-commerce+API',
    technologies: ['Node.js', 'Express', 'MongoDB', 'JWT Authentication'],
    repoUrl: 'https://github.com/GigleGig/ecommerce-api',
    featured: false
  }
];

// Seed database function
const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if profile exists
    const existingProfile = await Profile.findOne();
    if (!existingProfile) {
      await Profile.create(defaultProfile);
      console.log('Default profile created!');
    } else {
      console.log('Profile already exists, skipping...');
    }

    // Check if blogs exist
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      // Find admin user to use as author
      const adminUser = await User.findOne({ email: 'admin@example.com' });
      
      if (adminUser) {
        // Update blog posts with the admin user ID
        const blogsWithAuthor = defaultBlogs.map(blog => ({
          ...blog,
          author: adminUser._id
        }));
        
        await Blog.insertMany(blogsWithAuthor);
        console.log('Default blogs created!');
      } else {
        console.log('Admin user not found, skipping blog creation.');
      }
    } else {
      console.log('Blogs already exist, skipping...');
    }

    // Check if projects exist
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany(defaultProjects);
      console.log('Default projects created!');
    } else {
      // Delete existing projects and add the new ones
      await Project.deleteMany({});
      await Project.insertMany(defaultProjects);
      console.log('Projects updated!');
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seed function
seedDatabase(); 
