import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleService, maintenanceService } from '../services/api';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const fullName = localStorage.getItem('fullName') || 'Manager';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [vehiclesRes, maintenanceRes] = await Promise.all([
        vehicleService.getAll(),
        maintenanceService.getAll(),
      ]);

      setVehicles(vehiclesRes.data);
      setMaintenance(maintenanceRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const updateTelemetry = async (vehicleId) => {
    try {
      await vehicleService.updateTelemetry(vehicleId);
      loadData();
    } catch (error) {
      console.error('Error updating telemetry:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-green-950 to-emerald-900">
      <nav className="bg-emerald-800/50 backdrop-blur-sm border-b border-emerald-600/30 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-emerald-100">🧩 Manager Portal</h1>
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
        <h2 className="text-3xl font-bold text-emerald-100 mb-6">Fleet Operations</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-emerald-900/40 backdrop-blur-sm border border-emerald-500/30 rounded-lg shadow-lg p-6 hover:border-emerald-400/60 transition-all duration-300">
            <p className="text-emerald-200 text-sm font-semibold">Total Vehicles</p>
            <p className="text-3xl font-bold text-emerald-400">{vehicles.length}</p>
          </div>
          <div className="bg-emerald-900/40 backdrop-blur-sm border border-emerald-500/30 rounded-lg shadow-lg p-6 hover:border-emerald-400/60 transition-all duration-300">
            <p className="text-emerald-200 text-sm font-semibold">Available</p>
            <p className="text-3xl font-bold text-emerald-400">
              {vehicles.filter(v => v.status === 'AVAILABLE').length}
            </p>
          </div>
          <div className="bg-emerald-900/40 backdrop-blur-sm border border-emerald-500/30 rounded-lg shadow-lg p-6 hover:border-emerald-400/60 transition-all duration-300">
            <p className="text-emerald-200 text-sm font-semibold">In Use</p>
            <p className="text-3xl font-bold text-emerald-400">
              {vehicles.filter(v => v.status === 'IN_USE').length}
            </p>
          </div>
          <div className="bg-emerald-900/40 backdrop-blur-sm border border-emerald-500/30 rounded-lg shadow-lg p-6 hover:border-emerald-400/60 transition-all duration-300">
            <p className="text-emerald-200 text-sm font-semibold">Maintenance</p>
            <p className="text-3xl font-bold text-emerald-400">
              {vehicles.filter(v => v.status === 'MAINTENANCE').length}
            </p>
          </div>
        </div>

        <div className="bg-emerald-900/40 backdrop-blur-sm border border-emerald-500/30 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-emerald-100 mb-4">Fleet Inventory</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-emerald-800/30 backdrop-blur-sm rounded-lg p-4 border border-emerald-500/40 hover:border-emerald-400/60 transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-emerald-100">{vehicle.vehicleNumber}</p>
                    <p className="text-sm text-emerald-300">{vehicle.model}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${vehicle.status === 'AVAILABLE' ? 'bg-emerald-600 text-white' : vehicle.status === 'IN_USE' ? 'bg-yellow-600 text-white' : 'bg-orange-600 text-white'}`}>
                    {vehicle.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-emerald-300">📍 Location:</span>
                    <span className="font-semibold text-emerald-100">
                      {vehicle.latitude?.toFixed(2)}, {vehicle.longitude?.toFixed(2)}
                    </span>
                  </div>
                  
                  {vehicle.isElectric ? (
                    <div className="flex justify-between">
                      <span className="text-emerald-300">🔋 Battery:</span>
                      <span className="font-semibold text-emerald-100">{vehicle.batteryLevel}%</span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-emerald-300">⛽ Fuel:</span>
                      <span className="font-semibold text-emerald-100">{vehicle.fuelLevel}%</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-emerald-300">💪 Health:</span>
                    <span className="font-semibold text-emerald-100">{vehicle.healthScore}%</span>
                  </div>
                </div>

                <button
                  onClick={() => updateTelemetry(vehicle.id)}
                  className="w-full mt-3 bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:shadow-lg transition duration-300"
                >
                  Update Telemetry
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-emerald-900/40 backdrop-blur-sm border border-emerald-500/30 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-emerald-100 mb-4">Maintenance Schedule</h3>
          <div className="space-y-3">
            {maintenance.slice(0, 10).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-emerald-800/30 rounded-lg border border-emerald-500/40 hover:border-emerald-400/60 transition-all duration-300">
                <div>
                  <p className="font-semibold text-emerald-100">
                    Vehicle #{item.vehicle?.vehicleNumber || 'N/A'}
                  </p>
                  <p className="text-sm text-emerald-300">{item.issueType}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'PENDING' ? 'bg-orange-600 text-white' : item.status === 'IN_PROGRESS' ? 'bg-yellow-600 text-white' : 'bg-emerald-600 text-white'}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
