import React, { useState, useEffect } from 'react';
import { TrendingUpIcon } from '../../components/Icons';
import { userService } from '../../services/api';

const DriverPerformance = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      const response = await userService.getByRole('DRIVER');

      // Add mock performance data to real drivers
      const driversWithPerformance = response.data.map((driver, index) => ({
        ...driver,
        trips: Math.floor(Math.random() * 100) + 50,
        rating: (4.5 + Math.random() * 0.5).toFixed(1),
        revenue: Math.floor(Math.random() * 5000) + 7000,
        onTime: Math.floor(Math.random() * 20) + 80,
        issues: Math.floor(Math.random() * 5),
      }));

      setDrivers(driversWithPerformance);
    } catch (error) {
      console.error('Error loading drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center p-12">Loading drivers...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <TrendingUpIcon size="lg" className="text-accent-purple" />
          Driver Performance
        </h2>
        <p className="text-white/50">Track and analyze driver metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm font-semibold mb-2">Total Drivers</p>
          <p className="text-4xl font-bold text-accent-cyan">{drivers.length}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm font-semibold mb-2">Avg Rating</p>
          <p className="text-4xl font-bold text-accent-green">
            {drivers.length > 0 ? (drivers.reduce((sum, d) => sum + parseFloat(d.rating), 0) / drivers.length).toFixed(1) : '0.0'} ⭐
          </p>
        </div>
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm font-semibold mb-2">Total Trips</p>
          <p className="text-4xl font-bold text-accent-purple">
            {drivers.reduce((sum, d) => sum + d.trips, 0)}
          </p>
        </div>
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm font-semibold mb-2">Avg On-Time</p>
          <p className="text-4xl font-bold text-accent-pink">
            {drivers.length > 0 ? Math.floor(drivers.reduce((sum, d) => sum + d.onTime, 0) / drivers.length) : 0}%
          </p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-6">Driver Leaderboard</h3>
        <div className="space-y-4">
          {drivers.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).map((driver, index) => (
            <div key={driver.id} className="glass-card-hover p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-white font-bold text-lg">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-1">{driver.fullName}</h4>
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <span>⭐ {driver.rating}</span>
                    <span>🚗 {driver.trips} trips</span>
                    <span>💰 ₹{driver.revenue.toLocaleString()}</span>
                    <span>📞 {driver.phone}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white/60 text-sm">On-Time:</span>
                    <span className="text-accent-green font-bold">{driver.onTime}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-sm">Issues:</span>
                    <span className={`font-bold ${driver.issues > 3 ? 'text-accent-pink' : 'text-accent-cyan'}`}>
                      {driver.issues}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DriverPerformance;