import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AIAssistant from './pages/AIAssistant';
import SuperAdminDashboard from './pages/SuperAdminPages/SuperAdminDashboard';
import SuperAdminUserManagement from './pages/SuperAdminPages/SuperAdminUserManagement';
import HRDashboard from './pages/AdminPages/HRDasbhoard';
import HrEmployeeManagement from './pages/AdminPages/HREmployeeManagement';
import HRDocumentManagement from './pages/AdminPages/HRDocumentManagement';
import HRReports from './pages/AdminPages/HRReports';
import HROverview from './pages/AdminPages/HROverview';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected User Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/AIassistant" 
          element={
            <ProtectedRoute>
              <AIAssistant />
            </ProtectedRoute>
          } 
        />
        
        {/* SuperAdmin Routes - Only SuperAdmin role */}
        <Route 
          path="/SuperAdminDashboard" 
          element={
            <ProtectedRoute allowedRoles={['SuperAdmin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/SuperAdminUserManagement" 
          element={
            <ProtectedRoute allowedRoles={['SuperAdmin']}>
              <SuperAdminUserManagement />
            </ProtectedRoute>
          } 
        />
        
        {/* HR/Admin Routes - Admin role */}
        <Route 
          path="/HROverview" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <HROverview />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/HRDashboard" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <HRDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/HREmployeeManagement" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <HrEmployeeManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/HRDocumentManagement" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <HRDocumentManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/HRReports" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <HRReports />
            </ProtectedRoute>
          } 
        />

        {/* Unauthorized page */}
        <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
      </Routes>
    </Router>
  );
}

export default App;