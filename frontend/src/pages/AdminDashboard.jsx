import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { blogService, projectService, profileService } from '../services/api';
import GuideBar from './GuideBar';

function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || 'blogs'
  );
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [githubProjects, setGithubProjects] = useState([]);
  const [showGithubPreview, setShowGithubPreview] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  
  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      navigate('/login');
      toast.error('You must be an admin to access this page');
    }
    
    // Fetch initial data
    fetchData();
  }, [isAdmin, navigate]);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch blogs
      const blogsRes = await blogService.getBlogs();
      setBlogs(blogsRes.data.blogs || []);
      
      // Fetch projects
      const projectsRes = await projectService.getProjects();
      setProjects(projectsRes.data || []);
      
      // Fetch profile
      const profileRes = await profileService.getProfile();
      setProfile(profileRes.data || null);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };
  
  const handleImportGithub = async () => {
    try {
      setGithubLoading(true);
      setShowGithubPreview(true);
      
      // Get GitHub projects preview without importing
      const response = await projectService.fetchAndPreviewGithubProjects('GigleGig');
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setGithubProjects(response.data);
        toast.success(`Found ${response.data.length} GitHub projects`);
      } else {
        setGithubProjects([]);
        toast.error('No GitHub projects found or GitHub API rate limit exceeded');
      }
    } catch (error) {
      console.error('Error fetching GitHub projects:', error);
      setGithubProjects([]);
      
      // Provide more specific error information
      if (error.response?.status === 403) {
        toast.error('GitHub API rate limit exceeded. Try again later.');
      } else if (error.response?.status === 404) {
        toast.error('GitHub username not found');
      } else {
        toast.error('Failed to fetch GitHub projects');
      }
    } finally {
      setGithubLoading(false);
    }
  };
  
  const handleSaveGithubProject = async (project) => {
    try {
      // Convert GitHub project format to our project format
      const projectData = {
        name: project.name,
        description: project.description || '',
        technologies: project.topics || [],
        featured: false,
        repoUrl: project.html_url,
        image: project.owner?.avatar_url || '',
        // Add more project experience properties
        year: new Date(project.created_at).getFullYear().toString(),
        role: 'Developer',
        bullets: { en: [], it: [] }
      };
      
      // Check if a project with the same name already exists in projectExperience
      if (profile && profile.projectExperience) {
        const existingProject = profile.projectExperience.find(
          p => p.name.toLowerCase() === project.name.toLowerCase()
        );
        
        if (existingProject) {
          toast.error(`A project named "${project.name}" already exists in Project Experience. Please rename before importing.`);
          return;
        }
      }
      
      // Save directly as project experience instead of project
      await profileService.addProjectExperience(projectData);
      toast.success(`Project "${project.name}" saved as experience`);
      fetchData(); // Refresh project list
    } catch (error) {
      console.error('Error saving GitHub project:', error);
      toast.error(`Failed to save project "${project.name}"`);
    }
  };
  
  const handleEditGithubProject = (project) => {
    // Convert GitHub project to our format and navigate to edit page
    const projectData = {
      name: project.name,
      description: project.description || '',
      technologies: project.topics || project.language ? [project.language] : [],
      repoUrl: project.html_url,
      image: '',
      // Add more project experience properties
      year: new Date(project.created_at).getFullYear().toString(),
      role: 'Developer',
      bullets: { en: [], it: [] }
    };
    
    // Store project data in sessionStorage
    sessionStorage.setItem('github_project_edit', JSON.stringify(projectData));
    navigate('/admin/project/new', { state: { fromGithub: true } });
  };
  
  return (
    <div className="min-h-screen bg-base-100">
      <GuideBar />
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button className="btn btn-outline" onClick={handleImportGithub}>
              Import GitHub Projects
            </button>
            <button className="btn btn-error" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        
        {/* GitHub project preview dialog */}
        {showGithubPreview && (
          <div className="bg-base-200 p-6 rounded-box shadow-lg mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">GitHub Projects Preview</h2>
              <button 
                className="btn btn-sm btn-ghost"
                onClick={() => setShowGithubPreview(false)}
              >
                Close
              </button>
            </div>
            
            {githubLoading ? (
              <div className="flex justify-center my-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <>
                {githubProjects.length === 0 ? (
                  <div className="alert">No GitHub projects found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Language</th>
                          <th>Stars</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {githubProjects.map(project => (
                          <tr key={project.id}>
                            <td>{project.name}</td>
                            <td>{project.description || 'No description'}</td>
                            <td>{project.language || 'N/A'}</td>
                            <td>{project.stargazers_count}</td>
                            <td className="flex gap-2">
                              <button 
                                className="btn btn-sm btn-primary"
                                onClick={() => handleSaveGithubProject(project)}
                              >
                                Save
                              </button>
                              <button 
                                className="btn btn-sm btn-info"
                                onClick={() => handleEditGithubProject(project)}
                              >
                                Edit First
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        
        <div className="tabs tabs-boxed mb-6">
          <button 
            className={`tab ${activeTab === 'blogs' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('blogs')}
          >
            Blogs
          </button>
          <button 
            className={`tab ${activeTab === 'projects' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button 
            className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`tab ${activeTab === 'experiences' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('experiences')}
          >
            Experiences
          </button>
          <button 
            className={`tab ${activeTab === 'education' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('education')}
          >
            Education
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center my-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="bg-base-200 p-6 rounded-box shadow-lg">
            {activeTab === 'blogs' && (
              <div>
                <div className="flex justify-between mb-4">
                  <h2 className="text-2xl font-bold">Blog Posts</h2>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/blog/new')}>
                    Add New Blog
                  </button>
                </div>
                
                {blogs.length === 0 ? (
                  <div className="alert">No blog posts found. Create your first post!</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Created</th>
                          <th>Published</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blogs.map(blog => (
                          <tr key={blog._id}>
                            <td>{blog.title}</td>
                            <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                            <td>
                              <div className={`badge ${blog.published ? 'badge-success' : 'badge-warning'}`}>
                                {blog.published ? 'Published' : 'Draft'}
                              </div>
                            </td>
                            <td className="flex gap-2">
                              <button 
                                className="btn btn-sm btn-info"
                                onClick={() => navigate(`/admin/blog/edit/${blog._id}`)}
                              >
                                Edit
                              </button>
                              <button 
                                className="btn btn-sm btn-error"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this blog?')) {
                                    blogService.deleteBlog(blog._id)
                                      .then(() => {
                                        toast.success('Blog deleted successfully');
                                        fetchData();
                                      })
                                      .catch(err => {
                                        console.error(err);
                                        toast.error('Failed to delete blog');
                                      });
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'projects' && (
              <div>
                <div className="flex justify-between mb-4">
                  <h2 className="text-2xl font-bold">Projects</h2>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/project-model/new')}>
                    Add New Project
                  </button>
                </div>
                
                {projects.length === 0 ? (
                  <div className="alert">No projects found. Create your first project!</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Technologies</th>
                          <th>Featured</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map(project => (
                          <tr key={project._id}>
                            <td>{project.name}</td>
                            <td>{project.technologies.join(', ')}</td>
                            <td>
                              <div className={`badge ${project.featured ? 'badge-success' : 'badge-ghost'}`}>
                                {project.featured ? 'Featured' : 'Not Featured'}
                              </div>
                            </td>
                            <td className="flex gap-2">
                              <button 
                                className="btn btn-sm btn-info"
                                onClick={() => navigate(`/admin/project-model/edit/${project._id}`)}
                              >
                                Edit
                              </button>
                              <button 
                                className="btn btn-sm btn-error"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this project?')) {
                                    projectService.deleteProject(project._id)
                                      .then(() => {
                                        toast.success('Project deleted successfully');
                                        fetchData();
                                      })
                                      .catch(err => {
                                        console.error(err);
                                        toast.error('Failed to delete project');
                                      });
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between mb-4">
                  <h2 className="text-2xl font-bold">Profile</h2>
                  {profile ? (
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate('/admin/profile/edit')}
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate('/admin/profile/new')}
                    >
                      Create Profile
                    </button>
                  )}
                </div>
                
                {!profile ? (
                  <div className="alert">No profile found. Create your profile!</div>
                ) : (
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="avatar">
                          <div className="w-32 rounded-full">
                            <img src={profile.avatar || 'https://avatars.githubusercontent.com/u/GigleGig'} alt={profile.fullName} />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{profile.fullName}</h3>
                          <p className="text-lg opacity-80">{profile.title?.en || profile.title}</p>
                          <p className="mt-2">{profile.tagline?.en || profile.tagline}</p>
                          <div className="mt-4">
                            <h4 className="font-bold">Languages:</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {profile.languages && profile.languages.map((lang, index) => (
                                <span key={index} className="badge gap-1">
                                  {lang.language} <span className="badge badge-sm">{lang.proficiency}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="mt-4">
                            <h4 className="font-bold">Skills:</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {profile.skills && typeof profile.skills === 'object' && !Array.isArray(profile.skills) ? (
                                // New structure (categories)
                                Object.entries(profile.skills).flatMap(([category, skills]) => 
                                  Array.isArray(skills) ? skills.map((skill, index) => (
                                    <span key={`${category}-${index}`} className="badge badge-primary">{skill}</span>
                                  )) : []
                                )
                              ) : (
                                // Old structure (array)
                                Array.isArray(profile.skills) && profile.skills.map((skill, index) => (
                                  <span key={index} className="badge badge-primary">{skill}</span>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'experiences' && (
              <div>
                <div className="flex justify-between mb-4">
                  <h2 className="text-2xl font-bold">Project Experiences</h2>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate('/admin/project/new')}
                  >
                    Add Project Experience
                  </button>
                </div>
                
                {!profile || !profile.projectExperience || profile.projectExperience.length === 0 ? (
                  <div className="alert">No project experiences found. Add your first project experience!</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Year</th>
                          <th>Technologies</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profile.projectExperience.map(project => (
                          <tr key={project._id}>
                            <td>{project.name}</td>
                            <td>{project.year}</td>
                            <td>{project.technologies?.join(', ')}</td>
                            <td className="flex gap-2">
                              <button 
                                className="btn btn-sm btn-info"
                                onClick={() => navigate(`/admin/project/edit/${project._id}`)}
                              >
                                Edit
                              </button>
                              <button 
                                className="btn btn-sm btn-error"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this project experience?')) {
                                    profileService.deleteProjectExperience(project._id)
                                      .then(() => {
                                        toast.success('Project experience deleted successfully');
                                        fetchData();
                                      })
                                      .catch(err => {
                                        console.error(err);
                                        toast.error('Failed to delete project experience');
                                      });
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'education' && (
              <div>
                <div className="flex justify-between mb-4">
                  <h2 className="text-2xl font-bold">Education</h2>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate('/admin/education/new')}
                  >
                    Add Education
                  </button>
                </div>
                
                {!profile || !profile.education || profile.education.length === 0 ? (
                  <div className="alert">No education records found. Add your educational background!</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Institution</th>
                          <th>Degree</th>
                          <th>Location</th>
                          <th>Period</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profile.education.map(edu => (
                          <tr key={edu._id}>
                            <td>{edu.institution}</td>
                            <td>{edu.degree?.en || ''}</td>
                            <td>{edu.location}</td>
                            <td>
                              {edu.from ? new Date(edu.from).getFullYear() : ''} - {edu.current ? 'Present' : (edu.to ? new Date(edu.to).getFullYear() : '')}
                            </td>
                            <td className="flex gap-2">
                              <button 
                                className="btn btn-sm btn-info"
                                onClick={() => navigate(`/admin/education/edit/${edu._id}`)}
                              >
                                Edit
                              </button>
                              <button 
                                className="btn btn-sm btn-error"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this education record?')) {
                                    profileService.deleteEducation(edu._id)
                                      .then(() => {
                                        toast.success('Education record deleted successfully');
                                        fetchData();
                                      })
                                      .catch(err => {
                                        console.error(err);
                                        toast.error('Failed to delete education record');
                                      });
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard; 