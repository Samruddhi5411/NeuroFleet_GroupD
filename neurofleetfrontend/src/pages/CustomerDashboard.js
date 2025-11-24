import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { VehicleIcon, FilterIcon, LocationIcon, CalendarIcon, LogoutIcon } from '../components/Icons';

// Fix Leaflet marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('search');
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [showAIBadge, setShowAIBadge] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    startTime: new Date().toISOString().slice(0, 16),
  });
  const username = localStorage.getItem('username');
  const fullName = localStorage.getItem('fullName') || 'Customer';

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
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

      // Get AI recommendations if available
      if (vehiclesRes.data.length > 0) {
        fetchAIRecommendations(vehiclesRes.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const fetchAIRecommendations = async (availableVehicles) => {
    try {
      const response = await axios.post('http://localhost:5000/api/recommend/vehicles', {
        customerId: localStorage.getItem('userId'),
        filters: { type: filterType !== 'ALL' ? filterType : null },
        bookingHistory: bookings.map(b => ({
          vehicle: { type: b.vehicle?.type }
        }))
      });

      if (response.data.isAIRecommendation) {
        setAiRecommendations(response.data.recommendedVehicles || []);
        setShowAIBadge(true);
        console.log('✅ AI Recommendations loaded');
      }
    } catch (error) {
      console.log('⚠️ AI Service unavailable, showing all vehicles');
      setShowAIBadge(false);
    }
  };

  const isAIRecommended = (vehicleId) => {
    return aiRecommendations.some(rec => rec.vehicleId === vehicleId);
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
      setActiveTab('upcoming');
      loadData();
    } catch (error) {
      alert('❌ Failed to create booking');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8083/api/customer/bookings/${bookingId}/cancel`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert('✅ Booking cancelled successfully');
      loadData();
    } catch (error) {
      alert('❌ Failed to cancel booking');
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
    ['PENDING', 'APPROVED', 'DRIVER_ASSIGNED', 'DRIVER_ACCEPTED', 'CONFIRMED', 'IN_PROGRESS'].includes(b.status)
  );

  const completedRides = bookings.filter(b => b.status === 'COMPLETED');

  const renderContent = () => {
    switch (activeTab) {
      case 'search':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Search & Book Vehicle</h2>

            {/* Filter Section */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-4 mb-6">
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
                  {filteredVehicles.length} available
                </span>
                {showAIBadge && (
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full animate-pulse">
                    🤖 AI Powered
                  </span>
                )}
              </div>

              {/* Vehicle Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredVehicles.map((vehicle) => {
                  const isRecommended = isAIRecommended(vehicle.id);
                  return (
                    <div
                      key={vehicle.id}
                      className={`glass-card-hover p-6 cursor-pointer relative ${isRecommended ? 'ring-2 ring-purple-500' : ''
                        }`}
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setActiveTab('book');
                      }}
                    >
                      {isRecommended && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                          ⭐ AI Recommended
                        </div>
                      )}

                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
                          <VehicleIcon size="md" className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white">{vehicle.model}</h4>
                          <p className="text-white/50 text-sm">{vehicle.vehicleNumber}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Type:</span>
                          <span className="text-white font-semibold">{vehicle.type}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Capacity:</span>
                          <span className="text-white font-semibold">{vehicle.capacity} seats</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Health:</span>
                          <span className="text-accent-green font-semibold">{vehicle.healthScore}%</span>
                        </div>
                        {vehicle.isElectric && (
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Battery:</span>
                            <span className="text-accent-cyan font-semibold">{vehicle.batteryLevel}%</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Estimated:</span>
                          <span className="text-accent-green font-bold">$15/hr</span>
                        </div>
                      </div>

                      <button className="btn-primary w-full mt-4">
                        Select & Book →
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'book':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Complete Your Booking</h2>
            <div className="glass-card p-6">
              {selectedVehicle ? (
                <div className="space-y-6">
                  {/* Selected Vehicle */}
                  <div className="p-6 bg-gradient-to-r from-accent-cyan/10 to-accent-blue/10 rounded-xl border border-accent-cyan/20">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
                        <VehicleIcon size="lg" className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-xl">{selectedVehicle.model}</h4>
                        <p className="text-white/50">{selectedVehicle.vehicleNumber}</p>
                      </div>
                      {isAIRecommended(selectedVehicle.id) && (
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                          ⭐ AI Recommended
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-white/60">Type</p>
                        <p className="text-white font-semibold">{selectedVehicle.type}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Capacity</p>
                        <p className="text-white font-semibold">{selectedVehicle.capacity} seats</p>
                      </div>
                      <div>
                        <p className="text-white/60">Health</p>
                        <p className="text-accent-green font-semibold">{selectedVehicle.healthScore}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/70 text-sm font-semibold mb-2 flex items-center gap-2">
                        <LocationIcon size="sm" className="text-accent-green" />
                        Pickup Location *
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g., Mumbai Airport Terminal 2"
                        value={bookingForm.pickupLocation}
                        onChange={(e) => setBookingForm({ ...bookingForm, pickupLocation: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm font-semibold mb-2 flex items-center gap-2">
                        <LocationIcon size="sm" className="text-accent-pink" />
                        Dropoff Location *
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g., Pune Railway Station"
                        value={bookingForm.dropoffLocation}
                        onChange={(e) => setBookingForm({ ...bookingForm, dropoffLocation: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm font-semibold mb-2 flex items-center gap-2">
                      <CalendarIcon size="sm" className="text-accent-cyan" />
                      Pickup Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      className="input-field"
                      value={bookingForm.startTime}
                      onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                    />
                  </div>

                  {/* Price Estimate */}
                  <div className="p-4 bg-accent-green/10 rounded-xl border border-accent-green/20">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Estimated Trip Cost</span>
                      <span className="text-accent-green font-bold text-2xl">$45 - $75</span>
                    </div>
                    <p className="text-white/50 text-xs mt-2">
                      Final price depends on actual distance and duration
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedVehicle(null);
                        setActiveTab('search');
                      }}
                      className="flex-1 btn-secondary"
                    >
                      ← Back to Search
                    </button>
                    <button
                      onClick={handleBookVehicle}
                      className="flex-1 btn-primary"
                    >
                      Confirm Booking ✓
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-white/50 py-12">
                  <VehicleIcon size="xl" className="mx-auto mb-4 text-white/20" />
                  <p className="mb-4">No vehicle selected</p>
                  <button
                    onClick={() => setActiveTab('search')}
                    className="btn-primary"
                  >
                    Go to Search
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'upcoming':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">
              Upcoming Rides ({upcomingRides.length})
            </h2>
            {upcomingRides.length > 0 ? (
              <div className="space-y-4">
                {upcomingRides.map((booking) => (
                  <div key={booking.id} className="glass-card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-white">Booking #{booking.id}</h4>
                        <p className="text-white/50 text-sm">
                          {booking.vehicle?.model} - {booking.vehicle?.vehicleNumber}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'CONFIRMED' ? 'bg-accent-green/20 text-accent-green' :
                            booking.status === 'IN_PROGRESS' ? 'bg-accent-cyan/20 text-accent-cyan' :
                              booking.status === 'DRIVER_ASSIGNED' ? 'bg-accent-blue/20 text-accent-blue' :
                                'bg-yellow-500/20 text-yellow-400'
                          }`}>
                          {booking.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <LocationIcon size="sm" className="text-accent-green mt-1" />
                          <div className="flex-1">
                            <p className="text-white/60 text-xs">Pickup</p>
                            <p className="text-white font-semibold">{booking.pickupLocation}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <LocationIcon size="sm" className="text-accent-pink mt-1" />
                          <div className="flex-1">
                            <p className="text-white/60 text-xs">Dropoff</p>
                            <p className="text-white font-semibold">{booking.dropoffLocation}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CalendarIcon size="sm" className="text-accent-cyan" />
                          <div className="flex-1">
                            <p className="text-white/60 text-xs">Scheduled Time</p>
                            <p className="text-white font-semibold">
                              {new Date(booking.startTime).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {booking.driver && (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-white text-xs font-bold">
                              {booking.driver.fullName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <p className="text-white/60 text-xs">Driver</p>
                              <p className="text-white font-semibold">{booking.driver.fullName}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <p className="text-white/60 text-sm">Estimated Cost</p>
                        <p className="text-accent-green font-bold text-2xl">
                          ${booking.totalPrice?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {booking.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => setActiveTab('tracking')}
                            className="btn-primary"
                          >
                            📍 Track Live
                          </button>
                        )}
                        {['PENDING', 'APPROVED'].includes(booking.status) && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="btn-secondary text-red-400 hover:bg-red-500/10"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <CalendarIcon size="xl" className="text-white/20 mx-auto mb-4" />
                <p className="text-white/50 mb-4">No upcoming rides</p>
                <button
                  onClick={() => setActiveTab('search')}
                  className="btn-primary"
                >
                  Book a Ride
                </button>
              </div>
            )}
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">
              Booking History ({completedRides.length})
            </h2>
            <div className="glass-card p-6">
              {completedRides.length > 0 ? (
                <div className="space-y-3">
                  {completedRides.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl hover:bg-dark-700/60 transition-colors">
                      <div className="flex-1">
                        <p className="text-white font-semibold">Trip #{booking.id}</p>
                        <p className="text-white/50 text-sm">
                          {booking.pickupLocation} → {booking.dropoffLocation}
                        </p>
                        <p className="text-white/40 text-xs mt-1">
                          {booking.vehicle?.model} • {booking.driver?.fullName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-accent-green font-bold text-lg">
                          ${booking.totalPrice?.toFixed(2)}
                        </p>
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
          </div>
        );

      case 'tracking':
        const activeBooking = upcomingRides.find(b => b.status === 'IN_PROGRESS');
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Live Trip Tracking</h2>
            <div className="glass-card p-6">
              <div style={{ height: '600px', width: '100%' }}>
                <MapContainer
                  center={[19.0760, 72.8777]}
                  zoom={12}
                  style={{ height: '100%', width: '100%', borderRadius: '12px' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  {activeBooking && (
                    <>
                      <Marker position={[19.0896, 72.8656]}>
                        <Popup>
                          <strong>Pickup: {activeBooking.pickupLocation}</strong>
                        </Popup>
                      </Marker>
                      <Marker position={[19.0652, 72.8489]}>
                        <Popup>
                          <strong>Drop: {activeBooking.dropoffLocation}</strong>
                        </Popup>
                      </Marker>
                      <Marker position={[19.0760, 72.8777]}>
                        <Popup>
                          <strong>🚗 Your Vehicle</strong><br />
                          Driver: {activeBooking.driver?.fullName || 'Assigned soon'}
                        </Popup>
                      </Marker>
                      <Polyline
                        positions={[
                          [19.0760, 72.8777],
                          [19.0896, 72.8656],
                          [19.0652, 72.8489]
                        ]}
                        color="blue"
                        weight={4}
                      />
                    </>
                  )}
                </MapContainer>
              </div>

              {activeBooking && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-dark-700/40 rounded-xl">
                    <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                      <VehicleIcon size="sm" className="text-accent-cyan" />
                      Vehicle Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Model:</span>
                        <span className="text-white font-semibold">{activeBooking.vehicle?.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Number:</span>
                        <span className="text-white font-semibold">{activeBooking.vehicle?.vehicleNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Type:</span>
                        <span className="text-white font-semibold">{activeBooking.vehicle?.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-dark-700/40 rounded-xl">
                    <h4 className="text-white font-bold mb-3">Driver Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Name:</span>
                        <span className="text-white font-semibold">
                          {activeBooking.driver?.fullName || 'Assigning...'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Rating:</span>
                        <span className="text-accent-cyan font-semibold">
                          ⭐ {activeBooking.driver?.rating || '5.0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Contact:</span>
                        <span className="text-white font-semibold">
                          {activeBooking.driver?.phoneNumber || 'Available soon'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
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

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 pb-3 overflow-x-auto">
            {[
              { id: 'search', label: '🔍 Search Vehicle' },
              { id: 'book', label: '📝 Book' },
              { id: 'upcoming', label: '📅 Upcoming Rides' },
              { id: 'history', label: '📊 History' },
              { id: 'tracking', label: '📍 Live Tracking' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
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

      <div className="max-w-7xl mx-auto p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default CustomerDashboard;