import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/api';
import { BookingIcon, CalendarIcon, LocationIcon, VehicleIcon } from '../../components/Icons';
import LiveVehicleMap from '../../components/LiveVehicleMap';

const ActiveBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const username = localStorage.getItem('username');

  useEffect(() => {
    loadBookings();
    const interval = setInterval(loadBookings, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadBookings = async () => {
    try {
      const response = await bookingService.getCustomerBookings(username);
      const activeBookings = response.data.filter(b =>
        b.status === 'PENDING' || b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS'
      );
      setBookings(activeBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancel(bookingId);
        await loadBookings();
      } catch (error) {
        console.error('Error canceling booking:', error);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const handleTrackVehicle = (booking) => {
    setSelectedBooking(booking);
    setShowMap(true);
  };

  const getStatusStyle = (status) => {
    const statusMap = {
      'PENDING': 'status-maintenance',
      'CONFIRMED': 'status-available',
      'IN_PROGRESS': 'status-in-use',
    };
    return statusMap[status] || 'status-maintenance';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      'PENDING': '⏳',
      'CONFIRMED': '✅',
      'IN_PROGRESS': '🚗',
    };
    return iconMap[status] || '📋';
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;

    if (diff < 0) return 'Started';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `Starts in ${days} day${days > 1 ? 's' : ''}`;
    }
    if (hours > 0) {
      return `Starts in ${hours}h ${minutes}m`;
    }
    return `Starts in ${minutes}m`;
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
          <BookingIcon size="lg" className="text-accent-purple" />
          Active Bookings
        </h2>
        <p className="text-white/50">Track your current and upcoming bookings</p>
      </div>

      {bookings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <p className="text-white/60 text-sm font-semibold mb-2">Total Active</p>
              <p className="text-4xl font-bold text-accent-cyan">{bookings.length}</p>
            </div>
            <div className="glass-card p-6">
              <p className="text-white/60 text-sm font-semibold mb-2">In Progress</p>
              <p className="text-4xl font-bold text-accent-green">
                {bookings.filter(b => b.status === 'IN_PROGRESS').length}
              </p>
            </div>
            <div className="glass-card p-6">
              <p className="text-white/60 text-sm font-semibold mb-2">Upcoming</p>
              <p className="text-4xl font-bold text-accent-purple">
                {bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length}
              </p>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="glass-card-hover p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-white">
                          {booking.vehicle?.model || 'Vehicle'}
                        </h4>
                        <span className={`status-badge ${getStatusStyle(booking.status)}`}>
                          <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                          {getStatusIcon(booking.status)} {booking.status}
                        </span>
                        {booking.status === 'CONFIRMED' && (
                          <span className="bg-gradient-to-r from-accent-cyan to-accent-blue text-white px-3 py-1 rounded-full text-xs font-bold">
                            {getTimeRemaining(booking.startTime)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/50 mb-1">
                        Booking #{booking.id} • {booking.vehicle?.vehicleNumber}
                      </p>
                      <p className="text-sm text-white/40">
                        {booking.vehicle?.type} • {booking.vehicle?.capacity} seats •
                        {booking.vehicle?.isElectric ? ' ⚡ Electric' : ' ⛽ Fuel'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-accent-green font-bold text-3xl">
                        ${booking.totalPrice?.toFixed(2) || '0.00'}
                      </p>
                      <p className="text-white/50 text-sm mt-1">Total Cost</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 bg-dark-700/40 rounded-xl border border-white/5">
                        <CalendarIcon size="md" className="text-accent-green mt-1" />
                        <div className="flex-1">
                          <p className="text-white/60 text-sm mb-1">Start Time</p>
                          <p className="text-white font-semibold">{formatDateTime(booking.startTime)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-dark-700/40 rounded-xl border border-white/5">
                        <CalendarIcon size="md" className="text-accent-pink mt-1" />
                        <div className="flex-1">
                          <p className="text-white/60 text-sm mb-1">End Time</p>
                          <p className="text-white font-semibold">{formatDateTime(booking.endTime)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 bg-dark-700/40 rounded-xl border border-white/5">
                        <LocationIcon size="md" className="text-accent-cyan mt-1" />
                        <div className="flex-1">
                          <p className="text-white/60 text-sm mb-1">Pickup Location</p>
                          <p className="text-white font-semibold">{booking.pickupLocation || 'To be determined'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-dark-700/40 rounded-xl border border-white/5">
                        <LocationIcon size="md" className="text-accent-purple mt-1" />
                        <div className="flex-1">
                          <p className="text-white/60 text-sm mb-1">Dropoff Location</p>
                          <p className="text-white font-semibold">{booking.dropoffLocation || 'To be determined'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    {booking.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleTrackVehicle(booking)}
                        className="btn-primary flex items-center gap-2"
                      >
                        <LocationIcon size="sm" />
                        Track Vehicle Location
                      </button>
                    )}
                    <button className="btn-secondary">
                      View Details
                    </button>
                    {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="btn-secondary text-accent-pink border-accent-pink hover:bg-accent-pink/10"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="glass-card p-12 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center mx-auto mb-6">
            <BookingIcon size="xl" className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No Active Bookings</h3>
          <p className="text-white/50 text-lg mb-6">
            You don't have any active bookings at the moment.
          </p>
          <p className="text-white/40 mb-8">
            Start by booking a vehicle from the Smart Booking section
          </p>
        </div>
      )}

      {showMap && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-dark-800 rounded-2xl border border-white/10 shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Live Vehicle Tracking</h3>
                <p className="text-white/60">
                  {selectedBooking.vehicle?.model} • {selectedBooking.vehicle?.vehicleNumber}
                </p>
              </div>
              <button
                onClick={() => setShowMap(false)}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>
            <div className="h-[600px]">
              <LiveVehicleMap
                vehicles={selectedBooking.vehicle ? [selectedBooking.vehicle] : []}
                center={[40.7128, -74.0060]}
                zoom={13}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveBookings;