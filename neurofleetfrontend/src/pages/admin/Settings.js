import React, { useState, useEffect } from 'react';
import { AlertIcon, LogoutIcon } from '../../components/Icons';
import axios from 'axios';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [users, setUsers] = useState([]);
  const [showPassword, setShowPassword] = useState({});
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    maintenanceAlerts: true,
    predictiveAnalysis: true,
    autoAssignDrivers: false,
    allowOverbooking: false,
    defaultRentalRate: 10,
    maxBookingDays: 30,
    cancellationPeriod: 24,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (activeTab === 'credentials') {
      loadUsers();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8083/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const togglePasswordVisibility = (userId) => {
    setShowPassword(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const toggleUserActive = async (userId) => {
    try {
      await axios.put(`http://localhost:8083/api/admin/users/${userId}/toggle-active`);
      await loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const renderGeneralSettings = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl border border-white/5 hover:border-white/10 transition-all">
              <div>
                <p className="font-semibold text-white">Email Notifications</p>
                <p className="text-sm text-white/50">Receive updates via email</p>
              </div>
              <label className="relative inline-block w-14 h-7">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-dark-700 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-accent-cyan peer-checked:to-accent-blue transition-all cursor-pointer">
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.emailNotifications ? 'translate-x-7' : ''}`}></div>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl border border-white/5 hover:border-white/10 transition-all">
              <div>
                <p className="font-semibold text-white">SMS Notifications</p>
                <p className="text-sm text-white/50">Receive updates via SMS</p>
              </div>
              <label className="relative inline-block w-14 h-7">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={() => handleToggle('smsNotifications')}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-dark-700 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-accent-cyan peer-checked:to-accent-blue transition-all cursor-pointer">
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.smsNotifications ? 'translate-x-7' : ''}`}></div>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl border border-white/5 hover:border-white/10 transition-all">
              <div>
                <p className="font-semibold text-white">Maintenance Alerts</p>
                <p className="text-sm text-white/50">Get notified about vehicle maintenance</p>
              </div>
              <label className="relative inline-block w-14 h-7">
                <input
                  type="checkbox"
                  checked={settings.maintenanceAlerts}
                  onChange={() => handleToggle('maintenanceAlerts')}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-dark-700 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-accent-cyan peer-checked:to-accent-blue transition-all cursor-pointer">
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.maintenanceAlerts ? 'translate-x-7' : ''}`}></div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">AI & Automation</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl border border-white/5 hover:border-white/10 transition-all">
              <div>
                <p className="font-semibold text-white flex items-center gap-2">
                  Predictive Analysis
                  <span className="px-2 py-0.5 bg-accent-pink/20 text-accent-pink text-xs font-bold rounded-full">AI</span>
                </p>
                <p className="text-sm text-white/50">Enable AI-powered maintenance predictions</p>
              </div>
              <label className="relative inline-block w-14 h-7">
                <input
                  type="checkbox"
                  checked={settings.predictiveAnalysis}
                  onChange={() => handleToggle('predictiveAnalysis')}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-dark-700 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-accent-purple peer-checked:to-accent-pink transition-all cursor-pointer">
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.predictiveAnalysis ? 'translate-x-7' : ''}`}></div>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl border border-white/5 hover:border-white/10 transition-all">
              <div>
                <p className="font-semibold text-white">Auto-Assign Drivers</p>
                <p className="text-sm text-white/50">Automatically assign available drivers</p>
              </div>
              <label className="relative inline-block w-14 h-7">
                <input
                  type="checkbox"
                  checked={settings.autoAssignDrivers}
                  onChange={() => handleToggle('autoAssignDrivers')}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-dark-700 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-accent-purple peer-checked:to-accent-pink transition-all cursor-pointer">
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.autoAssignDrivers ? 'translate-x-7' : ''}`}></div>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl border border-white/5 hover:border-white/10 transition-all">
              <div>
                <p className="font-semibold text-white">Allow Overbooking</p>
                <p className="text-sm text-white/50">Permit bookings exceeding fleet capacity</p>
              </div>
              <label className="relative inline-block w-14 h-7">
                <input
                  type="checkbox"
                  checked={settings.allowOverbooking}
                  onChange={() => handleToggle('allowOverbooking')}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-dark-700 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-accent-purple peer-checked:to-accent-pink transition-all cursor-pointer">
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.allowOverbooking ? 'translate-x-7' : ''}`}></div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Booking Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm font-semibold mb-2">
                Default Rental Rate ($/hour)
              </label>
              <input
                type="number"
                value={settings.defaultRentalRate}
                onChange={(e) => handleChange('defaultRentalRate', parseInt(e.target.value))}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-semibold mb-2">
                Maximum Booking Days
              </label>
              <input
                type="number"
                value={settings.maxBookingDays}
                onChange={(e) => handleChange('maxBookingDays', parseInt(e.target.value))}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-semibold mb-2">
                Cancellation Period (hours before)
              </label>
              <input
                type="number"
                value={settings.cancellationPeriod}
                onChange={(e) => handleChange('cancellationPeriod', parseInt(e.target.value))}
                className="input-field w-full"
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">System Information</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl border border-white/5">
              <span className="text-white/60">Version</span>
              <span className="text-white font-semibold">1.0.0</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl border border-white/5">
              <span className="text-white/60">Database</span>
              <span className="text-white font-semibold">SQLite</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl border border-white/5">
              <span className="text-white/60">Last Backup</span>
              <span className="text-white font-semibold">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl border border-white/5">
              <span className="text-white/60">Server Status</span>
              <span className="flex items-center gap-2 text-accent-green font-semibold">
                <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
                Online
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => setSettings({
            emailNotifications: true,
            smsNotifications: false,
            maintenanceAlerts: true,
            predictiveAnalysis: true,
            autoAssignDrivers: false,
            allowOverbooking: false,
            defaultRentalRate: 10,
            maxBookingDays: 30,
            cancellationPeriod: 24,
          })}
          className="btn-secondary"
        >
          Reset to Defaults
        </button>
        <button
          onClick={handleSave}
          className="btn-primary flex items-center gap-2"
        >
          {saved ? '✓ Saved' : 'Save Settings'}
        </button>
      </div>
    </>
  );

  const renderUserCredentials = () => {
    const roleGroups = {
      ADMIN: users.filter(u => u.role === 'ADMIN'),
      MANAGER: users.filter(u => u.role === 'MANAGER'),
      DRIVER: users.filter(u => u.role === 'DRIVER'),
      CUSTOMER: users.filter(u => u.role === 'CUSTOMER'),
    };

    return (
      <div className="space-y-6">
        <div className="glass-card p-6 bg-gradient-to-br from-accent-pink/10 to-accent-purple/10 border-accent-pink/30">
          <div className="flex items-start gap-3">
            <AlertIcon size="md" className="text-accent-pink mt-1" />
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Security Notice</h3>
              <p className="text-white/70 text-sm">
                This section displays sensitive login credentials for all portal users.
                Keep this information secure and only share with authorized personnel.
              </p>
            </div>
          </div>
        </div>

        {Object.entries(roleGroups).map(([role, roleUsers]) => (
          roleUsers.length > 0 && (
            <div key={role} className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${role === 'ADMIN' ? 'bg-accent-pink/20 text-accent-pink' :
                  role === 'MANAGER' ? 'bg-accent-cyan/20 text-accent-cyan' :
                    role === 'DRIVER' ? 'bg-accent-blue/20 text-accent-blue' :
                      'bg-accent-green/20 text-accent-green'
                  }`}>
                  {role}
                </span>
                <span className="text-white/50 text-sm">({roleUsers.length} users)</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-white/70 font-semibold text-sm">Full Name</th>
                      <th className="text-left py-3 px-4 text-white/70 font-semibold text-sm">Username</th>
                      <th className="text-left py-3 px-4 text-white/70 font-semibold text-sm">Email</th>
                      <th className="text-left py-3 px-4 text-white/70 font-semibold text-sm">Password</th>
                      <th className="text-left py-3 px-4 text-white/70 font-semibold text-sm">Status</th>
                      <th className="text-left py-3 px-4 text-white/70 font-semibold text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roleUsers.map((user) => (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                        <td className="py-4 px-4">
                          <span className="text-white font-semibold">{user.fullName}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-white/90 font-mono text-sm">{user.username}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-white/70 text-sm">{user.email}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-white/90 font-mono text-sm">
                              {showPassword[user.id] ? user.password : '••••••••'}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(user.id)}
                              className="text-accent-cyan hover:text-accent-blue transition-colors text-xs"
                            >
                              {showPassword[user.id] ? '👁️ Hide' : '👁️ Show'}
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.active ? 'bg-accent-green/20 text-accent-green' : 'bg-red-500/20 text-red-400'
                            }`}>
                            {user.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => toggleUserActive(user.id)}
                            className="btn-secondary text-xs py-1 px-3"
                          >
                            {user.active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ))}

        {users.length === 0 && (
          <div className="glass-card p-12 text-center">
            <LogoutIcon size="xl" className="text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">No users found</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <AlertIcon size="lg" className="text-accent-pink" />
          System Settings
        </h2>
        <p className="text-white/50">Configure system preferences and manage user credentials</p>
      </div>

      <div className="glass-card p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'general'
              ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-white shadow-lg shadow-accent-cyan/30'
              : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
          >
            General Settings
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'credentials'
              ? 'bg-gradient-to-r from-accent-pink to-accent-purple text-white shadow-lg shadow-accent-pink/30'
              : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
          >
            <LogoutIcon size="sm" />
            User Credentials
          </button>
        </div>
      </div>

      {activeTab === 'general' && renderGeneralSettings()}
      {activeTab === 'credentials' && renderUserCredentials()}

      {saved && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-accent-green to-accent-cyan text-white px-6 py-4 rounded-xl shadow-lg animate-fade-in-up">
          <p className="font-semibold">Settings saved successfully!</p>
        </div>
      )}
    </div>
  );
};

export default Settings;
