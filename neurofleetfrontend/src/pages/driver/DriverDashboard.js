import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import { RouteIcon, LogoutIcon } from '../../components/Icons';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const fullName = localStorage.getItem('fullName') || 'Driver';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <nav className="bg-dark-800/40 backdrop-blur-glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Logo size="sm" animate={false} showText={true} />
            <div className="flex items-center gap-4">
              <span className="text-white">Welcome, {fullName}</span>
              <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
                <LogoutIcon size="sm" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <RouteIcon size="lg" className="text-accent-cyan" />
          Driver Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <p className="text-white/60 text-sm font-semibold mb-2">Today's Trips</p>
            <p className="text-4xl font-bold text-accent-cyan">5</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-white/60 text-sm font-semibold mb-2">Earnings</p>
            <p className="text-4xl font-bold text-accent-green">₹2,450</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-white/60 text-sm font-semibold mb-2">Distance</p>
            <p className="text-4xl font-bold text-accent-purple">124 km</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;