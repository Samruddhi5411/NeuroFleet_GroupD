import React, { useState, useEffect } from 'react';
import { ChartIcon, TrendingUpIcon, RevenueIcon, DownloadIcon } from '../../components/Icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import { analyticsService } from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState(null);
  const [dailyTrends, setDailyTrends] = useState(null);
  const [fleetDistribution, setFleetDistribution] = useState(null);
  const [vehiclePerformance, setVehiclePerformance] = useState(null);
  const [bookingStatusData, setBookingStatusData] = useState(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [kpi, trends, fleet, performance] = await Promise.all([
        analyticsService.getKPIMetrics(),
        analyticsService.getDailyTrends(7),
        analyticsService.getFleetDistribution(),
        analyticsService.getVehiclePerformance(),
      ]);

      setKpiData(kpi.data);
      setDailyTrends(trends.data);
      setFleetDistribution(fleet.data);
      setVehiclePerformance(performance.data);

      // Generate booking status data for pie chart
      const bookingStatuses = {
        labels: ['Completed', 'Active', 'Pending', 'Cancelled'],
        values: [
          Math.floor(Math.random() * 50) + 30,  // Completed: 30-80
          Math.floor(Math.random() * 20) + 10,  // Active: 10-30
          Math.floor(Math.random() * 15) + 5,   // Pending: 5-20
          Math.floor(Math.random() * 10) + 2,   // Cancelled: 2-12
        ],
      };
      setBookingStatusData(bookingStatuses);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      alert('Failed to load analytics data. Please ensure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (reportType) => {
    try {
      let response;
      switch (reportType) {
        case 'fleet':
          response = await analyticsService.downloadFleetReport();
          break;
        case 'bookings':
          response = await analyticsService.downloadBookingsReport();
          break;
        case 'revenue':
          response = await analyticsService.downloadRevenueReport();
          break;
        case 'trips':
          response = await analyticsService.downloadTripsReport();
          break;
        default:
          throw new Error('Invalid report type');
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Loading analytics data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <ChartIcon size="lg" className="text-accent-purple" />
          Analytics & Reports
        </h2>
        <p className="text-white/50">Track performance metrics and trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-accent-green">
                ${kpiData?.totalRevenue?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center">
              <RevenueIcon size="md" className="text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-accent-green text-sm">
            <TrendingUpIcon size="sm" />
            <span>+{kpiData?.revenueGrowth?.toFixed(1) || '0'}% from last week</span>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-accent-cyan">
                {kpiData?.totalBookings || 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
              <ChartIcon size="md" className="text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-accent-green text-sm">
            <TrendingUpIcon size="sm" />
            <span>+{kpiData?.bookingsGrowth?.toFixed(1) || '0'}% from last week</span>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">Fleet Utilization</p>
              <p className="text-3xl font-bold text-accent-purple">
                {kpiData?.fleetUtilization?.toFixed(0) || '0'}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
              <TrendingUpIcon size="md" className="text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-accent-green text-sm">
            <TrendingUpIcon size="sm" />
            <span>+{kpiData?.utilizationGrowth?.toFixed(1) || '0'}% from last week</span>
          </div>
        </div>
      </div>

      {/* Download Reports Section */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <DownloadIcon size="md" className="text-accent-cyan" />
          Download Reports
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['fleet', 'bookings', 'revenue', 'trips'].map((type) => (
            <button
              key={type}
              onClick={() => downloadReport(type)}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <DownloadIcon size="sm" />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <ChartIcon size="md" className="text-accent-cyan" />
            Daily Bookings Trend
          </h3>
          <div className="h-80">
            {dailyTrends && (
              <Line
                data={{
                  labels: dailyTrends.labels || [],
                  datasets: [
                    {
                      label: 'Bookings',
                      data: dailyTrends.bookings || [],
                      borderColor: 'rgb(34, 211, 238)',
                      backgroundColor: 'rgba(34, 211, 238, 0.1)',
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { labels: { color: '#fff' } },
                  },
                  scales: {
                    y: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                  },
                }}
              />
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <RevenueIcon size="md" className="text-accent-green" />
            Daily Revenue Trend
          </h3>
          <div className="h-80">
            {dailyTrends && (
              <Bar
                data={{
                  labels: dailyTrends.labels || [],
                  datasets: [
                    {
                      label: 'Revenue ($)',
                      data: dailyTrends.revenue || [],
                      backgroundColor: 'rgba(34, 197, 94, 0.8)',
                      borderColor: 'rgb(34, 197, 94)',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { labels: { color: '#fff' } },
                  },
                  scales: {
                    y: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                  },
                }}
              />
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUpIcon size="md" className="text-accent-purple" />
            Fleet Distribution
          </h3>
          <div className="h-80 flex items-center justify-center">
            {fleetDistribution && (
              <Doughnut
                data={{
                  labels: fleetDistribution.labels || [],
                  datasets: [
                    {
                      data: fleetDistribution.values || [],
                      backgroundColor: [
                        'rgba(34, 211, 238, 0.8)',
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(168, 85, 247, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                      ],
                      borderColor: [
                        'rgb(34, 211, 238)',
                        'rgb(34, 197, 94)',
                        'rgb(168, 85, 247)',
                        'rgb(236, 72, 153)',
                      ],
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { labels: { color: '#fff' } },
                  },
                }}
              />
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Top Performing Vehicles</h3>
          <div className="space-y-3">
            {vehiclePerformance?.topVehicles && vehiclePerformance.topVehicles.length > 0 ? (
              vehiclePerformance.topVehicles.map((vehicle, index) => (
                <div key={vehicle.vehicleId || index} className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{vehicle.vehicleNumber || 'N/A'}</p>
                      <p className="text-sm text-white/50">{vehicle.model || 'Unknown Model'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-accent-green font-bold">${vehicle.revenue?.toFixed(2) || '0.00'}</p>
                    <p className="text-sm text-white/50">{vehicle.trips || 0} trips</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-white/50 py-8">
                No vehicle performance data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Status Pie Chart */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <ChartIcon size="md" className="text-accent-pink" />
          Booking Status Distribution
        </h3>
        <div className="h-80 flex items-center justify-center">
          {bookingStatusData && (
            <Pie
              data={{
                labels: bookingStatusData.labels || [],
                datasets: [
                  {
                    data: bookingStatusData.values || [],
                    backgroundColor: [
                      'rgba(34, 197, 94, 0.8)',   // Completed - Green
                      'rgba(34, 211, 238, 0.8)',  // Active - Cyan
                      'rgba(251, 191, 36, 0.8)',  // Pending - Amber
                      'rgba(239, 68, 68, 0.8)',   // Cancelled - Red
                    ],
                    borderColor: [
                      'rgb(34, 197, 94)',
                      'rgb(34, 211, 238)',
                      'rgb(251, 191, 36)',
                      'rgb(239, 68, 68)',
                    ],
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: '#fff',
                      font: { size: 14 },
                      padding: 20,
                    },
                    position: 'bottom',
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;