import React from 'react';
import { RevenueIcon, TrendingUpIcon, CalendarIcon } from '../../components/Icons';

const Earnings = () => {
  const earningsData = {
    today: 245.50,
    week: 1580.00,
    month: 6420.00,
    total: 28750.00,
    todayTrips: 8,
    weekTrips: 42,
    monthTrips: 156,
  };

  const dailyEarnings = [
    { day: 'Mon', amount: 220 },
    { day: 'Tue', amount: 285 },
    { day: 'Wed', amount: 195 },
    { day: 'Thu', amount: 310 },
    { day: 'Fri', amount: 270 },
    { day: 'Sat', amount: 180 },
    { day: 'Sun', amount: 120 },
  ];

  const payoutHistory = [
    { id: 1, date: '2025-10-17', amount: 1450.00, status: 'PAID' },
    { id: 2, date: '2025-10-10', amount: 1620.00, status: 'PAID' },
    { id: 3, date: '2025-10-03', amount: 1380.00, status: 'PAID' },
    { id: 4, date: '2025-09-26', amount: 1590.00, status: 'PAID' },
  ];

  const maxEarning = Math.max(...dailyEarnings.map(d => d.amount));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <RevenueIcon size="lg" className="text-accent-green" />
          My Earnings
        </h2>
        <p className="text-white/50">Track your income and payout status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 group hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">Today's Earnings</p>
              <p className="text-3xl font-bold text-accent-cyan">${earningsData.today.toFixed(2)}</p>
              <p className="text-white/50 text-sm mt-1">{earningsData.todayTrips} trips</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarIcon size="md" className="text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-accent-green text-sm">
            <TrendingUpIcon size="sm" />
            <span>+15% from yesterday</span>
          </div>
        </div>

        <div className="glass-card p-6 group hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">This Week</p>
              <p className="text-3xl font-bold text-accent-green">${earningsData.week.toFixed(2)}</p>
              <p className="text-white/50 text-sm mt-1">{earningsData.weekTrips} trips</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center group-hover:scale-110 transition-transform">
              <RevenueIcon size="md" className="text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-accent-green text-sm">
            <TrendingUpIcon size="sm" />
            <span>+8% from last week</span>
          </div>
        </div>

        <div className="glass-card p-6 group hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">This Month</p>
              <p className="text-3xl font-bold text-accent-purple">${earningsData.month.toFixed(2)}</p>
              <p className="text-white/50 text-sm mt-1">{earningsData.monthTrips} trips</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUpIcon size="md" className="text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-accent-green text-sm">
            <TrendingUpIcon size="sm" />
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="glass-card p-6 group hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">Total Earnings</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-accent-cyan to-accent-green bg-clip-text text-transparent">
                ${earningsData.total.toFixed(2)}
              </p>
              <p className="text-white/50 text-sm mt-1">All time</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan via-accent-green to-accent-purple flex items-center justify-center group-hover:scale-110 transition-transform">
              <RevenueIcon size="md" className="text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-accent-cyan text-sm">
            ⭐ <span>Top Performer</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUpIcon size="md" className="text-accent-green" />
            Weekly Earnings Trend
          </h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {dailyEarnings.map((item, index) => {
              const height = (item.amount / maxEarning) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-xs text-accent-green font-bold">${item.amount}</div>
                  <div
                    className="w-full bg-gradient-to-t from-accent-green to-accent-cyan rounded-t-lg transition-all duration-500 hover:opacity-80 relative group"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute inset-0 bg-accent-green/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg"></div>
                  </div>
                  <div className="text-xs text-white/50">{item.day}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Earnings Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl border border-white/5">
              <div>
                <p className="text-white/60 text-sm">Base Fare</p>
                <p className="text-white font-bold text-lg">$1,200.00</p>
              </div>
              <div className="text-right">
                <p className="text-accent-green text-sm font-semibold">75.9%</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl border border-white/5">
              <div>
                <p className="text-white/60 text-sm">Tips</p>
                <p className="text-white font-bold text-lg">$280.00</p>
              </div>
              <div className="text-right">
                <p className="text-accent-cyan text-sm font-semibold">17.7%</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl border border-white/5">
              <div>
                <p className="text-white/60 text-sm">Bonuses</p>
                <p className="text-white font-bold text-lg">$100.00</p>
              </div>
              <div className="text-right">
                <p className="text-accent-purple text-sm font-semibold">6.3%</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-accent-green/10 to-accent-cyan/10 border border-accent-green/30 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-accent-green text-sm font-semibold">Next Payout</p>
              <p className="text-white font-bold text-xl">${earningsData.week.toFixed(2)}</p>
            </div>
            <p className="text-white/50 text-sm">Scheduled for October 31, 2025</p>
            <button className="mt-3 w-full btn-primary">
              Request Early Payout
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Payout History</h3>
        <div className="space-y-3">
          {payoutHistory.map((payout) => (
            <div key={payout.id} className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl border border-white/5 hover:border-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center">
                  <RevenueIcon size="md" className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Payout #{payout.id}</p>
                  <p className="text-sm text-white/50">{new Date(payout.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-accent-green font-bold text-xl">${payout.amount.toFixed(2)}</p>
                <span className="status-badge status-available text-xs">
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {payout.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Earnings;
