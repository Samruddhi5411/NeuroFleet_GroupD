import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import MyTrips from './driver/MyTrips';
import LiveMap from './driver/LiveMap';
import Earnings from './driver/Earnings';
import DriverProfile from './driver/DriverProfile'; // ADD THIS IMPORT
import { RouteIcon, LocationIcon, RevenueIcon, LogoutIcon } from '../components/Icons';

const DriverDashboardNew = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('trips');
  const fullName = localStorage.getItem('fullName') || 'Driver';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <DriverProfile />;
      case 'trips':
        return <MyTrips />;
      case 'map':
        return <LiveMap />;
      case 'earnings':
        return <Earnings />;
      default:
        return <MyTrips />;
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
                  🚗 Driver Portal
                </h1>
                <p className="text-xs text-white/50">Your Journey Dashboard</p>
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
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'profile'
                  ? 'bg-gradient-to-r from-accent-purple to-accent-pink text-white shadow-lg shadow-accent-purple/30'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              👤 Profile
            </button>
            <button
              onClick={() => setActiveTab('trips')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'trips'
                  ? 'bg-gradient-to-r from-accent-green to-accent-cyan text-white shadow-lg shadow-accent-green/30'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              <RouteIcon size="sm" />
              My Trips
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'map'
                  ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-white shadow-lg shadow-accent-cyan/30'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              <LocationIcon size="sm" />
              Live Map
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'earnings'
                  ? 'bg-gradient-to-r from-accent-green to-accent-cyan text-white shadow-lg shadow-accent-green/30'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              <RevenueIcon size="sm" />
              Earnings
            </button>
          </div>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default DriverDashboardNew;