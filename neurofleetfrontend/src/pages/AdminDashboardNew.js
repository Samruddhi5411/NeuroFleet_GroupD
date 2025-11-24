
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';
import { Line, Bar } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup, HeatmapLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { VehicleIcon, RouteIcon, MaintenanceIcon, LogoutIcon, DownloadIcon, ChartIcon } from '../components/Icons';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fullName = localStorage.getItem('fullName') || 'Admin';

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8083/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (reportType) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8083/api/analytics/reports/${reportType}/csv`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}-report.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      alert(`✅ ${reportType} report downloaded!`);
    } catch (error) {
      alert('❌ Failed to download report');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <nav className="bg-dark-800/40 backdrop-blur-glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Logo size="sm" showText={true} />
              <div className="h-8 w-px bg-white/20"></div>
              <h1 className="text-lg font-bold text-white">Admin Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white/70">Welcome, {fullName}</span>
              <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
                <LogoutIcon size="sm" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Fleet */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/60 text-sm mb-1">Total Fleet</p>
                <p className="text-3xl font-bold text-accent-cyan">
                  {dashboardData?.totalFleet || 0}
                </p>
              </div>
              <VehicleIcon size="lg" className="text-accent-cyan" />
            </div>
            <div className="text-sm text-white/50">
              Available: {dashboardData?.vehiclesAvailable || 0} |
              In Use: {dashboardData?.vehiclesInUse || 0}
            </div>
          </div>

          {/* Active Trips */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/60 text-sm mb-1">Active Trips</p>
                <p className="text-3xl font-bold text-accent-green">
                  {dashboardData?.activeTrips || 0}
                </p>
              </div>
              <RouteIcon size="lg" className="text-accent-green" />
            </div>
            <div className="text-sm text-white/50">
              Total Bookings: {dashboardData?.totalBookings || 0}
            </div>
          </div>

          {/* Vehicles Under Maintenance */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/60 text-sm mb-1">Under Maintenance</p>
                <p className="text-3xl font-bold text-accent-pink">
                  {dashboardData?.vehiclesMaintenance || 0}
                </p>
              </div>
              <MaintenanceIcon size="lg" className="text-accent-pink" />
            </div>
            <div className="text-sm text-white/50">
              Critical: {dashboardData?.criticalMaintenance || 0}
            </div>
          </div>
        </div>

        {/* Heatmap - Trip Density */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <ChartIcon size="md" className="text-accent-cyan" />
            Trip Density Heatmap
          </h3>
          <div className="h-96 bg-dark-700/40 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <p className="text-white/50 mb-2">📍 Trip Heatmap Visualization</p>
              <p className="text-white/30 text-sm">
                Shows concentration of trips across different areas
              </p>
            </div>
          </div>
        </div>

        {/* Hourly Rental Activity Chart */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Hourly Rental Activity</h3>
          <div className="h-80">
            {dashboardData?.hourlyActivity && (
              <Bar
                data={{
                  labels: dashboardData.hourlyActivity.labels || [],
                  datasets: [{
                    label: 'Bookings per Hour',
                    data: dashboardData.hourlyActivity.values || [],
                    backgroundColor: 'rgba(34, 211, 238, 0.8)',
                    borderColor: 'rgb(34, 211, 238)',
                    borderWidth: 1,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#fff' } } },
                  scales: {
                    y: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                  },
                }}
              />
            )}
          </div>
        </div>

        {/* Download Reports */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <DownloadIcon size="md" className="text-accent-green" />
            Download Reports
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['fleet', 'bookings', 'revenue', 'trips'].map((type) => (
              <button
                key={type}
                onClick={() => handleDownloadReport(type)}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <DownloadIcon size="sm" />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Usage Summary */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Fleet Usage Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-accent-green/10 rounded-xl">
              <p className="text-white/60 text-sm mb-1">Available</p>
              <p className="text-2xl font-bold text-accent-green">
                {dashboardData?.vehiclesAvailable || 0}
              </p>
            </div>
            <div className="text-center p-4 bg-accent-cyan/10 rounded-xl">
              <p className="text-white/60 text-sm mb-1">In Use</p>
              <p className="text-2xl font-bold text-accent-cyan">
                {dashboardData?.vehiclesInUse || 0}
              </p>
            </div>
            <div className="text-center p-4 bg-accent-pink/10 rounded-xl">
              <p className="text-white/60 text-sm mb-1">Maintenance</p>
              <p className="text-2xl font-bold text-accent-pink">
                {dashboardData?.vehiclesMaintenance || 0}
              </p>
            </div>
            <div className="text-center p-4 bg-accent-purple/10 rounded-xl">
              <p className="text-white/60 text-sm mb-1">Total</p>
              <p className="text-2xl font-bold text-accent-purple">
                {dashboardData?.totalFleet || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Trips Per Hour */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Trips Per Hour (Today)</h3>
          <div className="h-64">
            {dashboardData?.tripsPerHour && (
              <Line
                data={{
                  labels: dashboardData.tripsPerHour.labels || [],
                  datasets: [{
                    label: 'Trips',
                    data: dashboardData.tripsPerHour.values || [],
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#fff' } } },
                  scales: {
                    y: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                  },
                }}
              />
            )}
          </div>
        </div>

        {/* Maintenance Schedule */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Maintenance Schedule</h3>
          {dashboardData?.maintenanceSchedule && dashboardData.maintenanceSchedule.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.maintenanceSchedule.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl">
                  <div>
                    <p className="text-white font-semibold">{item.vehicle?.vehicleNumber}</p>
                    <p className="text-white/50 text-sm">{item.issueType}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                      item.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                    }`}>
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white/50 py-8">No maintenance scheduled</div>
          )}
        </div>

        {/* Manager Performance */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Manager Performance</h3>
          {dashboardData?.managerPerformance && dashboardData.managerPerformance.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.managerPerformance.map((manager) => (
                <div key={manager.id} className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl">
                  <div>
                    <p className="text-white font-semibold">{manager.fullName}</p>
                    <p className="text-white/50 text-sm">Bookings Processed: {manager.bookingsProcessed || 0}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-accent-green font-bold">⭐ {manager.rating || 5.0}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white/50 py-8">No manager data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;