import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AssignDriver from './AssignDriver';
import { BookingIcon, VehicleIcon, LocationIcon, CalendarIcon } from '../Icons';

const PendingBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [view, setView] = useState('list'); // 'list' or 'assign'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingBookings();
    const interval = setInterval(loadPendingBookings, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const loadPendingBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:8083/api/manager/bookings/pending',
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setBookings(response.data);
      console.log('✅ Loaded', response.data.length, 'pending bookings');
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentComplete = () => {
    setSelectedBooking(null);
    setView('list');
    loadPendingBookings();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-white text-xl">Loading pending bookings...</div>
      </div>
    );
  }

  // Show assignment view
  if (view === 'assign' && selectedBooking) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">Assign Driver</h2>
          <button
            onClick={() => {
              setView('list');
              setSelectedBooking(null);
            }}
            className="btn-secondary"
          >
            ← Back to Bookings
          </button>
        </div>

        <AssignDriver
          booking={selectedBooking}
          onAssignmentComplete={handleAssignmentComplete}
          onCancel={() => {
            setView('list');
            setSelectedBooking(null);
          }}
        />
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Pending Bookings</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={loadPendingBookings}
            className="btn-secondary"
          >
            🔄 Refresh
          </button>
          <div className="glass-card px-4 py-2">
            <span className="text-white/60 text-sm">Pending: </span>
            <span className="text-white font-bold text-xl">{bookings.length}</span>
          </div>
        </div>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="glass-card p-6 hover:bg-white/5 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-white">
                    Booking #{booking.id}
                  </h4>
                  <p className="text-white/50 text-sm">
                    Customer: {booking.customer?.fullName || 'Unknown'}
                  </p>
                  <p className="text-white/40 text-xs">
                    {booking.customer?.email} • {booking.customer?.phoneNumber}
                  </p>
                </div>
                <span className="px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-bold">
                  PENDING
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Locations */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-green/20 flex items-center justify-center flex-shrink-0">
                      <LocationIcon size="sm" className="text-accent-green" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white/60 text-xs mb-1">Pickup</p>
                      <p className="text-white font-semibold text-sm">
                        {booking.pickupLocation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-pink/20 flex items-center justify-center flex-shrink-0">
                      <LocationIcon size="sm" className="text-accent-pink" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white/60 text-xs mb-1">Dropoff</p>
                      <p className="text-white font-semibold text-sm">
                        {booking.dropoffLocation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vehicle & Schedule */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-cyan/20 flex items-center justify-center flex-shrink-0">
                      <VehicleIcon size="sm" className="text-accent-cyan" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white/60 text-xs mb-1">Requested Vehicle</p>
                      <p className="text-white font-semibold text-sm">
                        {booking.vehicle?.model} ({booking.vehicle?.type})
                      </p>
                      <p className="text-white/50 text-xs">
                        {booking.vehicle?.vehicleNumber} • {booking.vehicle?.capacity} seats
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center flex-shrink-0">
                      <CalendarIcon size="sm" className="text-accent-purple" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white/60 text-xs mb-1">Scheduled Time</p>
                      <p className="text-white font-semibold text-sm">
                        {booking.startTime
                          ? new Date(booking.startTime).toLocaleString()
                          : 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Notes */}
              {booking.customerNotes && (
                <div className="mb-4 p-3 bg-dark-700/40 rounded-lg">
                  <p className="text-white/60 text-xs mb-1">Customer Notes:</p>
                  <p className="text-white text-sm">{booking.customerNotes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <p className="text-white/60 text-sm">Trip Fare</p>
                  <p className="text-accent-green font-bold text-2xl">
                    ${booking.totalPrice?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-white/50 text-xs">
                    Created: {new Date(booking.createdAt).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedBooking(booking);
                    setView('assign');
                  }}
                  className="btn-primary px-8"
                >
                  ✅ Approve & Assign Driver
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <BookingIcon size="xl" className="text-white/20 mx-auto mb-4" />
          <p className="text-white/50 mb-4">No pending bookings</p>
          <p className="text-white/30 text-sm">
            New booking requests will appear here for approval
          </p>
        </div>
      )}
    </div>
  );
};

export default PendingBookings;