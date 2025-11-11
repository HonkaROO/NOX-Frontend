import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AIAssistant from './pages/AIAssistant';
import HROverview from './pages/AdminPages/HROverview';
import HRDashboard from './pages/AdminPages/HRDasbhoard';
import HrEmployeeManagement from './pages/AdminPages/HREmployeeManagement';
import HRDocumentManagement from './pages/AdminPages/HRDocumentManagement';
import HRReports from './pages/AdminPages/HRReports';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/AIassistant" element={<AIAssistant />} />
        <Route path="/HROverview" element={<HROverview />} />
        <Route path="/HRDashboard" element={<HRDashboard />} />
        <Route path="/HREmployeeManagement" element={<HrEmployeeManagement />} />
        <Route path="/HRDocumentManagement" element={<HRDocumentManagement />} />
        <Route path="/HRReports" element={<HRReports />} />
      </Routes>
    </Router>
  );
}

export default App;