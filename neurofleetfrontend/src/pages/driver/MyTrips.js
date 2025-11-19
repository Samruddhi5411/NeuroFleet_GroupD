import React, { useState, useEffect } from 'react';
import { RouteIcon, LocationIcon, CalendarIcon } from '../../components/Icons';
import { driverService } from '../../services/api';

const MyTrips = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // ADD THIS
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchDriverBookings();
  }, []);

  const fetchDriverBookings = async () => {
    try {
      setLoading(true);
      const response = await driverService.getAssignedBookings(username);
      setBookings(response.data);
      console.log('Driver bookings loaded:', response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrip = async (bookingId) => {
    try {
      const response = await driverService.startTrip(bookingId);
      console.log('Trip started:', response.data);
      alert('🚀 Trip started! Customer can now see your live location.');
      fetchDriverBookings();
    } catch (error) {
      console.error('Error starting trip:', error);
      alert('Error starting trip: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleCompleteTrip = async (bookingId) => {
    if (!window.confirm('Are you sure you want to complete this trip?')) return;

    try {
      const response = await driverService.completeTrip(bookingId);
      console.log('Trip completed:', response.data);
      alert(`✅ Trip completed! Payment of $${response.data.totalPrice?.toFixed(2)} added to your earnings.`);
      fetchDriverBookings();
    } catch (error) {
      console.error('Error completing trip:', error);
      alert('Error completing trip: ' + (error.response?.data?.error || error.message));
    }
  };

  const getStatusStyle = (status) => {
    const statusMap = {
      'DRIVER_ASSIGNED': 'status-maintenance',
      'TRIP_STARTED': 'status-in-use',
      'IN_PROGRESS': 'status-in-use',
      'COMPLETED': 'status-available',
      'CANCELLED': 'status-critical',
    };
    return statusMap[status] || 'status-maintenance';
  };

  // ADD THESE FILTERS
  const activeBookings = bookings.filter(b =>
    ['DRIVER_ASSIGNED', 'IN_PROGRESS', 'CONFIRMED'].includes(b.status)
  );

  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');

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
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <RouteIcon size="lg" className="text-accent-cyan" />
          My Trips
        </h2>
        <p className="text-white/50">View and manage your assigned trips</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/60 text-sm font-semibold">Active Trips</p>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
              <RouteIcon size="sm" className="text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-accent-cyan">
            {activeBookings.length}
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/60 text-sm font-semibold">Completed</p>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center">
              <LocationIcon size="sm" className="text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-accent-green">
            {completedBookings.length}
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/60 text-sm font-semibold">Total Bookings</p>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
              <CalendarIcon size="sm" className="text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-accent-purple">
            {bookings.length}
          </p>
        </div>
      </div>

      {/* ADD TABS */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'active'
              ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-white shadow-lg'
              : 'bg-dark-700/40 text-white/60 hover:text-white'
            }`}
        >
          🚗 Active ({activeBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'completed'
              ? 'bg-gradient-to-r from-accent-green to-accent-cyan text-white shadow-lg'
              : 'bg-dark-700/40 text-white/60 hover:text-white'
            }`}
        >
          ✅ Completed ({completedBookings.length})
        </button>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-6">
          {activeTab === 'active' ? 'Active Trips' : 'Completed Trips'}
        </h3>

        {(activeTab === 'active' ? activeBookings : completedBookings).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/50 text-lg">
              {activeTab === 'active' ? 'No active trips at the moment' : 'No completed trips yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {(activeTab === 'active' ? activeBookings : completedBookings).map((booking) => (
              <div key={booking.id} className="glass-card-hover p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-white">Booking #{booking.id}</h4>
                      <span className={`status-badge ${getStatusStyle(booking.status)}`}>
                        <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-white/50">
                      {booking.vehicle?.manufacturer} {booking.vehicle?.model} - {booking.vehicle?.vehicleNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-accent-green font-bold text-2xl">${booking.totalPrice?.toFixed(2)}</p>
                    {booking.paymentStatus === 'PAID' && (
                      <span className="text-xs text-green-400">✓ Paid</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <LocationIcon size="sm" className="text-accent-green mt-1" />
                      <div>
                        <p className="text-white/60 text-sm mb-1">Pickup Location</p>
                        <p className="text-white font-semibold">{booking.pickupLocation}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <LocationIcon size="sm" className="text-accent-pink mt-1" />
                      <div>
                        <p className="text-white/60 text-sm mb-1">Dropoff Location</p>
                        <p className="text-white font-semibold">{booking.dropoffLocation}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-dark-700/40 rounded-lg border border-white/5">
                      <span className="text-white/60 text-sm">Customer</span>
                      <span className="text-white font-semibold">{booking.customer?.fullName}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-dark-700/40 rounded-lg border border-white/5">
                      <span className="text-white/60 text-sm">Start Time</span>
                      <span className="text-white font-semibold">{new Date(booking.startTime).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {activeTab === 'active' && (
                  <div className="flex gap-2">
                    {booking.status === 'DRIVER_ASSIGNED' && (
                      <button
                        onClick={() => handleStartTrip(booking.id)}
                        className="flex-1 btn-primary"
                      >
                        🚀 Start Trip
                      </button>
                    )}
                    {booking.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleCompleteTrip(booking.id)}
                        className="flex-1 btn-primary"
                      >
                        ✓ Complete Trip
                      </button>
                    )}
                  </div>
                )}

                {activeTab === 'completed' && booking.completedAt && (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-sm">
                      ✓ Completed on {new Date(booking.completedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;