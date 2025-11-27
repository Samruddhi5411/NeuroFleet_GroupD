

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  VehicleIcon,
  RouteIcon,
  MaintenanceIcon,
  LogoutIcon,
  DownloadIcon,
  ChartIcon,
  UserIcon
} from '../components/Icons';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [tripDensityData, setTripDensityData] = useState([]);
  const [hourlyActivityData, setHourlyActivityData] = useState(null);
  const [maintenancePredictions, setMaintenancePredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const fullName = localStorage.getItem('fullName') || 'Admin';

  const doughnutChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [dashboardRes, hourlyRes, densityRes] = await Promise.all([
        axios.get('http://localhost:8083/api/admin/dashboard', { headers }),
        axios.get('http://localhost:8083/api/analytics/hourly-activity', { headers }).catch(() => null),
        axios.get('http://localhost:8083/api/analytics/trip-density', { headers }).catch(() => null)
      ]);

      setDashboardData(dashboardRes.data);

      if (hourlyRes && hourlyRes.data) {
        setHourlyActivityData(hourlyRes.data);
      }

      if (densityRes && densityRes.data) {
        setTripDensityData(densityRes.data);
      }

      loadAIMaintenance();
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setDashboardData({
        totalFleet: 50,
        vehiclesAvailable: 20,
        vehiclesInUse: 25,
        vehiclesMaintenance: 5,
        activeTrips: 25,
        totalBookings: 1200,
        totalDrivers: 30,
        totalManagers: 5,
        totalCustomers: 500,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAIMaintenance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8083/api/ai/maintenance/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMaintenancePredictions(response.data || []);
    } catch (error) {
      console.error('AI maintenance error:', error);
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
      console.error('Download error:', error);
      alert(`❌ Report not available yet.`);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'HIGH': 'bg-red-500/20 text-red-400 border-red-500/30',
      'MEDIUM': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'LOW': 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };
    return colors[priority] || 'bg-gray-500/20 text-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'fleet':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Total Fleet Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass-card p-6 text-center">
                <p className="text-white/60 text-sm mb-2">Total Vehicles</p>
                <p className="text-4xl font-bold text-accent-cyan">{dashboardData?.totalFleet || 0}</p>
              </div>
              <div className="glass-card p-6 text-center">
                <p className="text-white/60 text-sm mb-2">Available</p>
                <p className="text-4xl font-bold text-accent-green">{dashboardData?.vehiclesAvailable || 0}</p>
              </div>
              <div className="glass-card p-6 text-center">
                <p className="text-white/60 text-sm mb-2">In Use</p>
                <p className="text-4xl font-bold text-accent-blue">{dashboardData?.vehiclesInUse || 0}</p>
              </div>
              <div className="glass-card p-6 text-center">
                <p className="text-white/60 text-sm mb-2">Maintenance</p>
                <p className="text-4xl font-bold text-accent-pink">{dashboardData?.vehiclesMaintenance || 0}</p>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">Fleet Distribution</h3>
              <div className="h-80">
                <Doughnut
                  ref={doughnutChartRef}
                  data={{
                    labels: ['Available', 'In Use', 'Maintenance', 'Out of Service'],
                    datasets: [{
                      data: [
                        dashboardData?.vehiclesAvailable || 0,
                        dashboardData?.vehiclesInUse || 0,
                        dashboardData?.vehiclesMaintenance || 0,
                        0
                      ],
                      backgroundColor: [
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(34, 211, 238, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                      ],
                      borderWidth: 0,
                    }],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: { color: '#fff' },
                        position: 'bottom'
                      }
                    },
                  }}
                />
              </div>
            </div>
          </div>
        );

      case 'trips':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Active Trips</h2>
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-accent-green">
                  {dashboardData?.activeTrips || 0} Active Trips
                </h3>
                <RouteIcon size="lg" className="text-accent-green" />
              </div>
              <p className="text-white/60">Total Bookings: {dashboardData?.totalBookings || 0}</p>
            </div>
          </div>
        );

      case 'maintenance':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-white">🤖 AI Maintenance Predictions</h2>
              <button
                onClick={loadAIMaintenance}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:opacity-90"
              >
                🔄 Refresh AI
              </button>
            </div>

            {maintenancePredictions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="glass-card p-4 bg-red-500/10 border border-red-500/20">
                  <p className="text-white/60 text-sm mb-1">High Priority</p>
                  <p className="text-red-400 font-bold text-3xl">
                    {maintenancePredictions.filter(p => p.prediction?.priority === 'HIGH').length}
                  </p>
                </div>
                <div className="glass-card p-4 bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-white/60 text-sm mb-1">Medium Priority</p>
                  <p className="text-yellow-400 font-bold text-3xl">
                    {maintenancePredictions.filter(p => p.prediction?.priority === 'MEDIUM').length}
                  </p>
                </div>
                <div className="glass-card p-4 bg-blue-500/10 border border-blue-500/20">
                  <p className="text-white/60 text-sm mb-1">Low Priority</p>
                  <p className="text-blue-400 font-bold text-3xl">
                    {maintenancePredictions.filter(p => p.prediction?.priority === 'LOW').length}
                  </p>
                </div>
              </div>
            )}

            <div className="glass-card p-6">
              {maintenancePredictions.length > 0 ? (
                <div className="space-y-3">
                  {maintenancePredictions
                    .sort((a, b) => {
                      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
                      return priorityOrder[a.prediction?.priority] - priorityOrder[b.prediction?.priority];
                    })
                    .map((item) => (
                      <div key={item.vehicle_id} className={`p-4 rounded-xl border-2 ${item.prediction?.priority === 'HIGH' ? 'bg-red-500/10 border-red-500/30' :
                          item.prediction?.priority === 'MEDIUM' ? 'bg-yellow-500/10 border-yellow-500/30' :
                            'bg-blue-500/10 border-blue-500/30'
                        }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">🔧</div>
                            <div>
                              <p className="text-white font-semibold">{item.vehicle_number}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-cyan-400 text-xs">🤖 AI Prediction</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${getPriorityColor(item.prediction?.priority)}`}>
                                  {item.prediction?.priority} Priority
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white/60 text-xs">Risk Score</p>
                            <p className={`font-bold text-2xl ${item.prediction?.risk_score > 70 ? 'text-red-400' :
                                item.prediction?.risk_score > 40 ? 'text-yellow-400' :
                                  'text-blue-400'
                              }`}>
                              {item.prediction?.risk_score}%
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Low Risk:</span>
                            <span className="text-blue-400 font-semibold">{item.prediction?.confidence?.LOW}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Medium Risk:</span>
                            <span className="text-yellow-400 font-semibold">{item.prediction?.confidence?.MEDIUM}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">High Risk:</span>
                            <span className="text-red-400 font-semibold">{item.prediction?.confidence?.HIGH}%</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10">
                          <p className="text-white/60 text-xs mb-2">🤖 AI Recommendations:</p>
                          <ul className="space-y-1">
                            {item.prediction?.recommendations?.map((rec, idx) => (
                              <li key={idx} className="text-white text-sm flex items-start gap-2">
                                <span className="text-cyan-400">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                          {item.prediction?.next_maintenance_days && (
                            <p className="text-white/50 text-xs mt-2">
                              ⏰ Next maintenance in: <strong>{item.prediction.next_maintenance_days} days</strong>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤖</div>
                  <p className="text-white/50 mb-2">No AI predictions available</p>
                  <p className="text-white/30 text-sm">Make sure the AI service is running on port 5000</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'heatmap':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Trip Density Heatmap</h2>
            <div className="glass-card p-6">
              <div style={{ height: '600px', width: '100%' }}>
                <MapContainer
                  center={[20.5937, 78.9629]}
                  zoom={5}
                  style={{ height: '100%', width: '100%', borderRadius: '12px' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                  />
                  {tripDensityData.map((city, idx) => (
                    <React.Fragment key={idx}>
                      <Circle
                        center={[city.lat, city.lng]}
                        radius={city.trips * 5000}
                        fillColor="#22c55e"
                        fillOpacity={0.3}
                        color="#22c55e"
                      />
                      <Marker position={[city.lat, city.lng]}>
                        <Popup>
                          <strong>{city.name}</strong><br />
                          Trips: {city.trips}
                        </Popup>
                      </Marker>
                    </React.Fragment>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>
        );

      case 'hourly':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Hourly Rental Activity</h2>
            <div className="glass-card p-6">
              <div className="h-96">
                <Bar
                  ref={barChartRef}
                  data={{
                    labels: hourlyActivityData?.labels || [],
                    datasets: [{
                      label: 'Bookings per Hour',
                      data: hourlyActivityData?.values || [],
                      backgroundColor: 'rgba(34, 211, 238, 0.8)',
                      borderColor: 'rgb(34, 211, 238)',
                      borderWidth: 2,
                    }],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: { color: '#fff' }
                      }
                    },
                    scales: {
                      y: {
                        ticks: { color: '#fff' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                      },
                      x: {
                        ticks: { color: '#fff' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Download Reports</h2>
            <div className="glass-card p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['fleet', 'bookings', 'revenue', 'trips'].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleDownloadReport(type)}
                    className="btn-primary flex items-center justify-center gap-2 py-6"
                  >
                    <DownloadIcon size="md" />
                    <span className="capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Total Fleet</p>
                    <p className="text-4xl font-bold text-accent-cyan">{dashboardData?.totalFleet || 0}</p>
                  </div>
                  <VehicleIcon size="lg" className="text-accent-cyan" />
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Active Trips</p>
                    <p className="text-4xl font-bold text-accent-green">{dashboardData?.activeTrips || 0}</p>
                  </div>
                  <RouteIcon size="lg" className="text-accent-green" />
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Maintenance</p>
                    <p className="text-4xl font-bold text-accent-pink">{dashboardData?.vehiclesMaintenance || 0}</p>
                  </div>
                  <MaintenanceIcon size="lg" className="text-accent-pink" />
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Total Users</p>
                    <p className="text-4xl font-bold text-accent-purple">
                      {(dashboardData?.totalDrivers || 0) +
                        (dashboardData?.totalManagers || 0) +
                        (dashboardData?.totalCustomers || 0)}
                    </p>
                  </div>
                  <UserIcon size="lg" className="text-accent-purple" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-4">
                <p className="text-white/60 text-sm">Drivers</p>
                <p className="text-2xl font-bold text-white">{dashboardData?.totalDrivers || 0}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-white/60 text-sm">Managers</p>
                <p className="text-2xl font-bold text-white">{dashboardData?.totalManagers || 0}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-white/60 text-sm">Customers</p>
                <p className="text-2xl font-bold text-white">{dashboardData?.totalCustomers || 0}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
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

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 pb-3 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'fleet', label: 'Total Fleet' },
              { id: 'trips', label: 'Active Trips' },
              { id: 'maintenance', label: '🤖 AI Maintenance' },
              { id: 'heatmap', label: 'Trip Heatmap' },
              { id: 'hourly', label: 'Hourly Activity' },
              { id: 'reports', label: 'Download Reports' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
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

      <div className="max-w-7xl mx-auto p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;