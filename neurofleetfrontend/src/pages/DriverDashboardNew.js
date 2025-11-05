import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';
import LiveMap from './driver/LiveMap';

const DriverDashboardNew = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('trips');
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({
    todayTrips: 0,
    totalEarnings: 0,
    completedTrips: 0,
    rating: 4.8
  });
  
  const fullName = localStorage.getItem('fullName') || 'Driver';
  const username = localStorage.getItem('username');

  useEffect(() => {
    loadDriverData();
  }, []);

  const loadDriverData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Get driver's bookings from backend
      const bookingsRes = await axios.get(
        `http://localhost:8083/api/driver/trips`,
        config
      );
      
      const driverTrips = bookingsRes.data;
      setTrips(driverTrips);

      // Calculate stats from real data
      const today = new Date().toDateString();
      const todayTrips = driverTrips.filter(t => 
        new Date(t.startTime).toDateString() === today
      );
      
      const completed = driverTrips.filter(t => t.status === 'COMPLETED');
      const totalEarnings = completed.reduce((sum, t) => sum + (t.totalPrice || 0), 0);

      setStats({
        todayTrips: todayTrips.length,
        totalEarnings: totalEarnings,
        completedTrips: completed.length,
        rating: 4.8
      });
    } catch (error) {
      console.error('Error loading driver data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleStartTrip = async (tripId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8083/api/driver/trips/${tripId}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await loadDriverData();
    } catch (error) {
      console.error('Error starting trip:', error);
    }
  };

  const handleCompleteTrip = async (tripId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8083/api/driver/trips/${tripId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await loadDriverData();
    } catch (error) {
      console.error('Error completing trip:', error);
    }
  };

  const renderTrips = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          🚗 My Trips
        </h2>
        <p className="text-white/50">View and manage your assigned trips</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/60 text-sm font-semibold">Today's Trips</p>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
              📊
            </div>
          </div>
          <p className="text-4xl font-bold text-accent-cyan">{stats.todayTrips}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/60 text-sm font-semibold">Total Earnings</p>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center">
              💰
            </div>
          </div>
          <p className="text-4xl font-bold text-accent-green">₹{stats.totalEarnings.toFixed(2)}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/60 text-sm font-semibold">Completed</p>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
              ✓
            </div>
          </div>
          <p className="text-4xl font-bold text-accent-purple">{stats.completedTrips}</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-6">All Trips</h3>
        <div className="space-y-4">
          {trips.length > 0 ? (
            trips.map((trip) => (
              <div key={trip.id} className="glass-card-hover p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-white">Trip #{trip.id}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        trip.status === 'SCHEDULED' ? 'bg-purple-500/20 text-purple-400' :
                        trip.status === 'IN_PROGRESS' ? 'bg-cyan-500/20 text-cyan-400' :
                        trip.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {trip.status}
                      </span>
                    </div>
                    <p className="text-sm text-white/50">{trip.vehicle?.model || 'Vehicle'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-accent-green font-bold text-2xl">₹{trip.totalPrice?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Pickup:</p>
                    <p className="text-white font-semibold">{trip.pickupLocation || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Dropoff:</p>
                    <p className="text-white font-semibold">{trip.dropoffLocation || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Customer:</p>
                    <p className="text-white font-semibold">{trip.customer?.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Time:</p>
                    <p className="text-white font-semibold">
                      {new Date(trip.startTime).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {trip.status === 'SCHEDULED' && (
                    <button
                      onClick={() => handleStartTrip(trip.id)}
                      className="flex-1 btn-primary"
                    >
                      Start Trip
                    </button>
                  )}
                  {trip.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => handleCompleteTrip(trip.id)}
                      className="flex-1 btn-primary"
                    >
                      Complete Trip
                    </button>
                  )}
                  {trip.status === 'COMPLETED' && (
                    <button className="flex-1 btn-secondary cursor-default" disabled>
                      ✓ Trip Completed
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-white/50 text-lg">No trips assigned yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      <nav className="relative bg-dark-800/40 backdrop-blur-glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Logo size="sm" animate={false} showText={true} />
              <div className="h-8 w-px bg-white/20"></div>
              <div>
                <h1 className="text-lg font-bold text-white">🚗 Driver Portal</h1>
                <p className="text-xs text-white/50">Your Journey Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-white/70">Welcome,</p>
                <p className="text-sm font-semibold text-white">{fullName}</p>
              </div>
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 pb-3">
            <button
              onClick={() => setActiveTab('trips')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'trips'
                  ? 'bg-gradient-to-r from-accent-green to-accent-cyan text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              My Trips
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'map'
                  ? 'bg-gradient-to-r from-accent-green to-accent-cyan text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              Live Map
            </button>
          </div>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto p-6">
        {activeTab === 'trips' && renderTrips()}
        {activeTab === 'map' && <LiveMap />}
      </div>
    </div>
  );
};

export default DriverDashboardNew;