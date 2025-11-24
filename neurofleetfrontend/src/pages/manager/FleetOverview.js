import React, { useState, useEffect } from 'react';
import { vehicleService } from '../../services/api';
import { VehicleIcon } from '../../components/Icons';

const FleetOverview = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const response = await vehicleService.getAllForManager();
      setVehicles(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getStatusStyle = (status) => {
    const map = {
      'AVAILABLE': 'status-available',
      'IN_USE': 'status-in-use',
      'MAINTENANCE': 'status-maintenance',
    };
    return map[status] || 'status-maintenance';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Fleet Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-white">{vehicle.model}</h4>
                <p className="text-white/50 text-sm">{vehicle.vehicleNumber}</p>
              </div>
              <span className={`status-badge ${getStatusStyle(vehicle.status)}`}>
                {vehicle.status}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Type:</span>
                <span className="text-white">{vehicle.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Capacity:</span>
                <span className="text-white">{vehicle.capacity} seats</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Health:</span>
                <span className="text-accent-green">{vehicle.healthScore}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FleetOverview;