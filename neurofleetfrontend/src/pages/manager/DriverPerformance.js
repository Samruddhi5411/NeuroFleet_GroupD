import React, { useState, useEffect } from 'react';
import { managerService } from '../../services/api';
import { TrendingUpIcon } from '../../components/Icons';

const DriverPerformance = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      const response = await managerService.getAvailableDrivers();
      setDrivers(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white flex items-center gap-3">
        <TrendingUpIcon size="lg" className="text-accent-green" />
        Driver Performance
      </h2>
      <div className="glass-card p-6">
        <div className="space-y-4">
          {drivers.map((driver) => (
            <div key={driver.id} className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl">
              <div>
                <h4 className="text-white font-bold">{driver.fullName}</h4>
                <p className="text-white/50 text-sm">{driver.email}</p>
              </div>
              <div className="text-right">
                <p className="text-accent-cyan font-bold">⭐ {driver.rating || 5.0}</p>
                <p className="text-white/50 text-sm">{driver.totalTrips || 0} trips</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DriverPerformance;