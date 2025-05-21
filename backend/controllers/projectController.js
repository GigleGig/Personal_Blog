import Project from '../models/projectModel.js';

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res) => {
  try {
    const { name, description, repoUrl, demoUrl, imageUrl, technologies, featured, order } = req.body;

    const project = await Project.create({
      name,
      description,
      repoUrl,
      demoUrl,
      imageUrl,
      technologies: technologies || [],
      featured: featured || false,
      order: order || 0
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const featured = req.query.featured === 'true';
    
    if (featured) {
      // Get all projects first
      const allProjects = await Project.find({}).sort({ createdAt: -1 });
      
      // If we have fewer than 2 projects, return all of them
      if (allProjects.length <= 2) {
        return res.json(allProjects);
      }
      
      // Otherwise, randomly select 2 projects
      const randomProjects = [];
      const usedIndices = new Set();
      
      // Try to get 2 random projects
      while (randomProjects.length < 2 && randomProjects.length < allProjects.length) {
        const randomIndex = Math.floor(Math.random() * allProjects.length);
        
        // Make sure we don't pick the same project twice
        if (!usedIndices.has(randomIndex)) {
          usedIndices.add(randomIndex);
          randomProjects.push(allProjects[randomIndex]);
        }
      }
      
      return res.json(randomProjects);
    } else {
      // Regular project list
      const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
      return res.json(projects);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res) => {
  try {
    const { name, description, repoUrl, demoUrl, imageUrl, technologies, featured, order } = req.body;

    const project = await Project.findById(req.params.id);

    if (project) {
      project.name = name || project.name;
      project.description = description || project.description;
      project.repoUrl = repoUrl || project.repoUrl;
      project.demoUrl = demoUrl !== undefined ? demoUrl : project.demoUrl;
      project.imageUrl = imageUrl !== undefined ? imageUrl : project.imageUrl;
      project.technologies = technologies || project.technologies;
      project.featured = featured !== undefined ? featured : project.featured;
      project.order = order !== undefined ? order : project.order;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await Project.deleteOne({ _id: project._id });
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Import projects from GitHub
// @route   POST /api/projects/import-github
// @access  Private/Admin
export const importGithubProjects = async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ message: 'GitHub username is required' });
    }
    
    // Use GitHub token from environment variables for authentication
    const githubToken = process.env.GITHUB_TOKEN;
    
    if (!githubToken) {
      return res.status(500).json({ message: 'GitHub token not configured on server' });
    }
    
    const headers = {
      'Authorization': `token ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json'
    };
    
    const response = await fetch(`https://api.github.com/users/${username}/repos`, { headers });
    
    if (!response.ok) {
      return res.status(400).json({ 
        message: 'Failed to fetch GitHub repositories',
        error: await response.text()
      });
    }
    
    const repos = await response.json();
    
    const createdProjects = [];
    
    for (const repo of repos) {
      // Skip forked repositories
      if (repo.fork) continue;
      
      const existingProject = await Project.findOne({ repoUrl: repo.html_url });
      
      if (!existingProject) {
        // Fetch additional repository details with token
        const detailsResponse = await fetch(repo.url, { headers });
        const details = await detailsResponse.json();
        
        // Get languages used in the repository
        const languagesResponse = await fetch(repo.languages_url, { headers });
        const languages = await languagesResponse.json();
        
        const newProject = await Project.create({
          name: repo.name,
          description: repo.description || 'No description available',
          repoUrl: repo.html_url,
          demoUrl: repo.homepage || '',
          technologies: Object.keys(languages),
          featured: false,
          order: 0
        });
        
        createdProjects.push(newProject);
      }
    }
    
    res.status(201).json({
      message: `Imported ${createdProjects.length} projects from GitHub`,
      projects: createdProjects
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 