import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add authorization header to requests when token is available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  // Traditional login (keep for backward compatibility)
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  
  // Request verification code
  requestVerificationCode: async (email) => {
    const response = await api.post('/users/request-code', { email });
    return response.data;
  },
  
  // Verify code and login
  verifyCodeAndLogin: async (email, code) => {
    const response = await api.post('/users/verify-code', { email, code });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  register: async (username, email, password) => {
    const response = await api.post('/users', { username, email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// Blog services
export const blogService = {
  getBlogs: async (page = 1, keyword = '') => {
    try {
      const response = await api.get(`/blogs?page=${page}&keyword=${keyword}`);
      
      // Ensure we handle the response properly
      if (response.data && (response.data.blogs || Array.isArray(response.data))) {
        return response;
      } else {
        console.warn('Unexpected blog response format:', response.data);
        // Return a normalized empty response
        return { data: { blogs: [], page: 1, pages: 0, totalBlogs: 0 } };
      }
    } catch (error) {
      console.error('Error in getBlogs API call:', error);
      // Return a normalized empty response on error
      return { data: { blogs: [], page: 1, pages: 0, totalBlogs: 0 } };
    }
  },
  getBlogById: async (id) => {
    return api.get(`/blogs/${id}`);
  },
  createBlog: async (blogData) => {
    return api.post('/blogs', blogData);
  },
  updateBlog: async (id, blogData) => {
    return api.put(`/blogs/${id}`, blogData);
  },
  deleteBlog: async (id) => {
    return api.delete(`/blogs/${id}`);
  }
};

// Project services
export const projectService = {
  getProjects: async (featured = false) => {
    return api.get(`/projects${featured ? '?featured=true' : ''}`);
  },
  getProjectById: async (id) => {
    return api.get(`/projects/${id}`);
  },
  createProject: async (projectData) => {
    return api.post('/projects', projectData);
  },
  updateProject: async (id, projectData) => {
    return api.put(`/projects/${id}`, projectData);
  },
  deleteProject: async (id) => {
    return api.delete(`/projects/${id}`);
  },
  importGithubProjects: async (username) => {
    return api.post('/projects/import-github', { username });
  }
};

// Profile services
export const profileService = {
  getProfile: async () => {
    return api.get('/profile');
  },
  updateProfile: async (profileData) => {
    return api.post('/profile', profileData);
  },
  addEducation: async (educationData) => {
    return api.put('/profile/education', educationData);
  },
  deleteEducation: async (id) => {
    return api.delete(`/profile/education/${id}`);
  },
  addExperience: async (experienceData) => {
    return api.put('/profile/experience', experienceData);
  },
  deleteExperience: async (id) => {
    return api.delete(`/profile/experience/${id}`);
  },
  addProjectExperience: async (projectData) => {
    return api.put('/profile/project', projectData);
  },
  deleteProjectExperience: async (id) => {
    return api.delete(`/profile/project/${id}`);
  }
};

export default api; 