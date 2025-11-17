import React, { useState, useEffect } from 'react';
import { managerService } from '../../services/api';

const PendingBookings = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDriverModal, setShowDriverModal] = useState(false);

  useEffect(() => {
    fetchPendingBookings();
    fetchAvailableDrivers();
  }, []);

  const fetchPendingBookings = async () => {
    try {
      setLoading(true);
      const response = await managerService.getPendingBookings();
      setPendingBookings(response.data);
      console.log('Pending bookings loaded:', response.data);
    } catch (error) {
      console.error('Error fetching pending bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDrivers = async () => {
    try {
      const response = await managerService.getAvailableDrivers();
      setAvailableDrivers(response.data);
      console.log('Available drivers loaded:', response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      const response = await managerService.approveBooking(bookingId);
      const approvedBooking = response.data;
      console.log('Booking approved:', approvedBooking);
      setSelectedBooking(approvedBooking);
      setShowDriverModal(true);
      fetchPendingBookings();
    } catch (error) {
      console.error('Error approving booking:', error);
      alert('Failed to approve booking: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAssignDriver = async () => {
    if (!selectedDriver || !selectedBooking) {
      alert('Please select a driver');
      return;
    }

    try {
      const response = await managerService.assignDriver(selectedBooking.id, selectedDriver);
      console.log('Driver assigned:', response.data);
      alert('Driver assigned successfully!');
      setShowDriverModal(false);
      setSelectedBooking(null);
      setSelectedDriver('');
      fetchPendingBookings();
    } catch (error) {
      console.error('Error assigning driver:', error);
      alert('Failed to assign driver: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleReject = async (bookingId) => {
    if (!window.confirm('Are you sure you want to reject this booking?')) {
      return;
    }

    try {
      const { bookingService } = await import('../../services/api');
      await bookingService.cancel(bookingId);
      alert('Booking rejected successfully');
      fetchPendingBookings();
    } catch (error) {
      console.error('Error rejecting booking:', error);
      alert('Failed to reject booking: ' + (error.response?.data?.message || error.message));
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Pending Booking Approvals</h2>
        <div className="text-sm text-white/70">
          {pendingBookings.length} pending request{pendingBookings.length !== 1 ? 's' : ''}
        </div>
      </div>

      {pendingBookings.length === 0 ? (
        <div className="bg-dark-800/40 backdrop-blur-glass border border-white/10 rounded-xl p-8 text-center">
          <p className="text-white/50 text-lg">No pending bookings at the moment</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-dark-800/40 backdrop-blur-glass border border-white/10 rounded-xl p-6 hover:border-accent-purple/50 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Booking #{booking.id}
                  </h3>
                  <p className="text-sm text-white/70">
                    Customer: {booking.customer?.fullName || 'N/A'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(booking.id)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleReject(booking.id)}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300"
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-white/50 mb-1">Pickup</p>
                  <p className="text-sm text-white font-medium">{booking.pickupLocation}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">Drop-off</p>
                  <p className="text-sm text-white font-medium">{booking.dropoffLocation}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">Start Time</p>
                  <p className="text-sm text-white font-medium">{formatDateTime(booking.startTime)}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">End Time</p>
                  <p className="text-sm text-white font-medium">{formatDateTime(booking.endTime)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-white/50 mb-1">Vehicle</p>
                  <p className="text-sm text-white font-medium">
                    {booking.vehicle?.manufacturer} {booking.vehicle?.model}
                  </p>
                  <p className="text-xs text-white/40">{booking.vehicle?.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">Vehicle Type</p>
                  <p className="text-sm text-white font-medium">{booking.vehicle?.type}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">Total Price</p>
                  <p className="text-lg text-accent-purple font-bold">${booking.totalPrice?.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Driver Assignment Modal */}
      {showDriverModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-dark-800 border border-white/10 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Assign Driver</h3>
            <p className="text-white/70 mb-4">
              Booking #{selectedBooking.id} approved. Now assign a driver to this booking.
            </p>

            <div className="mb-6">
              <label className="block text-sm text-white/70 mb-2">Select Driver</label>
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="w-full bg-dark-700 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-purple"
              >
                <option value="">-- Choose a driver --</option>
                {availableDrivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.fullName} ({driver.username}) - {driver.phone}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAssignDriver}
                disabled={!selectedDriver}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-accent-purple to-accent-pink text-white rounded-lg hover:shadow-lg hover:shadow-accent-purple/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign Driver
              </button>
              <button
                onClick={() => {
                  setShowDriverModal(false);
                  setSelectedBooking(null);
                  setSelectedDriver('');
                }}
                className="px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingBookings;