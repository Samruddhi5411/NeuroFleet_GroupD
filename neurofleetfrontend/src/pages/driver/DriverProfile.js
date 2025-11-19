import React, { useState, useEffect } from 'react';
import { driverService } from '../../services/api';

const DriverProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await driverService.getProfile();
      setProfile(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await driverService.updateProfile(formData);
      alert('Profile updated successfully!');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">👤 My Profile</h2>
        <p className="text-white/50">Manage your driver information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-4xl">
            👤
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{profile?.fullName}</h3>
          <p className="text-white/50 text-sm mb-4">@{profile?.username}</p>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">⭐</span>
            <span className="text-3xl font-bold text-accent-green">{profile?.rating?.toFixed(1)}</span>
          </div>
          <p className="text-white/50 text-sm">Driver Rating</p>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="text-4xl mb-2">🚗</div>
          <div className="text-3xl font-bold text-accent-cyan mb-1">{profile?.totalTrips}</div>
          <p className="text-white/50">Total Trips</p>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="text-4xl mb-2">💰</div>
          <div className="text-3xl font-bold text-accent-green mb-1">
            ${profile?.totalEarnings?.toFixed(2)}
          </div>
          <p className="text-white/50">Total Earnings</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Profile Information</h3>
          <button
            onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
            className="btn-primary"
          >
            {isEditing ? '💾 Save Changes' : '✏️ Edit Profile'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-white/60 text-sm mb-2 block">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-dark-700 border border-white/10 rounded-lg px-4 py-3 text-white"
              />
            ) : (
              <p className="text-white font-semibold">{profile?.fullName}</p>
            )}
          </div>

          <div>
            <label className="text-white/60 text-sm mb-2 block">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-dark-700 border border-white/10 rounded-lg px-4 py-3 text-white"
              />
            ) : (
              <p className="text-white font-semibold">{profile?.email}</p>
            )}
          </div>

          <div>
            <label className="text-white/60 text-sm mb-2 block">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phoneNumber || ''}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full bg-dark-700 border border-white/10 rounded-lg px-4 py-3 text-white"
              />
            ) : (
              <p className="text-white font-semibold">{profile?.phoneNumber || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="text-white/60 text-sm mb-2 block">License Number</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.licenseNumber || ''}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full bg-dark-700 border border-white/10 rounded-lg px-4 py-3 text-white"
              />
            ) : (
              <p className="text-white font-semibold">{profile?.licenseNumber || 'Not set'}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="text-white/60 text-sm mb-2 block">Address</label>
            {isEditing ? (
              <textarea
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-dark-700 border border-white/10 rounded-lg px-4 py-3 text-white"
                rows="3"
              />
            ) : (
              <p className="text-white font-semibold">{profile?.address || 'Not set'}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-6">
            <button
              onClick={() => setIsEditing(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverProfile;