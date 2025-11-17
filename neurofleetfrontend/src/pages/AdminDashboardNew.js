import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleService, bookingService, maintenanceService } from '../services/api';
import Logo from '../components/Logo';
import VehicleManagement from './admin/VehicleManagement';
import UserManagement from './admin/UserManagement';
import Analytics from './admin/Analytics';
import Settings from './admin/Settings';
import {
  VehicleIcon,
  RouteIcon,
  RevenueIcon,
  MaintenanceIcon,
  BookingIcon,
  LogoutIcon,
  AlertIcon,
  TrendingUpIcon,
  ChartIcon,
} from '../components/Icons';

const AdminDashboardNew = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [stats, setStats] = useState({
    totalFleet: 0,
    activeTrips: 0,
    revenue: 0,
    maintenanceDue: 0,
  });
  const [activeTab, setActiveTab] = useState('overview');

  const fullName = localStorage.getItem('fullName') || 'Admin';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [vehiclesRes, bookingsRes, maintenanceRes] = await Promise.all([
        vehicleService.getAll(),
        bookingService.getAll(),
        maintenanceService.getAll(),
      ]);

      setVehicles(vehiclesRes.data);
      setBookings(bookingsRes.data);
      setMaintenance(maintenanceRes.data);

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

  const getStatusStyle = (status) => {
    const statusMap = {
      'AVAILABLE': 'status-available',
      'IN_USE': 'status-in-use',
      'MAINTENANCE': 'status-maintenance',
      'OUT_OF_SERVICE': 'status-critical',
      'CONFIRMED': 'status-available',
      'IN_PROGRESS': 'status-in-use',
      'PENDING': 'status-maintenance',
      'CRITICAL': 'status-critical',
      'HIGH': 'status-critical',
      'MEDIUM': 'status-maintenance',
    };
    return statusMap[status] || 'status-maintenance';
  };

  const kpiCards = [
    {
      title: 'Total Fleet',
      value: stats.totalFleet,
      icon: VehicleIcon,
      gradient: 'from-accent-cyan to-accent-blue',
      bgGlow: 'bg-accent-cyan/20',
    },
    {
      title: 'Active Trips',
      value: stats.activeTrips,
      icon: RouteIcon,
      gradient: 'from-accent-green to-accent-cyan',
      bgGlow: 'bg-accent-green/20',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.revenue.toFixed(2)}`,
      icon: RevenueIcon,
      gradient: 'from-accent-purple to-accent-pink',
      bgGlow: 'bg-accent-purple/20',
    },
    {
      title: 'Maintenance Due',
      value: stats.maintenanceDue,
      icon: AlertIcon,
      gradient: 'from-accent-pink to-accent-purple',
      bgGlow: 'bg-accent-pink/20',
    },
  ];

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
        return (
          <>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <ChartIcon size="lg" className="text-accent-cyan" />
                Dashboard Overview
              </h2>
              <p className="text-white/50">Monitor and manage your entire fleet operations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {kpiCards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={index}
                    className="kpi-card text-white group hover:scale-105 transition-transform duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`absolute inset-0 ${card.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <p className="text-white/60 text-sm font-semibold mb-2">{card.title}</p>
                          <p className={`text-4xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                            {card.value}
                          </p>
                        </div>
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent size="md" className="text-white" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-accent-green text-sm">
                        <TrendingUpIcon size="sm" />
                        <span>+5.2% from last month</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="glass-card p-6 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-6">
                  <VehicleIcon size="md" className="text-accent-cyan" />
                  <h3 className="text-xl font-bold text-white">Fleet Status</h3>
                </div>
                <div className="space-y-3">
                  {vehicles.slice(0, 5).map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl border border-white/5 hover:border-white/10 hover:bg-dark-700/60 transition-all duration-300"
                    >
                      <div>
                        <p className="font-semibold text-white">{vehicle.vehicleNumber}</p>
                        <p className="text-sm text-white/50">{vehicle.model}</p>
                      </div>
                      <span className={`status-badge ${getStatusStyle(vehicle.status)}`}>
                        <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                        {vehicle.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-6">
                  <BookingIcon size="md" className="text-accent-purple" />
                  <h3 className="text-xl font-bold text-white">Recent Bookings</h3>
                </div>
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl border border-white/5 hover:border-white/10 hover:bg-dark-700/60 transition-all duration-300"
                    >
                      <div>
                        <p className="font-semibold text-white">Booking #{booking.id}</p>
                        <p className="text-sm text-white/50">{new Date(booking.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`status-badge ${getStatusStyle(booking.status)}`}>
                        <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card p-6 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <AlertIcon size="md" className="text-accent-pink" />
                <h3 className="text-xl font-bold text-white">Predictive Maintenance Alerts</h3>
                <span className="ml-auto px-3 py-1 bg-accent-pink/20 text-accent-pink text-xs font-bold rounded-full animate-pulse">
                  AI-Powered
                </span>
              </div>
              <div className="space-y-3">
                {maintenance.filter(m => m.isPredictive).slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-accent-pink/5 border border-accent-pink/20 rounded-xl hover:border-accent-pink/40 hover:bg-accent-pink/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent-pink/20 flex items-center justify-center">
                        <MaintenanceIcon size="sm" className="text-accent-pink" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Vehicle #{item.vehicle?.vehicleNumber || 'N/A'}</p>
                        <p className="text-sm text-white/50">{item.issueType}</p>
                      </div>
                    </div>
                    <span className={`status-badge ${getStatusStyle(item.priority)}`}>
                      <AlertIcon size="sm" />
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-20"></div>

      <nav className="relative bg-dark-800/40 backdrop-blur-glass border-b border-white/10 shadow-glass">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Logo size="sm" animate={false} showText={true} />
              <div className="h-8 w-px bg-white/20"></div>
              <div>
                <h1 className="text-lg font-bold text-white flex items-center gap-2">
                  Admin Portal
                </h1>
                <p className="text-xs text-white/50">Full System Control</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-white/70">Welcome back,</p>
                <p className="text-sm font-semibold text-white">{fullName}</p>
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary flex items-center gap-2"
              >
                <LogoutIcon size="sm" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 pb-3">
            {[
              { id: 'overview', label: 'Overview', icon: ChartIcon },
              { id: 'vehicles', label: 'Vehicles', icon: VehicleIcon },
              { id: 'users', label: 'Users', icon: LogoutIcon },
              { id: 'analytics', label: 'Analytics', icon: TrendingUpIcon },
              { id: 'settings', label: 'Settings', icon: AlertIcon },
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-white shadow-lg shadow-accent-cyan/30'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <TabIcon size="sm" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboardNew;
