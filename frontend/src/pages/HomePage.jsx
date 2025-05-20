import React, { useState, useEffect } from 'react'
import GuideBar from './GuideBar'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { blogService, projectService, profileService } from '../services/api'

function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch blogs
        try {
          const blogsRes = await blogService.getBlogs(1);
          console.log('Blog response:', blogsRes.data);
          
          // Careful handling of blog data
          if (blogsRes.data && blogsRes.data.blogs && Array.isArray(blogsRes.data.blogs)) {
            setBlogs(blogsRes.data.blogs);
          } else if (blogsRes.data && Array.isArray(blogsRes.data)) {
            setBlogs(blogsRes.data);
          } else {
            console.error('Unexpected blog data structure:', blogsRes.data);
            setBlogs([]);
          }
        } catch (error) {
          console.error('Error fetching blogs:', error);
          setBlogs([]);
        }
        
        // Fetch featured projects - with random selection from backend
        try {
          const timestamp = new Date().getTime(); // Add cache busting
          const projectsRes = await projectService.getProjects(true);
          console.log('Projects response:', projectsRes.data);
          setFeaturedProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
        } catch (error) {
          console.error('Error fetching projects:', error);
          setFeaturedProjects([]);
        }
        
        // Fetch profile
        try {
          const profileRes = await profileService.getProfile();
          console.log('Profile response:', profileRes.data);
          setProfile(profileRes.data || null);
        } catch (error) {
          console.error('Error fetching profile:', error);
          setProfile(null);
        }
      } catch (error) {
        console.error('Error in main fetchData try block:', error);
        setError('Failed to load some data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <GuideBar />
      
      <div className="hero min-h-[80vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome to My Blog</h1>
            <p className="py-6">
              {profile ? (profile.tagline?.en || profile.tagline) : "I'm Xiaofeng Zhang (GigleGig), a passionate developer sharing my journey, projects, and technical insights."}
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/projects" className="btn btn-primary">View My Projects</Link>
              <Link to="/about" className="btn btn-ghost">About Me</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Latest Blog Posts</h2>
        
        {loading ? (
          <div className="flex justify-center my-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : error ? (
          <div className="alert alert-warning max-w-lg mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        ) : blogs.length === 0 ? (
          <div className="alert alert-info max-w-lg mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>No blog posts available yet. Check back soon!</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(blogs) && blogs.map((blog) => {
              // Extra safety check for each blog item
              if (!blog || !blog._id) {
                return null;
              }
              
              return (
                <div key={blog._id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title">{blog.title || 'No Title'}</h2>
                    <p>{blog.summary || 'No summary available'}</p>
                    <div className="card-actions justify-end">
                      <Link to={`/blog/${blog._id}`} className="btn btn-sm btn-primary">Read More</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Featured Projects Section */}
        {featuredProjects.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <div key={project._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                  {project.imageUrl && (
                    <figure className="px-6 pt-6">
                      <img src={project.imageUrl} alt={project.name} className="rounded-xl h-48 w-full object-cover" />
                    </figure>
                  )}
                  <div className="card-body">
                    <h2 className="card-title">{project.name}</h2>
                    <p>{project.description}</p>
                    <div className="flex flex-wrap gap-2 my-2">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="badge badge-outline">{tech}</span>
                      ))}
                    </div>
                    <div className="card-actions justify-end">
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                        View on GitHub
                      </a>
                      {project.demoUrl && (
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline">
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
        <div className="grid grid-flow-col gap-4">
          <Link to="/about" className="link link-hover">About</Link>
          <Link to="/projects" className="link link-hover">Projects</Link>
          <a href="mailto:zxf19970424@gmail.com" className="link link-hover">Contact</a>
        </div>
        <div>
          <div className="grid grid-flow-col gap-4">
            <a href="https://github.com/GigleGig" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://x.com/hexaburden" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/xiaofeng-zhang-61a16b261/" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>
        <div>
          <p>© 2024 Xiaofeng Zhang - All rights reserved</p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage