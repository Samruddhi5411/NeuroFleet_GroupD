import React, { useState } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState({
    fullName: localStorage.getItem('fullName') || 'Customer',
    email: localStorage.getItem('email') || 'customer@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, New York, NY 10001',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('fullName', profile.fullName);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          👤 My Profile
        </h2>
        <p className="text-white/50">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 text-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-white font-bold text-5xl mx-auto mb-4">
            {profile.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{profile.fullName}</h3>
          <p className="text-white/50 text-sm mb-4">{profile.email}</p>
          <button className="btn-secondary w-full">
            Change Avatar
          </button>
        </div>

        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-6">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-semibold mb-2">
                Address
              </label>
              <textarea
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="input-field w-full"
                rows="3"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSave} className="btn-primary">
                {saved ? '✓ Saved' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-accent-green to-accent-cyan text-white px-6 py-4 rounded-xl shadow-lg animate-fade-in-up">
          <p className="font-semibold">Profile updated successfully!</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
