import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import PortalSelectionPage from './pages/PortalSelectionPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboardNew';
import ManagerDashboard from './pages/ManagerDashboardNew';
import DriverDashboard from './pages/DriverDashboardNew';
import CustomerDashboard from './pages/CustomerDashboardNew';
import FleetInventory from './pages/manager/FleetInventory';
import RouteOptimization from './pages/manager/RouteOptimization';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/portal-selection" element={<PortalSelectionPage />} />
          <Route path="/portals" element={<PortalSelectionPage />} />
          <Route path="/login/:role" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/fleet-inventory" element={<FleetInventory />} />
          <Route path="/manager/route-optimization" element={<RouteOptimization />} />
          <Route path="/admin/fleet-inventory" element={<FleetInventory />} />
          <Route path="/admin/route-optimization" element={<RouteOptimization />} />
          <Route path="/driver/dashboard" element={<DriverDashboard />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;