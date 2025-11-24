import React from 'react';
import { ChartIcon } from '../../components/Icons';

const Reports = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white flex items-center gap-3">
        <ChartIcon size="lg" className="text-accent-purple" />
        Reports & Analytics
      </h2>
      <div className="glass-card p-6">
        <p className="text-white/50 text-center py-12">
          Reports functionality coming soon...
        </p>
      </div>
    </div>
  );
};

export default Reports;