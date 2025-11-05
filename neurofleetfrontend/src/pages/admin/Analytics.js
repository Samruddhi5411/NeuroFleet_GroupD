import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChartIcon, TrendingUpIcon, RevenueIcon } from '../../components/Icons';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    fleetUtilization: 0
  });

  const [chartData, setChartData] = useState({
    bookings: [12, 19, 15, 25, 22, 30, 28],
    revenue: [1200, 1900, 1500, 2500, 2200, 3000, 2800],
    fleet: [85, 88, 82, 90, 87, 92, 89],
  });

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/admin/analytics/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAnalytics({
        totalRevenue: response.data.totalRevenue || 15200,
        totalBookings: response.data.activeTrips || 151,
        fleetUtilization: 88
      });

      // Simulate weekly data
      const baseBookings = response.data.activeTrips || 20;
      const baseRevenue = response.data.totalRevenue || 2000;

      setChartData({
        bookings: Array.from({ length: 7 }, () => Math.floor(baseBookings + Math.random() * 10)),
        revenue: Array.from({ length: 7 }, () => Math.floor(baseRevenue + Math.random() * 500)),
        fleet: Array.from({ length: 7 }, () => Math.floor(80 + Math.random() * 15))
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <ChartIcon size="lg" className="text-accent-purple" />
          Analytics & Reports
        </h2>
        <p className="text-white/50">Track performance metrics and trends</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-accent-green">${analytics.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center">
              <RevenueIcon size="md" className="text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-accent-green text-sm">
            <TrendingUpIcon size="sm" />
            <span>+12.5% from last week</span>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-accent-cyan">{analytics.totalBookings}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
              <ChartIcon size="md" className="text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-accent-green text-sm">
            <TrendingUpIcon size="sm" />
            <span>+8.3% from last week</span>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">Fleet Utilization</p>
              <p className="text-3xl font-bold text-accent-purple">{analytics.fleetUtilization}%</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
              <TrendingUpIcon size="md" className="text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-accent-green text-sm">
            <TrendingUpIcon size="sm" />
            <span>+3.2% from last week</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <ChartIcon size="md" className="text-accent-cyan" />
            Bookings Trend
          </h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {chartData.bookings.map((value, index) => {
              const maxValue = Math.max(...chartData.bookings);
              const height = (value / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-xs text-accent-cyan font-bold">{value}</div>
                  <div
                    className="w-full bg-gradient-to-t from-accent-cyan to-accent-blue rounded-t-lg transition-all duration-500 hover:opacity-80 relative group"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute inset-0 bg-accent-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg"></div>
                  </div>
                  <div className="text-xs text-white/50">{days[index]}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <RevenueIcon size="md" className="text-accent-green" />
            Revenue Trend
          </h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {chartData.revenue.map((value, index) => {
              const maxValue = Math.max(...chartData.revenue);
              const height = (value / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-xs text-accent-green font-bold">${(value / 1000).toFixed(1)}k</div>
                  <div
                    className="w-full bg-gradient-to-t from-accent-green to-accent-cyan rounded-t-lg transition-all duration-500 hover:opacity-80 relative group"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute inset-0 bg-accent-green/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg"></div>
                  </div>
                  <div className="text-xs text-white/50">{days[index]}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUpIcon size="md" className="text-accent-purple" />
            Fleet Performance
          </h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {chartData.fleet.map((value, index) => {
              const maxValue = 100;
              const height = (value / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-xs text-accent-purple font-bold">{value}%</div>
                  <div
                    className="w-full bg-gradient-to-t from-accent-purple to-accent-pink rounded-t-lg transition-all duration-500 hover:opacity-80 relative group"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute inset-0 bg-accent-purple/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg"></div>
                  </div>
                  <div className="text-xs text-white/50">{days[index]}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Top Performing Vehicles</h3>
          <div className="space-y-3">
            {[
              { id: 'MH-01-AB-1000', model: 'Maruti Swift', trips: 45, revenue: 4500 },
              { id: 'DL-02-CD-2000', model: 'Hyundai Creta', trips: 38, revenue: 3800 },
              { id: 'KA-12-EF-3000', model: 'Tata Nexon EV', trips: 36, revenue: 3600 },
              { id: 'MH-14-GH-4000', model: 'Toyota Fortuner', trips: 32, revenue: 3200 },
            ].map((vehicle, index) => (
              <div key={vehicle.id} className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{vehicle.model}</p>
                    <p className="text-sm text-white/50">{vehicle.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-accent-green font-bold">₹{vehicle.revenue}</p>
                  <p className="text-sm text-white/50">{vehicle.trips} trips</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;