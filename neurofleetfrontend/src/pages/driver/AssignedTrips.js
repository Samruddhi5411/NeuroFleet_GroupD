import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TripControl from './TripControl';
import { RouteIcon, CalendarIcon, LocationIcon, VehicleIcon } from '../Icons';

const AssignedTrips = () => {
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' or 'active'
  const username = localStorage.getItem('username');

  useEffect(() => {
    loadTrips();
    const interval = setInterval(loadTrips, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const loadTrips = async () => {
    try {
      const token = localStorage.getItem('token');

      // Load all driver trips
      const tripsResponse = await axios.get(
        `http://localhost:8083/api/trips/driver?username=${username}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setTrips(tripsResponse.data);

      // Find active trip
      const active = tripsResponse.data.find(t =>
        t.status === 'PENDING' || t.status === 'ONGOING'
      );

      if (active) {
        setActiveTrip(active);
        if (!selectedTrip) {
          setSelectedTrip(active);
          setView('active');
        }
      }

      console.log('✅ Loaded', tripsResponse.data.length, 'trips for driver');
    } catch (error) {
      console.error('Failed to load trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTripUpdate = (updatedTrip) => {
    setTrips(trips.map(t => t.id === updatedTrip.id ? updatedTrip : t));
    setActiveTrip(updatedTrip.status === 'COMPLETED' ? null : updatedTrip);
    setSelectedTrip(updatedTrip);
    loadTrips(); // Refresh list
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-white text-xl">Loading trips...</div>
      </div>
    );
  }

  // Show active trip control if there's an active trip
  if (view === 'active' && selectedTrip) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">Active Trip</h2>
          <button
            onClick={() => setView('list')}
            className="btn-secondary"
          >
            ← Back to All Trips
          </button>
        </div>

        <TripControl
          trip={selectedTrip}
          onTripUpdate={handleTripUpdate}
        />
      </div>
    );
  }

  // List view
  const pendingTrips = trips.filter(t => t.status === 'PENDING');
  const ongoingTrips = trips.filter(t => t.status === 'ONGOING');
  const completedTrips = trips.filter(t => t.status === 'COMPLETED');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">My Trips</h2>
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-sm">Total: {trips.length}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Pending</span>
            <RouteIcon size="md" className="text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-yellow-400">{pendingTrips.length}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Ongoing</span>
            <RouteIcon size="md" className="text-accent-green" />
          </div>
          <p className="text-3xl font-bold text-accent-green">{ongoingTrips.length}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Completed</span>
            <RouteIcon size="md" className="text-accent-cyan" />
          </div>
          <p className="text-3xl font-bold text-accent-cyan">{completedTrips.length}</p>
        </div>
      </div>

      {/* Active Trip Alert */}
      {activeTrip && (
        <div className="glass-card p-6 border-2 border-accent-green">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-accent-green mb-2">
                🚗 Active Trip #{activeTrip.id}
              </h3>
              <p className="text-white/70">
                {activeTrip.booking?.pickupLocation} → {activeTrip.booking?.dropoffLocation}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedTrip(activeTrip);
                setView('active');
              }}
              className="btn-primary"
            >
              View Trip →
            </button>
          </div>
        </div>
      )}

      {/* Trips List */}
      {trips.length > 0 ? (
        <div className="space-y-3">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="glass-card p-6 hover:bg-white/5 transition-all cursor-pointer"
              onClick={() => {
                setSelectedTrip(trip);
                setView('active');
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-white">Trip #{trip.id}</h4>
                  <p className="text-white/50 text-sm">
                    Customer: {trip.customer?.fullName || 'Unknown'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${trip.status === 'ONGOING' ? 'bg-accent-green/20 text-accent-green' :
                    trip.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                      trip.status === 'COMPLETED' ? 'bg-accent-blue/20 text-accent-blue' :
                        'bg-red-500/20 text-red-400'
                  }`}>
                  {trip.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <LocationIcon size="sm" className="text-accent-green" />
                    <span className="text-white/60">Pickup:</span>
                    <span className="text-white font-semibold">
                      {trip.pickupLocation || trip.booking?.pickupLocation || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <LocationIcon size="sm" className="text-accent-pink" />
                    <span className="text-white/60">Dropoff:</span>
                    <span className="text-white font-semibold">
                      {trip.dropoffLocation || trip.booking?.dropoffLocation || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <VehicleIcon size="sm" className="text-accent-cyan" />
                    <span className="text-white/60">Vehicle:</span>
                    <span className="text-white font-semibold">
                      {trip.vehicle?.vehicleNumber || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon size="sm" className="text-accent-cyan" />
                    <span className="text-white/60">Scheduled:</span>
                    <span className="text-white font-semibold">
                      {trip.scheduledStartTime
                        ? new Date(trip.scheduledStartTime).toLocaleString()
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <p className="text-white/60 text-sm">Earnings</p>
                  <p className="text-accent-green font-bold text-xl">
                    ${trip.driverEarnings?.toFixed(2) || '0.00'}
                  </p>
                </div>

                {trip.status === 'COMPLETED' && trip.customerRating && (
                  <div className="text-right">
                    <p className="text-white/60 text-sm">Rating</p>
                    <p className="text-accent-cyan font-bold">
                      {'⭐'.repeat(trip.customerRating)} ({trip.customerRating}/5)
                    </p>
                  </div>
                )}

                {(trip.status === 'PENDING' || trip.status === 'ONGOING') && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTrip(trip);
                      setView('active');
                    }}
                    className="btn-primary"
                  >
                    {trip.status === 'PENDING' ? 'Start Trip' : 'View Trip'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <RouteIcon size="xl" className="text-white/20 mx-auto mb-4" />
          <p className="text-white/50 mb-4">No trips assigned yet</p>
          <p className="text-white/30 text-sm">
            Trips will appear here when a manager assigns them to you
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignedTrips;