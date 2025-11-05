import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';
import VehicleManagement from './admin/VehicleManagement';
import UserManagement from './admin/UserManagement';
import Analytics from './admin/Analytics';
import Settings from './admin/Settings';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalFleet: 0,
    activeTrips: 0,
    revenue: 0,
    maintenanceDue: 0,
  });
  const [activeTab, setActiveTab] = useState('overview'); // ✅ Default to 'overview' not 'vehicles'

  const fullName = localStorage.getItem('fullName') || 'Admin';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [vehiclesRes, bookingsRes, maintenanceRes, usersRes] = await Promise.all([
        axios.get('http://localhost:8083/api/admin/vehicles', config),
        axios.get('http://localhost:8083/api/admin/bookings', config),
        axios.get('http://localhost:8083/api/admin/maintenance', config),
        axios.get('http://localhost:8083/api/admin/users', config)
      ]);

      setVehicles(vehiclesRes.data);
      setBookings(bookingsRes.data);
      setMaintenance(maintenanceRes.data);
      setUsers(usersRes.data);

      setStats({
        totalFleet: vehiclesRes.data.length,
        activeTrips: bookingsRes.data.filter(b => b.status === 'IN_PROGRESS').length,
        revenue: bookingsRes.data.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
        maintenanceDue: maintenanceRes.data.filter(m => m.status === 'PENDING').length,
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'vehicles':
        return <VehicleManagement />;
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'overview':
      default:
        return renderOverview(); // ✅ Show overview by default
    }
  };

  const renderOverview = () => (
    <>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
        <p className="text-white/50">Monitor your entire fleet operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm mb-1">Total Fleet</p>
              <p className="text-4xl font-bold text-accent-green">{stats.totalFleet}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
              🚗
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm mb-1">Active Trips</p>
              <p className="text-4xl font-bold text-accent-cyan">{stats.activeTrips}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center">
              📍
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm mb-1">Total Revenue</p>
              <p className="text-4xl font-bold text-accent-purple">₹{stats.revenue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
              💰
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm mb-1">Maintenance Due</p>
              <p className="text-4xl font-bold text-accent-pink">{stats.maintenanceDue}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center">
              ⚠️
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Fleet Status</h3>
          <div className="space-y-3">
            {vehicles.slice(0, 5).map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl">
                <div>
                  <p className="font-semibold text-white">{vehicle.vehicleNumber}</p>
                  <p className="text-sm text-white/50">{vehicle.model}</p>
                </div>
                <span className={`status-badge status-${vehicle.status.toLowerCase().replace('_', '-')}`}>
                  {vehicle.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl">
                <div>
                  <p className="font-semibold text-white">Booking #{booking.id}</p>
                  <p className="text-sm text-white/50">{booking.customer?.fullName || 'Customer'}</p>
                </div>
                <span className={`status-badge status-${booking.status.toLowerCase().replace('_', '-')}`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      <nav className="relative bg-dark-800/40 backdrop-blur-glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Logo size="sm" animate={false} showText={true} />
              <div className="h-8 w-px bg-white/20"></div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Portal</h1>
                <p className="text-xs text-white/50">Full System Control</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-white/70">Welcome,</p>
                <p className="text-sm font-semibold text-white">{fullName}</p>
              </div>
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 pb-3">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'vehicles', label: 'Vehicles' },
              { id: 'users', label: 'Users' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'settings', label: 'Settings' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;