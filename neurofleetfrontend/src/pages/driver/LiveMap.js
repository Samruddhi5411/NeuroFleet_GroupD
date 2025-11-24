import React from 'react';
import { LocationIcon } from '../../components/Icons';

const LiveMap = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <LocationIcon size="lg" className="text-accent-cyan" />
          Live Map
        </h2>
        <p className="text-white/50">Track your location in real-time</p>
      </div>

      <div className="glass-card p-6">
        <div className="aspect-video bg-dark-700/40 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <LocationIcon size="xl" className="text-white/20 mx-auto mb-4" />
            <p className="text-white/50">Map view coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;