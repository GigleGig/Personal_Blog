import React, { useState, useEffect } from 'react'
import GuideBar from './GuideBar'
import { motion } from 'framer-motion'
import { projectService } from '../services/api'

function ProjectShow() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectService.getProjects();
        setProjects(response.data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch projects from server');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on search term
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (project.technologies && project.technologies.some(tech => 
      tech.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
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
      <motion.div 
        className="container mx-auto p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-4xl font-bold text-center mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          My Projects
        </motion.h1>
        
        <motion.p 
          className="text-center mb-8 max-w-3xl mx-auto"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
        >
          Here are the projects I've been working on. You can explore my GitHub repositories and see what I've built.
        </motion.p>
        
        <motion.div 
          className="form-control mb-8 max-w-md mx-auto"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
        >
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="input input-bordered w-full" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-square">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </motion.div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>
              {searchTerm 
                ? `No projects found matching "${searchTerm}". Try a different search term.` 
                : 'No projects found.'}
            </span>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProjects.map(project => (
              <motion.div 
                key={project._id || project.id} 
                className="card bg-base-200 shadow-xl"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
              >
                {project.imageUrl && (
                  <figure>
                    <img src={project.imageUrl} alt={project.name} className="w-full h-48 object-cover" />
                  </figure>
                )}
                <div className="card-body">
                  <h2 className="card-title">
                    {project.name}
                    {project.featured && <div className="badge badge-secondary">Featured</div>}
                    {project.fork && <div className="badge badge-outline">Fork</div>}
                  </h2>
                  <p>{project.description || 'No description available'}</p>
                  <div className="mt-2">
                    {project.technologies && project.technologies.map((tech, index) => (
                      <div key={index} className="badge badge-primary mr-2 mb-2">{tech}</div>
                    ))}
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <a 
                      href={project.repoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-primary btn-sm"
                    >
                      View on GitHub
                    </a>
                    {project.demoUrl && (
                      <a 
                        href={project.demoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-outline btn-sm"
                      >
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default ProjectShow