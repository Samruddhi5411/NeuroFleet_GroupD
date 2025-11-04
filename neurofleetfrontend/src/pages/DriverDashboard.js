import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/api';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const fullName = localStorage.getItem('fullName') || 'Driver';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await vehicleService.getAll();
      setVehicles(response.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-green-950 to-emerald-900">
      <nav className="bg-emerald-800/50 backdrop-blur-sm border-b border-emerald-600/30 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-emerald-100">🚗 Driver Portal</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-emerald-200">Welcome, {fullName}</span>
            <button
              onClick={handleLogout}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-emerald-100 mb-6">My Trips & Routes</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-emerald-900/40 backdrop-blur-sm border border-emerald-500/30 rounded-lg shadow-lg p-6 hover:border-emerald-400/60 transition-all duration-300">
            <p className="text-emerald-200 text-sm font-semibold">Today's Trips</p>
            <p className="text-3xl font-bold text-emerald-400">5</p>
          </div>
          <div className="bg-emerald-900/40 backdrop-blur-sm border border-emerald-500/30 rounded-lg shadow-lg p-6 hover:border-emerald-400/60 transition-all duration-300">
            <p className="text-emerald-200 text-sm font-semibold">Distance Covered</p>
            <p className="text-3xl font-bold text-emerald-400">124 km</p>
          </div>
          <div className="bg-emerald-900/40 backdrop-blur-sm border border-emerald-500/30 rounded-lg shadow-lg p-6 hover:border-emerald-400/60 transition-all duration-300">
            <p className="text-emerald-200 text-sm font-semibold">Current Trip</p>
            <p className="text-3xl font-bold text-emerald-400">In Progress</p>
          </div>
        </div>

        <div className="bg-emerald-900/40 backdrop-blur-sm border border-emerald-500/30 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-emerald-100 mb-4">Current Route</h3>
          <div className="bg-emerald-800/30 rounded-lg p-6 text-center">
            <p className="text-emerald-200 mb-4">🗺️ Map view would be displayed here</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-emerald-800/50 p-4 rounded-lg border border-emerald-500/40">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold text-emerald-100">Start Location</p>
                    <p className="text-sm text-emerald-300">123 Main Street</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-2xl">⬇️</span>
              </div>
              <div className="flex items-center justify-between bg-emerald-800/50 p-4 rounded-lg border border-emerald-500/40">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏁</span>
                  <div>
                    <p className="font-semibold text-emerald-100">Destination</p>
                    <p className="text-sm text-emerald-300">456 Oak Avenue</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-emerald-900/40 backdrop-blur-sm border border-emerald-500/30 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-emerald-100 mb-4">Available Vehicles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.filter(v => v.status === 'AVAILABLE').slice(0, 6).map((vehicle) => (
              <div key={vehicle.id} className="bg-emerald-800/30 backdrop-blur-sm rounded-lg p-4 border border-emerald-500/40 hover:border-emerald-400/60 transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-emerald-100">{vehicle.vehicleNumber}</p>
                    <p className="text-sm text-emerald-300">{vehicle.model}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white">AVAILABLE</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-emerald-300">Type:</span>
                    <span className="font-semibold text-emerald-100">{vehicle.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-300">Capacity:</span>
                    <span className="font-semibold text-emerald-100">{vehicle.capacity} seats</span>
                  </div>
                </div>

                <button className="w-full mt-3 bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:shadow-lg transition duration-300">
                  Start Trip
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;