import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AIAssistant from './pages/AIAssistant';
import HROverview from './pages/HROverview';
import SuperAdminDashboard from './pages/SuperAdminPages/SuperAdminDashboard';




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
        <Route path="/SuperAdminDashboard" element={<SuperAdminDashboard />} />
       
      </Routes>
    </Router>
  );
}

export default App;