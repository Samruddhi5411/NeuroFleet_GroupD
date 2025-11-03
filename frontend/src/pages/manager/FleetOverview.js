import React, { useState, useEffect } from 'react';
import { vehicleService } from '../../services/api';
import { VehicleIcon, BatteryIcon, LocationIcon, AlertIcon } from '../../components/Icons';

const FleetOverview = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const response = await vehicleService.getAll();
      setVehicles(response.data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  };

  const getStatusStyle = (status) => {
    const statusMap = {
      'AVAILABLE': 'status-available',
      'IN_USE': 'status-in-use',
      'MAINTENANCE': 'status-maintenance',
      'OUT_OF_SERVICE': 'status-critical',
    };
    return statusMap[status] || 'status-maintenance';
  };

  const statusCounts = {
    available: vehicles.filter(v => v.status === 'AVAILABLE').length,
    inUse: vehicles.filter(v => v.status === 'IN_USE').length,
    maintenance: vehicles.filter(v => v.status === 'MAINTENANCE').length,
    outOfService: vehicles.filter(v => v.status === 'OUT_OF_SERVICE').length,
  };

  const avgHealthScore = vehicles.length > 0 
    ? (vehicles.reduce((sum, v) => sum + (v.healthScore || 100), 0) / vehicles.length).toFixed(1)
    : 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <VehicleIcon size="lg" className="text-accent-cyan" />
          Fleet Overview
        </h2>
        <p className="text-white/50">Monitor your entire fleet at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 group hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">Available</p>
              <p className="text-4xl font-bold text-accent-green">{statusCounts.available}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center">
              <VehicleIcon size="md" className="text-white" />
            </div>
          </div>
          <p className="text-white/50 text-sm">{((statusCounts.available / vehicles.length) * 100 || 0).toFixed(1)}% of fleet</p>
        </div>

        <div className="glass-card p-6 group hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">In Use</p>
              <p className="text-4xl font-bold text-accent-cyan">{statusCounts.inUse}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
              <LocationIcon size="md" className="text-white" />
            </div>
          </div>
          <p className="text-white/50 text-sm">{((statusCounts.inUse / vehicles.length) * 100 || 0).toFixed(1)}% utilization</p>
        </div>

        <div className="glass-card p-6 group hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">Maintenance</p>
              <p className="text-4xl font-bold text-accent-purple">{statusCounts.maintenance}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
              <AlertIcon size="md" className="text-white" />
            </div>
          </div>
          <p className="text-white/50 text-sm">Needs attention</p>
        </div>

        <div className="glass-card p-6 group hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">Avg Health</p>
              <p className="text-4xl font-bold text-accent-green">{avgHealthScore}%</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center">
              <BatteryIcon size="md" className="text-white" level={avgHealthScore} />
            </div>
          </div>
          <p className="text-white/50 text-sm">Fleet condition</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-6">Fleet Status Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="glass-card-hover p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-1">{vehicle.model}</h4>
                  <p className="text-sm text-white/50">{vehicle.vehicleNumber}</p>
                </div>
                <span className={`status-badge ${getStatusStyle(vehicle.status)}`}>
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                  {vehicle.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Type:</span>
                  <span className="text-white font-semibold">{vehicle.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Health:</span>
                  <span className={`font-semibold ${
                    vehicle.healthScore >= 90 ? 'text-accent-green' :
                    vehicle.healthScore >= 70 ? 'text-accent-cyan' :
                    'text-accent-pink'
                  }`}>
                    {vehicle.healthScore || 100}%
                  </span>
                </div>
                {vehicle.isElectric ? (
                  <div className="flex items-center gap-2">
                    <BatteryIcon size="sm" className="text-accent-cyan" level={vehicle.batteryLevel || 100} />
                    <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent-cyan to-accent-blue rounded-full transition-all duration-500"
                        style={{ width: `${vehicle.batteryLevel || 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-white/70">{vehicle.batteryLevel || 100}%</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LocationIcon size="sm" className="text-accent-green" />
                    <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent-green to-accent-cyan rounded-full transition-all duration-500"
                        style={{ width: `${vehicle.fuelLevel || 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-white/70">{vehicle.fuelLevel || 100}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FleetOverview;
