import React, { useState, useEffect } from 'react';
import { driverService } from '../../services/api';
import { RevenueIcon, TrendingUpIcon } from '../../components/Icons';
import { Line } from 'react-chartjs-2';

const Earnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      const response = await driverService.getEarnings();
      setEarnings(response.data);
      console.log('✅ Earnings loaded:', response.data);
    } catch (error) {
      console.error('Error loading earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center py-12">Loading earnings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <RevenueIcon size="lg" className="text-accent-green" />
          Earnings
        </h2>
        <p className="text-white/50">Track your income and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">Total Earnings</p>
              <p className="text-3xl font-bold text-accent-green">
                ${earnings?.totalEarnings?.toFixed(2) || '0.00'}
              </p>
            </div>
            <RevenueIcon size="md" className="text-accent-green" />
          </div>
          <div className="flex items-center gap-2 text-accent-green text-sm">
            <TrendingUpIcon size="sm" />
            <span>All time</span>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">This Week</p>
              <p className="text-3xl font-bold text-accent-cyan">
                ${earnings?.thisWeekEarnings?.toFixed(2) || '0.00'}
              </p>
            </div>
            <TrendingUpIcon size="md" className="text-accent-cyan" />
          </div>
          <div className="flex items-center gap-2 text-accent-green text-sm">
            <TrendingUpIcon size="sm" />
            <span>Last 7 days</span>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">Total Trips</p>
              <p className="text-3xl font-bold text-accent-purple">
                {earnings?.totalTrips || 0}
              </p>
            </div>
            <span className="text-4xl">🚗</span>
          </div>
          <div className="text-white/50 text-sm">
            Completed deliveries
          </div>
        </div>
      </div>

      {earnings?.weeklyTrend && earnings.weeklyTrend.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Weekly Earnings Trend</h3>
          <div className="h-80">
            <Line
              data={{
                labels: earnings.weeklyTrend.map(d => d.day),
                datasets: [{
                  label: 'Daily Earnings ($)',
                  data: earnings.weeklyTrend.map(d => d.earnings),
                  borderColor: 'rgb(34, 197, 94)',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  tension: 0.4,
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#fff' } } },
                scales: {
                  y: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                  x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Earnings;
