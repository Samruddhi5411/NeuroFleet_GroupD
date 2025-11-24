import React, { useState, useEffect } from 'react';
import { driverService } from '../../services/api';
import { RouteIcon, LocationIcon, CalendarIcon, AlertIcon } from '../../components/Icons';

const MyTrips = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem('username');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await driverService.getAssignedBookings(username);
      setBookings(response.data);
      console.log('✅ Loaded bookings:', response.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const handleStartTrip = async (bookingId) => {
    setLoading(true);
    try {
      await driverService.startTrip(bookingId);
      alert('✅ Trip started successfully!');
      await loadBookings();
    } catch (error) {
      alert('❌ Failed to start trip: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTrip = async (bookingId) => {
    if (!window.confirm('Are you sure you want to complete this trip?')) return;

    setLoading(true);
    try {
      await driverService.completeTrip(bookingId);
      alert('✅ Trip completed successfully! Payment recorded.');
      await loadBookings();
    } catch (error) {
      alert('❌ Failed to complete trip: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const map = {
      'DRIVER_ASSIGNED': 'status-maintenance',
      'DRIVER_ACCEPTED': 'status-available',
      'CONFIRMED': 'status-available',
      'IN_PROGRESS': 'status-in-use',
      'COMPLETED': 'bg-blue-500/20 border-blue-500 text-blue-400',
    };
    return map[status] || 'status-maintenance';
  };

  const activeBookings = bookings.filter(b =>
    ['DRIVER_ASSIGNED', 'DRIVER_ACCEPTED', 'CONFIRMED', 'IN_PROGRESS'].includes(b.status)
  );

  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <RouteIcon size="lg" className="text-accent-cyan" />
          My Trips
        </h2>
        <p className="text-white/50">Manage your assigned trips</p>
      </div>

      {/* Active Trips */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Active Trips ({activeBookings.length})</h3>
        {activeBookings.length > 0 ? (
          <div className="space-y-4">
            {activeBookings.map((booking) => (
              <div key={booking.id} className="glass-card-hover p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">
                      Trip #{booking.id}
                    </h4>
                    <p className="text-white/50 text-sm">
                      Customer: {booking.customer?.fullName}
                    </p>
                  </div>
                  <span className={`status-badge ${getStatusStyle(booking.status)}`}>
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                    {booking.status === 'DRIVER_ASSIGNED' ? 'NEW' : booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white/60">🚗 Vehicle:</span>
                      <span className="text-white font-semibold">
                        {booking.vehicle?.model} ({booking.vehicle?.vehicleNumber})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon size="sm" className="text-accent-cyan" />
                      <span className="text-white/60">Start:</span>
                      <span className="text-white font-semibold">
                        {new Date(booking.startTime).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <LocationIcon size="sm" className="text-accent-green mt-0.5" />
                      <div className="flex-1">
                        <p className="text-white/60 text-sm">Pickup</p>
                        <p className="text-white font-semibold text-sm">{booking.pickupLocation}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <LocationIcon size="sm" className="text-accent-pink mt-0.5" />
                      <div className="flex-1">
                        <p className="text-white/60 text-sm">Dropoff</p>
                        <p className="text-white font-semibold text-sm">{booking.dropoffLocation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <p className="text-white/60 text-sm">Trip Payment</p>
                    <p className="text-accent-green font-bold text-2xl">
                      ${booking.totalPrice?.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {booking.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleStartTrip(booking.id)}
                        disabled={loading}
                        className="btn-primary"
                      >
                        🚀 Start Trip
                      </button>
                    )}
                    {booking.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleCompleteTrip(booking.id)}
                        disabled={loading}
                        className="btn-primary bg-gradient-to-r from-accent-green to-accent-cyan"
                      >
                        ✅ Complete Trip
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <RouteIcon size="xl" className="text-white/20 mx-auto mb-4" />
            <p className="text-white/50">No active trips</p>
          </div>
        )}
      </div>

      {/* Completed Trips */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Completed Trips ({completedBookings.length})</h3>
        {completedBookings.length > 0 ? (
          <div className="space-y-3">
            {completedBookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl">
                <div>
                  <p className="text-white font-semibold">Trip #{booking.id}</p>
                  <p className="text-white/50 text-sm">
                    {new Date(booking.completedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-accent-green font-bold">${booking.totalPrice?.toFixed(2)}</p>
                  <span className="text-xs text-accent-green">Completed</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-white/50">
            No completed trips yet
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;