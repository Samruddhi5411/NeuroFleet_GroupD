import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import FleetHeatmap from '../../components/FleetHeatmap';
import {
  VehicleIcon,
  RouteIcon,
  RevenueIcon,
  TrendingUpIcon,
  ChartIcon,
  AlertIcon,
} from '../../components/Icons';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const UrbanMobilityInsights = () => {
  const [kpiData, setKpiData] = useState(null);
  const [fleetDistribution, setFleetDistribution] = useState(null);
  const [hourlyActivity, setHourlyActivity] = useState(null);
  const [dailyTrends, setDailyTrends] = useState(null);
  const [vehiclePerformance, setVehiclePerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAllData();
    const interval = setInterval(() => {
      refreshData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [kpi, fleet, hourly, daily, performance] = await Promise.all([
        analyticsService.getKPIMetrics(),
        analyticsService.getFleetDistribution(),
        analyticsService.getHourlyActivity(),
        analyticsService.getDailyTrends(7),
        analyticsService.getVehiclePerformance(),
      ]);

      setKpiData(kpi.data);
      setFleetDistribution(fleet.data);
      setHourlyActivity(hourly.data);
      setDailyTrends(daily.data);
      setVehiclePerformance(performance.data);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const kpi = await analyticsService.getKPIMetrics();
      setKpiData(kpi.data);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDownloadReport = async (reportType) => {
    try {
      let response;
      let filename;

      switch (reportType) {
        case 'fleet':
          response = await analyticsService.downloadFleetReport();
          filename = `fleet-report-${Date.now()}.csv`;
          break;
        case 'bookings':
          response = await analyticsService.downloadBookingsReport();
          filename = `bookings-report-${Date.now()}.csv`;
          break;
        case 'revenue':
          response = await analyticsService.downloadRevenueReport();
          filename = `revenue-report-${Date.now()}.csv`;
          break;
        case 'trips':
          response = await analyticsService.downloadTripsReport();
          filename = `trips-report-${Date.now()}.csv`;
          break;
        case 'summary':
          response = await analyticsService.downloadSummaryReport();
          filename = `analytics-summary-${Date.now()}.csv`;
          break;
        default:
          return;
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const hourlyChartData = hourlyActivity ? {
    labels: hourlyActivity.hours.map(h => `${h}:00`),
    datasets: [
      {
        label: 'Bookings',
        data: hourlyActivity.bookingCounts,
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
      },
    ],
  } : null;

  const dailyTrendsChartData = dailyTrends ? {
    labels: dailyTrends.dates.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Daily Bookings',
        data: dailyTrends.bookings,
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  } : null;

  const revenueChartData = dailyTrends ? {
    labels: dailyTrends.dates.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Daily Revenue ($)',
        data: dailyTrends.revenue,
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
      },
    ],
  } : null;

  const typeDistributionData = fleetDistribution ? {
    labels: Object.keys(fleetDistribution.typeDistribution),
    datasets: [
      {
        data: Object.values(fleetDistribution.typeDistribution),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(220, 38, 38, 0.8)',
          'rgba(185, 28, 28, 0.8)',
          'rgba(252, 165, 165, 0.8)',
          'rgba(254, 202, 202, 0.8)',
          'rgba(254, 226, 226, 0.8)',
        ],
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#FFFFFF',
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#EF4444',
        bodyColor: '#FFFFFF',
        borderColor: 'rgba(239, 68, 68, 0.5)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: '#FFFFFF' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y: {
        ticks: { color: '#FFFFFF' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#FFFFFF',
          font: { size: 12 },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#EF4444',
        bodyColor: '#FFFFFF',
      },
    },
  };

  return (
    <div className="space-y-6 page-fade-in admin-dashboard-red">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <ChartIcon size="lg" className="text-red-500" />
            Urban Mobility Insights
          </h2>
          <p className="text-white/50">Real-time fleet analytics and urban mobility data</p>
        </div>
        <button
          onClick={() => loadAllData()}
          disabled={refreshing}
          className="btn-primary flex items-center gap-2"
        >
          <svg className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* KPI Cards */}
      {kpiData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="kpi-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/60 text-sm font-semibold mb-1">Total Fleet</p>
                <p className="text-4xl font-bold text-white">{kpiData.totalFleet}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <VehicleIcon size="md" className="text-white" />
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-red-500">Available: {kpiData.availableVehicles}</span>
              <span className="text-red-400">In Use: {kpiData.inUseVehicles}</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/60 text-sm font-semibold mb-1">Trips Today</p>
                <p className="text-4xl font-bold text-white">{kpiData.tripsToday}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <RouteIcon size="md" className="text-white" />
              </div>
            </div>
            <div className="text-sm text-red-500">
              Active Routes: {kpiData.activeRoutes}
            </div>
          </div>

          <div className="kpi-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/60 text-sm font-semibold mb-1">Total Revenue</p>
                <p className="text-4xl font-bold text-red-500">${kpiData.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <RevenueIcon size="md" className="text-white" />
              </div>
            </div>
            <div className="text-sm text-white/60">
              Today: ${kpiData.revenueToday.toFixed(2)}
            </div>
          </div>

          <div className="kpi-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/60 text-sm font-semibold mb-1">Utilization</p>
                <p className="text-4xl font-bold text-red-500">{kpiData.averageUtilization.toFixed(1)}%</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <TrendingUpIcon size="md" className="text-white" />
              </div>
            </div>
            <div className="text-sm text-red-400">
              Maintenance: {kpiData.maintenanceVehicles}
            </div>
          </div>
        </div>
      )}

      {/* Heatmap Section */}
      {fleetDistribution && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Fleet Distribution Heatmap
            </h3>
          </div>
          <FleetHeatmap data={fleetDistribution} />
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Activity */}
        {hourlyChartData && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ChartIcon size="md" className="text-red-500" />
              Hourly Rental Activity
            </h3>
            <div style={{ height: '300px' }}>
              <Bar data={hourlyChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Daily Trends */}
        {dailyTrendsChartData && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUpIcon size="md" className="text-red-500" />
              Daily Booking Trends (7 Days)
            </h3>
            <div style={{ height: '300px' }}>
              <Line data={dailyTrendsChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Revenue Chart */}
        {revenueChartData && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <RevenueIcon size="md" className="text-red-500" />
              Daily Revenue (7 Days)
            </h3>
            <div style={{ height: '300px' }}>
              <Bar data={revenueChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Type Distribution */}
        {typeDistributionData && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <VehicleIcon size="md" className="text-red-500" />
              Fleet Type Distribution
            </h3>
            <div style={{ height: '300px' }}>
              <Doughnut data={typeDistributionData} options={doughnutOptions} />
            </div>
          </div>
        )}
      </div>

      {/* Top Performers */}
      {vehiclePerformance && vehiclePerformance.topPerformers && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Top Performing Vehicles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehiclePerformance.topPerformers.slice(0, 6).map((vehicle, index) => (
              <div
                key={vehicle.vehicleId}
                className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl border border-white/5 hover:border-red-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{vehicle.model}</p>
                    <p className="text-sm text-white/50">{vehicle.vehicleId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-red-500 font-bold text-lg">${vehicle.totalRevenue}</p>
                  <p className="text-sm text-white/50">{vehicle.totalTrips} trips</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Reports Section */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Reports
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { type: 'fleet', label: 'Fleet Report', icon: VehicleIcon },
            { type: 'bookings', label: 'Bookings Report', icon: RouteIcon },
            { type: 'revenue', label: 'Revenue Report', icon: RevenueIcon },
            { type: 'trips', label: 'Trips Report', icon: RouteIcon },
            { type: 'summary', label: 'Full Summary', icon: ChartIcon },
          ].map((report) => (
            <button
              key={report.type}
              onClick={() => handleDownloadReport(report.type)}
              className="btn-secondary flex flex-col items-center gap-2 py-4"
            >
              <report.icon size="md" className="text-red-500" />
              <span className="text-sm">{report.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UrbanMobilityInsights;