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

// ✅ Fix Leaflet markers
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
  const [loading, setLoading] = useState(true);
  const fullName = localStorage.getItem('fullName') || 'Admin';

  // ✅ Chart refs to prevent canvas reuse
  const doughnutChartRef = useRef(null);
  const barChartRef = useRef(null);

  const indianCities = [
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, trips: 45 },
    { name: 'Delhi', lat: 28.6139, lng: 77.2090, trips: 38 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946, trips: 32 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567, trips: 28 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, trips: 25 },
  ];

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // ✅ Load dashboard metrics
      const [dashboardRes, kpiRes] = await Promise.all([
        axios.get('http://localhost:8083/api/admin/dashboard', { headers }),
        axios.get('http://localhost:8083/api/analytics/kpi', { headers }).catch(() => null)
      ]);

      setDashboardData(dashboardRes.data);
      setTripDensityData(indianCities);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Use mock data if backend fails
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
        maintenanceSchedule: [],
        hourlyActivity: {
          labels: ['00:00', '06:00', '12:00', '18:00'],
          values: [5, 15, 30, 20]
        }
      });
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
      console.error('Download error:', error);
      alert(`❌ Report not available yet. Backend endpoint needed: /api/analytics/reports/${reportType}/csv`);
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
            <h2 className="text-3xl font-bold text-white mb-4">Vehicles Under Maintenance</h2>
            <div className="glass-card p-6">
              <div className="space-y-4">
                {dashboardData?.maintenanceSchedule && dashboardData.maintenanceSchedule.length > 0 ? (
                  dashboardData.maintenanceSchedule.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl">
                      <div>
                        <p className="text-white font-bold">{item.vehicle?.vehicleNumber}</p>
                        <p className="text-white/50 text-sm">{item.issueType}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                          item.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                        }`}>
                        {item.priority}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-white/50 py-8">No maintenance scheduled</p>
                )}
              </div>
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
                    labels: dashboardData?.hourlyActivity?.labels || ['00:00', '06:00', '12:00', '18:00'],
                    datasets: [{
                      label: 'Bookings per Hour',
                      data: dashboardData?.hourlyActivity?.values || [5, 15, 30, 20],
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

            {/* ✅ KPI Cards */}
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

            {/* ✅ User Breakdown */}
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
              { id: 'maintenance', label: 'Maintenance' },
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