import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';
import { VehicleIcon, BookingIcon, LocationIcon, CalendarIcon, LogoutIcon, FilterIcon, RouteIcon } from '../components/Icons';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeView, setActiveView] = useState('search'); // search, book, history, tracking
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [bookingForm, setBookingForm] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    startTime: new Date().toISOString().slice(0, 16),
  });
  const username = localStorage.getItem('username');
  const fullName = localStorage.getItem('fullName') || 'Customer';

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [vehiclesRes, bookingsRes] = await Promise.all([
        axios.get('http://localhost:8083/api/customer/vehicles', { headers }),
        axios.get(`http://localhost:8083/api/customer/bookings?username=${username}`, { headers })
      ]);

      setVehicles(vehiclesRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleBookVehicle = async () => {
    if (!selectedVehicle || !bookingForm.pickupLocation || !bookingForm.dropoffLocation) {
      alert('Please fill all required fields!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8083/api/customer/bookings?username=${username}`,
        {
          vehicleId: selectedVehicle.id,
          pickupLocation: bookingForm.pickupLocation,
          dropoffLocation: bookingForm.dropoffLocation,
          pickupLatitude: 19.0760,
          pickupLongitude: 72.8777,
          dropoffLatitude: 19.1136,
          dropoffLongitude: 72.8697,
          startTime: bookingForm.startTime,
          customerNotes: '',
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      alert('✅ Booking created! Waiting for manager approval.');
      setSelectedVehicle(null);
      setBookingForm({
        pickupLocation: '',
        dropoffLocation: '',
        startTime: new Date().toISOString().slice(0, 16),
      });
      setActiveView('history');
      loadData();
    } catch (error) {
      alert('❌ Failed to create booking');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const filteredVehicles = vehicles.filter(v =>
    filterType === 'ALL' || v.type === filterType
  ).filter(v => v.status === 'AVAILABLE');

  const upcomingRides = bookings.filter(b =>
    ['PENDING', 'APPROVED', 'DRIVER_ASSIGNED', 'CONFIRMED'].includes(b.status)
  );

  const completedRides = bookings.filter(b => b.status === 'COMPLETED');

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <nav className="bg-dark-800/40 backdrop-blur-glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Logo size="sm" showText={true} />
              <div className="h-8 w-px bg-white/20"></div>
              <h1 className="text-lg font-bold text-white">Customer Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white/70">Welcome, {fullName}</span>
              <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
                <LogoutIcon size="sm" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 pb-3">
            {[
              { id: 'search', label: '🔍 Search Vehicle', icon: VehicleIcon },
              { id: 'book', label: '📝 Book', icon: BookingIcon },
              { id: 'history', label: '📜 History', icon: RouteIcon },
              { id: 'tracking', label: '📍 Track', icon: LocationIcon },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeView === tab.id
                    ? 'bg-gradient-to-r from-accent-green to-accent-cyan text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* SEARCH VEHICLE VIEW */}
        {activeView === 'search' && (
          <>
            {/* Filter */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-4">
                <FilterIcon size="md" className="text-accent-cyan" />
                <select
                  className="input-field flex-1"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="ALL">All Vehicle Types</option>
                  <option value="SEDAN">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="VAN">Van</option>
                  <option value="TRUCK">Truck</option>
                </select>
                <span className="text-white/70">
                  {filteredVehicles.length} vehicles available
                </span>
              </div>
            </div>

            {/* Available Vehicles */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">Available Vehicles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setActiveView('book');
                    }}
                    className="glass-card-hover p-6 cursor-pointer"
                  >
                    <div className="mb-4">
                      <h4 className="text-lg font-bold text-white">{vehicle.model}</h4>
                      <p className="text-white/50 text-sm">{vehicle.vehicleNumber}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Type:</span>
                        <span className="text-white">{vehicle.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Capacity:</span>
                        <span className="text-white">{vehicle.capacity} seats</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Price:</span>
                        <span className="text-accent-green font-bold">$10/hr</span>
                      </div>
                    </div>
                    <button className="btn-primary w-full mt-4">
                      Select & Book
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* BOOK VIEW */}
        {activeView === 'book' && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Book Vehicle</h3>
            {selectedVehicle ? (
              <div className="space-y-6">
                <div className="p-4 bg-accent-cyan/10 rounded-xl">
                  <h4 className="text-white font-bold">{selectedVehicle.model}</h4>
                  <p className="text-white/50 text-sm">{selectedVehicle.vehicleNumber}</p>
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-semibold mb-2">
                    Pickup Location *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter pickup location"
                    value={bookingForm.pickupLocation}
                    onChange={(e) => setBookingForm({ ...bookingForm, pickupLocation: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-semibold mb-2">
                    Dropoff Location *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter dropoff location"
                    value={bookingForm.dropoffLocation}
                    onChange={(e) => setBookingForm({ ...bookingForm, dropoffLocation: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-semibold mb-2">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={bookingForm.startTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedVehicle(null);
                      setActiveView('search');
                    }}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBookVehicle}
                    className="flex-1 btn-primary"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-white/50 py-12">
                <p>Please select a vehicle from the search page</p>
                <button
                  onClick={() => setActiveView('search')}
                  className="btn-primary mt-4"
                >
                  Go to Search
                </button>
              </div>
            )}
          </div>
        )}

        {/* BOOKING HISTORY VIEW */}
        {activeView === 'history' && (
          <>
            {/* Upcoming Scheduled Rides */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CalendarIcon size="md" className="text-accent-cyan" />
                Upcoming Scheduled Rides ({upcomingRides.length})
              </h3>
              {upcomingRides.length > 0 ? (
                <div className="space-y-3">
                  {upcomingRides.map((booking) => (
                    <div key={booking.id} className="glass-card-hover p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-white">Booking #{booking.id}</h4>
                          <p className="text-white/50 text-sm">
                            {booking.vehicle?.model} - {booking.vehicle?.vehicleNumber}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'CONFIRMED' ? 'bg-accent-green/20 text-accent-green' :
                            booking.status === 'DRIVER_ASSIGNED' ? 'bg-accent-cyan/20 text-accent-cyan' :
                              'bg-yellow-500/20 text-yellow-400'
                          }`}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <LocationIcon size="sm" className="text-accent-green" />
                            <span className="text-white/60">Pickup:</span>
                            <span className="text-white">{booking.pickupLocation}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <LocationIcon size="sm" className="text-accent-pink" />
                            <span className="text-white/60">Dropoff:</span>
                            <span className="text-white">{booking.dropoffLocation}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarIcon size="sm" className="text-accent-cyan" />
                            <span className="text-white/60">Time:</span>
                            <span className="text-white">{new Date(booking.startTime).toLocaleString()}</span>
                          </div>
                          {booking.driver && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-white/60">Driver:</span>
                              <span className="text-white">{booking.driver.fullName}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
                        <div>
                          <p className="text-white/60 text-sm">Total Price</p>
                          <p className="text-accent-green font-bold text-2xl">
                            ${booking.totalPrice?.toFixed(2)}
                          </p>
                        </div>
                        {booking.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => setActiveView('tracking')}
                            className="btn-primary"
                          >
                            📍 Track Live
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-white/50 py-8">No upcoming rides</div>
              )}
            </div>

            {/* Booking History */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">Completed Rides ({completedRides.length})</h3>
              {completedRides.length > 0 ? (
                <div className="space-y-3">
                  {completedRides.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl">
                      <div>
                        <p className="text-white font-semibold">Trip #{booking.id}</p>
                        <p className="text-white/50 text-sm">
                          {booking.pickupLocation} → {booking.dropoffLocation}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-accent-green font-bold">${booking.totalPrice?.toFixed(2)}</p>
                        <p className="text-white/50 text-xs">
                          {new Date(booking.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-white/50 py-8">No booking history</div>
              )}
            </div>
          </>
        )}

        {/* LIVE TRACKING VIEW */}
        {activeView === 'tracking' && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <LocationIcon size="md" className="text-accent-cyan" />
              Live Tracking Map
            </h3>
            <div className="aspect-video bg-dark-700/40 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <LocationIcon size="xl" className="text-white/20 mx-auto mb-4" />
                <p className="text-white/50 mb-2">📍 Live Vehicle Tracking</p>
                <p className="text-white/30 text-sm">Real-time location of your assigned vehicle</p>
              </div>
            </div>

            {/* Vehicle/Driver Details */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-dark-700/40 rounded-xl">
                <h4 className="text-white font-bold mb-2">Vehicle Details</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-white/60">Model: <span className="text-white">Toyota Camry</span></p>
                  <p className="text-white/60">Number: <span className="text-white">MH-12-AB-1234</span></p>
                  <p className="text-white/60">Type: <span className="text-white">Sedan</span></p>
                </div>
              </div>
              <div className="p-4 bg-dark-700/40 rounded-xl">
                <h4 className="text-white font-bold mb-2">Driver Details</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-white/60">Name: <span className="text-white">John Driver</span></p>
                  <p className="text-white/60">Rating: <span className="text-accent-cyan">⭐ 4.8</span></p>
                  <p className="text-white/60">Contact: <span className="text-white">+91 98765 43210</span></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;