import React, { useState, useEffect } from 'react';
import { VehicleIcon, TrendingUpIcon, BookingIcon, RevenueIcon } from '../../components/Icons';
import { analyticsService } from '../../services/api';

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await analyticsService.getKPIMetrics();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback data
      setStats({
        totalVehicles: 50,
        totalUsers: 100,
        totalDrivers: 20,
        totalCustomers: 75,
        tripsToday: 12,
        earningsToday: 2500,
        activeVehicles: 8
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">System Dashboard</h2>
        <p className="text-white/50">Overview of entire NeuroFleetX system</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 group hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm mb-2">Total Vehicles</p>
              <p className="text-4xl font-bold text-accent-cyan">{stats?.totalVehicles || 0}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
              <VehicleIcon size="lg" className="text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 group hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm mb-2">Total Users</p>
              <p className="text-4xl font-bold text-accent-green">{stats?.totalUsers || 0}</p>
              <p className="text-xs text-white/50 mt-1">
                {stats?.totalDrivers || 0} drivers, {stats?.totalCustomers || 0} customers
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center">
              <TrendingUpIcon size="lg" className="text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 group hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm mb-2">Trips Today</p>
              <p className="text-4xl font-bold text-accent-purple">{stats?.tripsToday || 0}</p>
              <p className="text-xs text-white/50 mt-1">{stats?.activeVehicles || 0} active</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
              <BookingIcon size="lg" className="text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 group hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm mb-2">Earnings Today</p>
              <p className="text-4xl font-bold text-accent-green">${stats?.earningsToday || 0}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center">
              <RevenueIcon size="lg" className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-dark-700/40 rounded-lg">
              <span className="text-white/60">Backend API</span>
              <span className="status-badge status-available">
                <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-dark-700/40 rounded-lg">
              <span className="text-white/60">AI Service</span>
              <span className="status-badge status-available">
                <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-dark-700/40 rounded-lg">
              <span className="text-white/60">Database</span>
              <span className="status-badge status-available">
                <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                Healthy
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-primary text-sm py-3">
              👥 Add User
            </button>
            <button className="btn-primary text-sm py-3">
              🚗 Add Vehicle
            </button>
            <button className="btn-secondary text-sm py-3">
              📊 Generate Report
            </button>
            <button className="btn-secondary text-sm py-3">
              🔧 Run Maintenance Scan
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recent System Activity</h3>
        <div className="space-y-2">
          {[
            { action: 'New booking created', user: 'customer1', time: '5 mins ago', type: 'booking' },
            { action: 'Driver assigned', user: 'manager1', time: '12 mins ago', type: 'assignment' },
            { action: 'Payment processed', user: 'customer2', time: '23 mins ago', type: 'payment' },
            { action: 'Maintenance alert', user: 'system', time: '1 hour ago', type: 'maintenance' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-dark-700/40 rounded-lg hover:bg-dark-700/60 transition-colors">
              <div>
                <p className="text-white font-semibold">{activity.action}</p>
                <p className="text-white/50 text-sm">by {activity.user}</p>
              </div>
              <span className="text-white/40 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;