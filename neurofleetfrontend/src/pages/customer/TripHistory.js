import React, { useState, useEffect } from 'react';
import { RouteIcon, LocationIcon } from '../../components/Icons';
import { bookingService } from '../../services/api';

const TripHistory = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username');

  useEffect(() => {
    loadTripHistory();
  }, []);

  const loadTripHistory = async () => {
    try {
      const response = await bookingService.getCustomerBookings(username);
      const completedTrips = response.data.filter(b =>
        b.status === 'COMPLETED' || b.status === 'CANCELLED'
      );
      setTrips(completedTrips);
    } catch (error) {
      console.error('Error loading trip history:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins;
  };

  const calculateDistance = (booking) => {
    return ((booking.totalPrice || 0) / 10).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <RouteIcon size="lg" className="text-accent-purple" />
          Trip History
        </h2>
        <p className="text-white/50">Review your past trips and experiences</p>
      </div>

      {trips.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <p className="text-white/60 text-sm font-semibold mb-2">Total Trips</p>
              <p className="text-4xl font-bold text-accent-cyan">{trips.length}</p>
            </div>
            <div className="glass-card p-6">
              <p className="text-white/60 text-sm font-semibold mb-2">Total Spent</p>
              <p className="text-4xl font-bold text-accent-green">
                ${trips.reduce((sum, t) => sum + (t.totalPrice || 0), 0).toFixed(2)}
              </p>
            </div>
            <div className="glass-card p-6">
              <p className="text-white/60 text-sm font-semibold mb-2">Est. Distance</p>
              <p className="text-4xl font-bold text-accent-purple">
                {trips.reduce((sum, t) => sum + parseFloat(calculateDistance(t)), 0).toFixed(1)} km
              </p>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-6">Completed Trips</h3>
            <div className="space-y-4">
              {trips.map((trip) => {
                const duration = calculateDuration(trip.startTime, trip.endTime);
                const distance = calculateDistance(trip);
                const isCancelled = trip.status === 'CANCELLED';

                return (
                  <div key={trip.id} className="glass-card-hover p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-white">Booking #{trip.id}</h4>
                          <span className={`status-badge ${isCancelled ? 'status-critical' : 'status-available'}`}>
                            {isCancelled ? '✕ Cancelled' : '✓ Completed'}
                          </span>
                        </div>
                        <p className="text-sm text-white/50 mb-3">
                          📅 {new Date(trip.startTime).toLocaleDateString()} •
                          🚗 {trip.vehicle?.model || 'N/A'} •
                          🔢 {trip.vehicle?.vehicleNumber || 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-accent-green font-bold text-2xl">
                          ${(trip.totalPrice || 0).toFixed(2)}
                        </p>
                        <p className="text-white/50 text-sm">{distance} km • {duration} min</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start gap-2">
                        <LocationIcon size="sm" className="text-accent-green mt-1" />
                        <div>
                          <p className="text-white/60 text-sm mb-1">Pickup</p>
                          <p className="text-white font-semibold">
                            {trip.pickupLocation || 'Not specified'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <LocationIcon size="sm" className="text-accent-pink mt-1" />
                        <div>
                          <p className="text-white/60 text-sm mb-1">Dropoff</p>
                          <p className="text-white font-semibold">
                            {trip.dropoffLocation || 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-3 border-t border-white/10">
                      <button className="btn-secondary text-sm px-4 py-2">
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="glass-card p-12 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center mx-auto mb-6">
            <RouteIcon size="xl" className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No Trip History</h3>
          <p className="text-white/50 text-lg mb-6">
            You haven't completed any trips yet.
          </p>
          <p className="text-white/40">
            Your completed bookings will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default TripHistory;