import React from 'react';
import { AlertIcon } from '../../components/Icons';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <AlertIcon size="lg" className="text-accent-purple" />
          Settings
        </h2>
        <p className="text-white/50">Configure system settings</p>
      </div>

      <div className="glass-card p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm font-semibold mb-2">
                  System Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  defaultValue="NeuroFleetX"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-semibold mb-2">
                  Support Email
                </label>
                <input
                  type="email"
                  className="input-field"
                  defaultValue="support@neurofleetx.com"
                />
              </div>
            </div>
          </div>

          <div className="divider"></div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Pricing Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm font-semibold mb-2">
                  Base Rate (per km)
                </label>
                <input
                  type="number"
                  className="input-field"
                  defaultValue="15"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-semibold mb-2">
                  Driver Commission (%)
                </label>
                <input
                  type="number"
                  className="input-field"
                  defaultValue="70"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          <button className="btn-primary w-full">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;