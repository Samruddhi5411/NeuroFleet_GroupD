import React, { useState } from 'react';

const SystemSettings = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">System Settings</h2>
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Pricing Rules</h3>
        {/* Pricing configuration */}
      </div>
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Vehicle Categories</h3>
        {/* Category management */}
      </div>
    </div>
  );
};

export default SystemSettings;