import React from 'react';
import { ChartIcon, RevenueIcon, TrendingUpIcon } from '../../components/Icons';

const Reports = () => {
  const reports = [
    { id: 1, title: 'Monthly Fleet Report', date: '2025-10-01', type: 'Fleet', status: 'Generated' },
    { id: 2, title: 'Driver Performance Q3', date: '2025-09-30', type: 'Performance', status: 'Generated' },
    { id: 3, title: 'Revenue Analysis', date: '2025-10-15', type: 'Financial', status: 'Pending' },
    { id: 4, title: 'Maintenance Schedule', date: '2025-10-20', type: 'Maintenance', status: 'Scheduled' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <ChartIcon size="lg" className="text-accent-cyan" />
          Reports & Analytics
        </h2>
        <p className="text-white/50">Generate and view comprehensive reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 group hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">Fleet Reports</p>
              <p className="text-3xl font-bold text-accent-cyan">12</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
              <ChartIcon size="md" className="text-white" />
            </div>
          </div>
          <button className="w-full btn-primary text-sm py-2">
            Generate New
          </button>
        </div>

        <div className="glass-card p-6 group hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">Financial Reports</p>
              <p className="text-3xl font-bold text-accent-green">8</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center">
              <RevenueIcon size="md" className="text-white" />
            </div>
          </div>
          <button className="w-full btn-primary text-sm py-2">
            Generate New
          </button>
        </div>

        <div className="glass-card p-6 group hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">Performance Reports</p>
              <p className="text-3xl font-bold text-accent-purple">15</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
              <TrendingUpIcon size="md" className="text-white" />
            </div>
          </div>
          <button className="w-full btn-primary text-sm py-2">
            Generate New
          </button>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-6">Recent Reports</h3>
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="glass-card-hover p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
                    <ChartIcon size="md" className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{report.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-white/50">
                      <span>📅 {new Date(report.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{report.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${report.status === 'Generated' ? 'bg-accent-green/20 text-accent-green' :
                      report.status === 'Pending' ? 'bg-accent-cyan/20 text-accent-cyan' :
                        'bg-accent-purple/20 text-accent-purple'
                    }`}>
                    {report.status}
                  </span>
                  {report.status === 'Generated' && (
                    <button className="btn-secondary text-sm px-4 py-2">
                      Download PDF
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
