import React, { useState, useEffect } from 'react';
import { driverService } from '../../services/api';

const DriverProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await driverService.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white text-center py-12">Loading profile...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Driver Profile</h2>
        <p className="text-white/50">Your account information</p>
      </div>

      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-white/60 text-sm mb-1">Full Name</p>
            <p className="text-white font-bold text-lg">{profile?.fullName}</p>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">Email</p>
            <p className="text-white font-bold text-lg">{profile?.email}</p>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">Phone</p>
            <p className="text-white font-bold text-lg">{profile?.phoneNumber || 'N/A'}</p>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">Rating</p>
            <p className="text-accent-cyan font-bold text-lg">⭐ {profile?.rating || 5.0}</p>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">Total Trips</p>
            <p className="text-white font-bold text-lg">{profile?.totalTrips || 0}</p>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">Total Earnings</p>
            <p className="text-accent-green font-bold text-lg">
              ${profile?.totalEarnings?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;