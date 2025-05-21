import { Toaster } from 'react-hot-toast'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import HomePage from './pages/HomePage'
import ProjectShow from './pages/ProjectShow'
import PersonalDetail from './pages/PersonalDetail'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import ProfileEditPage from './pages/ProfileEditPage'
import ProjectExperienceEditPage from './pages/ProjectExperienceEditPage'
import ProjectEditPage from './pages/ProjectEditPage' // 新增的Project编辑页面
import AddEducation from './pages/AddEducation'
import EditEducation from './pages/EditEducation'
import BlogEditPage from './pages/BlogEditPage'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }
  
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectShow />} />
        <Route path="/about" element={<PersonalDetail />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/profile/edit" element={
          <ProtectedRoute>
            <ProfileEditPage />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/profile/new" element={
          <ProtectedRoute>
            <ProfileEditPage />
          </ProtectedRoute>
        } />
        
        {/* Project routes - for editing Project model projects */}
        <Route path="/admin/project-model/new" element={
          <ProtectedRoute>
            <ProjectEditPage />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/project-model/edit/:id" element={
          <ProtectedRoute>
            <ProjectEditPage />
          </ProtectedRoute>
        } />
        
        {/* Project Experience routes - for editing Profile's projectExperience */}
        <Route path="/admin/project/new" element={
          <ProtectedRoute>
            <ProjectExperienceEditPage />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/project/edit/:id" element={
          <ProtectedRoute>
            <ProjectExperienceEditPage />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/education/new" element={
          <ProtectedRoute>
            <AddEducation />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/education/edit/:id" element={
          <ProtectedRoute>
            <EditEducation />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/blog/new" element={
          <ProtectedRoute>
            <BlogEditPage />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/blog/edit/:id" element={
          <ProtectedRoute>
            <BlogEditPage />
          </ProtectedRoute>
        } />
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster position="bottom-right" />
    </Router>
  );
};

export default App