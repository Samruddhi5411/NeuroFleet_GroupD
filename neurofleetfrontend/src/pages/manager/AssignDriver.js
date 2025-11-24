import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { VehicleIcon, LocationIcon, CalendarIcon } from '../Icons';

const AssignDriver = ({ booking, onAssignmentComplete, onCancel }) => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    loadAvailableDrivers();
  }, []);

  const loadAvailableDrivers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:8083/api/manager/drivers/available',
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      // Filter drivers based on vehicle type if needed
      let filteredDrivers = response.data;

      // In production, filter by:
      // - Driver has license for this vehicle type
      // - Driver is currently active
      // - Driver doesn't have an ongoing trip
      filteredDrivers = filteredDrivers.filter(d => d.active);

      setDrivers(filteredDrivers);
      console.log('✅ Found', filteredDrivers.length, 'available drivers');
    } catch (error) {
      console.error('Failed to load drivers:', error);
      alert('Failed to load available drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAndAssign = async () => {
    if (!selectedDriver) {
      alert('Please select a driver first!');
      return;
    }

    setApproving(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Step 1: Approve booking
      console.log('📋 Approving booking:', booking.id);
      await axios.put(
        `http://localhost:8083/api/manager/bookings/${booking.id}/approve`,
        {},
        { headers }
      );

      // Step 2: Assign driver
      console.log('👨‍✈️ Assigning driver:', selectedDriver.id);
      await axios.put(
        `http://localhost:8083/api/manager/bookings/${booking.id}/assign-driver?driverId=${selectedDriver.id}`,
        {},
        { headers }
      );

      alert(`✅ Booking approved and assigned to ${selectedDriver.fullName}!`);
      onAssignmentComplete();
    } catch (error) {
      console.error('Assignment failed:', error);
      alert('❌ Failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setApproving(false);
    }
  };

  if (!booking) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-white/50">No booking selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Booking Details */}
      <div className="glass-card p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Booking Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-white/60 text-sm mb-1">Customer</p>
            <p className="text-white font-bold text-lg">
              {booking.customer?.fullName || 'Unknown'}
            </p>
            <p className="text-white/50 text-sm">
              {booking.customer?.email || 'No email'}
            </p>
          </div>

          <div>
            <p className="text-white/60 text-sm mb-1">Requested Vehicle</p>
            <p className="text-white font-bold text-lg">
              {booking.vehicle?.model || 'N/A'}
            </p>
            <p className="text-white/50 text-sm">
              {booking.vehicle?.type} • {booking.vehicle?.capacity} seats
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-green/20 flex items-center justify-center flex-shrink-0">
              <LocationIcon size="sm" className="text-accent-green" />
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">Pickup Location</p>
              <p className="text-white font-semibold">{booking.pickupLocation}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-pink/20 flex items-center justify-center flex-shrink-0">
              <LocationIcon size="sm" className="text-accent-pink" />
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">Dropoff Location</p>
              <p className="text-white font-semibold">{booking.dropoffLocation}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-cyan/20 flex items-center justify-center flex-shrink-0">
              <CalendarIcon size="sm" className="text-accent-cyan" />
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">Scheduled Time</p>
              <p className="text-white font-semibold">
                {booking.startTime ? new Date(booking.startTime).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Trip Fare</p>
              <p className="text-accent-green font-bold text-2xl">
                ${booking.totalPrice?.toFixed(2) || '0.00'}
              </p>
            </div>
            <span className="px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-400 font-bold">
              PENDING APPROVAL
            </span>
          </div>
        </div>
      </div>

      {/* Driver Selection */}
      <div className="glass-card p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Select Driver</h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan mx-auto"></div>
            <p className="text-white/50 mt-4">Loading available drivers...</p>
          </div>
        ) : drivers.length > 0 ? (
          <div className="space-y-3">
            {drivers.map((driver) => (
              <div
                key={driver.id}
                className={`p-4 rounded-xl cursor-pointer transition-all ${selectedDriver?.id === driver.id
                    ? 'bg-accent-cyan/20 border-2 border-accent-cyan'
                    : 'bg-dark-700/40 border-2 border-transparent hover:bg-dark-700/60'
                  }`}
                onClick={() => setSelectedDriver(driver)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-white font-bold text-lg">
                      {driver.fullName?.split(' ').map(n => n[0]).join('') || '?'}
                    </div>

                    <div>
                      <h4 className="text-white font-bold">{driver.fullName}</h4>
                      <div className="flex items-center gap-3 text-sm mt-1">
                        <span className="text-accent-cyan font-semibold">
                          ⭐ {driver.rating?.toFixed(1) || '5.0'}
                        </span>
                        <span className="text-white/50">•</span>
                        <span className="text-white/60">
                          {driver.totalTrips || 0} trips
                        </span>
                        <span className="text-white/50">•</span>
                        <span className={`font-semibold ${driver.active ? 'text-accent-green' : 'text-red-400'
                          }`}>
                          {driver.active ? '🟢 Available' : '🔴 Offline'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedDriver?.id === driver.id && (
                    <div className="w-8 h-8 rounded-full bg-accent-cyan flex items-center justify-center">
                      <span className="text-white text-xl">✓</span>
                    </div>
                  )}
                </div>

                {driver.phoneNumber && (
                  <p className="text-white/50 text-sm mt-2 ml-16">
                    📞 {driver.phoneNumber}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/50 mb-2">No available drivers</p>
            <p className="text-white/30 text-sm">
              All drivers are currently busy or offline
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onCancel}
          disabled={approving}
          className="flex-1 btn-secondary"
        >
          Cancel
        </button>
        <button
          onClick={handleApproveAndAssign}
          disabled={!selectedDriver || approving}
          className="flex-1 btn-primary"
        >
          {approving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
              Processing...
            </>
          ) : (
            `✅ Approve & Assign to ${selectedDriver?.fullName || 'Driver'}`
          )}
        </button>
      </div>
    </div>
  );
};

export default AssignDriver;