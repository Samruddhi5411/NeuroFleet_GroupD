import React from 'react';
import { TrendingUpIcon } from '../../components/Icons';

const DriverPerformance = () => {
  const drivers = [
    { id: 1, name: 'John Driver', trips: 156, rating: 4.8, revenue: 12450, onTime: 94, issues: 2 },
    { id: 2, name: 'Jane Driver', trips: 142, rating: 4.9, revenue: 11380, onTime: 97, issues: 1 },
    { id: 3, name: 'Mike Driver', trips: 89, rating: 4.5, revenue: 7120, onTime: 88, issues: 5 },
    { id: 4, name: 'Sarah Driver', trips: 128, rating: 4.7, revenue: 10240, onTime: 92, issues: 3 },
  ];

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
            {(drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1)} ⭐
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
            {(drivers.reduce((sum, d) => sum + d.onTime, 0) / drivers.length).toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-6">Driver Leaderboard</h3>
        <div className="space-y-4">
          {drivers.sort((a, b) => b.rating - a.rating).map((driver, index) => (
            <div key={driver.id} className="glass-card-hover p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-white font-bold text-lg">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-1">{driver.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <span>⭐ {driver.rating}</span>
                    <span>🚗 {driver.trips} trips</span>
                    <span>💰 ${driver.revenue}</span>
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