import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet markers
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
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [bookingForm, setBookingForm] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    startTime: new Date().toISOString().slice(0, 16),
  });
  const username = localStorage.getItem('username');
  const fullName = localStorage.getItem('fullName') || 'Customer';

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
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
    if (!window.confirm('Cancel this booking?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8083/api/customer/bookings/${bookingId}/cancel?username=${username}`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert('✅ Booking cancelled');
      loadData();
    } catch (error) {
      alert('❌ Failed to cancel booking');
    }
  };

  const handlePayment = async () => {
    if (!selectedBookingForPayment) return;

    try {
      alert(`✅ Payment of $${selectedBookingForPayment.totalPrice.toFixed(2)} successful via ${paymentMethod}!`);
      setSelectedBookingForPayment(null);
      setActiveTab('upcoming');
      loadData();
    } catch (error) {
      alert('❌ Payment failed');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const getVehicleIcon = (type) => {
    const icons = {
      SEDAN: '🚗',
      SUV: '🚙',
      VAN: '🚐',
      TRUCK: '🚛',
      BUS: '🚌',
      BIKE: '🏍️'
    };
    return icons[type] || '🚗';
  };

  const filteredVehicles = vehicles.filter(v =>
    (filterType === 'ALL' || v.type === filterType) && v.status === 'AVAILABLE'
  );

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

            <div className="glass-card p-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl">🔍</span>
                <select
                  className="input-field flex-1"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="ALL">All Vehicles</option>
                  <option value="SEDAN">🚗 Sedan</option>
                  <option value="SUV">🚙 SUV</option>
                  <option value="VAN">🚐 Van</option>
                  <option value="TRUCK">🚛 Truck</option>
                  <option value="BUS">🚌 Bus</option>
                  <option value="BIKE">🏍️ Bike</option>
                </select>
                <span className="text-white/70">{filteredVehicles.length} available</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="glass-card-hover p-6 cursor-pointer"
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setActiveTab('book');
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-4xl">{getVehicleIcon(vehicle.type)}</div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white">{vehicle.model}</h4>
                        <p className="text-white/50 text-sm">{vehicle.vehicleNumber}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Type:</span>
                        <span className="text-white font-semibold">{vehicle.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Capacity:</span>
                        <span className="text-white font-semibold">{vehicle.capacity} seats</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Health:</span>
                        <span className="text-accent-green font-semibold">{vehicle.healthScore}%</span>
                      </div>
                      {vehicle.isElectric && (
                        <div className="flex justify-between">
                          <span className="text-white/60">⚡ Battery:</span>
                          <span className="text-accent-cyan font-semibold">{vehicle.batteryLevel}%</span>
                        </div>
                      )}
                    </div>

                    <button className="btn-primary w-full mt-4">
                      Select & Book →
                    </button>
                  </div>
                ))}
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
                  <div className="p-6 bg-gradient-to-r from-accent-cyan/10 to-accent-blue/10 rounded-xl border border-accent-cyan/20">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-6xl">{getVehicleIcon(selectedVehicle.type)}</div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-xl">{selectedVehicle.model}</h4>
                        <p className="text-white/50">{selectedVehicle.vehicleNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/70 text-sm font-semibold mb-2">
                        📍 Pickup Location *
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
                      <label className="block text-white/70 text-sm font-semibold mb-2">
                        📍 Dropoff Location *
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
                    <label className="block text-white/70 text-sm font-semibold mb-2">
                      📅 Pickup Date & Time
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
                        setActiveTab('search');
                      }}
                      className="flex-1 btn-secondary"
                    >
                      ← Back
                    </button>
                    <button onClick={handleBookVehicle} className="flex-1 btn-primary">
                      Confirm Booking ✓
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-white/50 py-12">
                  <p className="mb-4">No vehicle selected</p>
                  <button onClick={() => setActiveTab('search')} className="btn-primary">
                    Go to Search
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">💳 Payment</h2>
            {selectedBookingForPayment ? (
              <div className="glass-card p-6 max-w-2xl mx-auto">
                <div className="mb-6 p-4 bg-accent-cyan/10 rounded-xl">
                  <h3 className="text-white font-bold mb-2">Booking #{selectedBookingForPayment.id}</h3>
                  <p className="text-white/70 text-sm">
                    {selectedBookingForPayment.pickupLocation} → {selectedBookingForPayment.dropoffLocation}
                  </p>
                  <p className="text-accent-green font-bold text-3xl mt-4">
                    ${selectedBookingForPayment.totalPrice.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 mb-2">Payment Method</label>
                    <select
                      className="input-field"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="CARD">💳 Credit/Debit Card</option>
                      <option value="UPI">📱 UPI</option>
                      <option value="CASH">💵 Cash</option>
                      <option value="WALLET">👛 Wallet</option>
                    </select>
                  </div>

                  {paymentMethod === 'CARD' && (
                    <>
                      <input type="text" className="input-field" placeholder="Card Number" />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" className="input-field" placeholder="MM/YY" />
                        <input type="text" className="input-field" placeholder="CVV" />
                      </div>
                    </>
                  )}

                  {paymentMethod === 'UPI' && (
                    <input type="text" className="input-field" placeholder="UPI ID" />
                  )}

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        setSelectedBookingForPayment(null);
                        setActiveTab('upcoming');
                      }}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </button>
                    <button onClick={handlePayment} className="flex-1 btn-primary">
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-white/50">No booking selected for payment</div>
            )}
          </div>
        );

      case 'upcoming':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">
              📅 Upcoming Rides ({upcomingRides.length})
            </h2>
            {upcomingRides.length > 0 ? (
              <div className="space-y-4">
                {upcomingRides.map((booking) => (
                  <div key={booking.id} className="glass-card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{getVehicleIcon(booking.vehicle?.type)}</div>
                        <div>
                          <h4 className="text-lg font-bold text-white">Booking #{booking.id}</h4>
                          <p className="text-white/50 text-sm">
                            {booking.vehicle?.model} - {booking.vehicle?.vehicleNumber}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'IN_PROGRESS' ? 'bg-accent-cyan/20 text-accent-cyan' :
                        booking.status === 'CONFIRMED' ? 'bg-accent-green/20 text-accent-green' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                        {booking.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-white/60">📍 Pickup:</span>
                          <span className="text-white font-semibold">{booking.pickupLocation}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-white/60">📍 Dropoff:</span>
                          <span className="text-white font-semibold">{booking.dropoffLocation}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-white/60">📅 Time:</span>
                          <span className="text-white font-semibold">
                            {new Date(booking.startTime).toLocaleString()}
                          </span>
                        </div>
                        {booking.driver && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-white/60">👤 Driver:</span>
                            <span className="text-white font-semibold">{booking.driver.fullName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <p className="text-white/60 text-sm">Total Cost</p>
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
                        {booking.status === 'DRIVER_ACCEPTED' && booking.paymentStatus === 'UNPAID' && (
                          <button
                            onClick={() => {
                              setSelectedBookingForPayment(booking);
                              setActiveTab('payment');
                            }}
                            className="btn-primary"
                          >
                            💳 Pay Now
                          </button>
                        )}
                        {['PENDING', 'APPROVED'].includes(booking.status) && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="btn-secondary text-red-400"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-white/50 mb-4">No upcoming rides</p>
                <button onClick={() => setActiveTab('search')} className="btn-primary">
                  Book a Ride
                </button>
              </div>
            )}
          </div>
        );

      case 'tracking':
        const activeBooking = upcomingRides.find(b => b.status === 'IN_PROGRESS');
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">📍 Live Trip Tracking</h2>
            <div className="glass-card p-6">
              {activeBooking ? (
                <>
                  <div style={{ height: '500px', width: '100%' }}>
                    <MapContainer
                      center={[activeBooking.pickupLatitude || 19.0760, activeBooking.pickupLongitude || 72.8777]}
                      zoom={12}
                      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap'
                      />
                      <Marker position={[activeBooking.pickupLatitude, activeBooking.pickupLongitude]}>
                        <Popup>
                          <strong>Pickup: {activeBooking.pickupLocation}</strong>
                        </Popup>
                      </Marker>
                      <Marker position={[activeBooking.dropoffLatitude, activeBooking.dropoffLongitude]}>
                        <Popup>
                          <strong>Drop: {activeBooking.dropoffLocation}</strong>
                        </Popup>
                      </Marker>
                      <Polyline
                        positions={[
                          [activeBooking.pickupLatitude, activeBooking.pickupLongitude],
                          [activeBooking.dropoffLatitude, activeBooking.dropoffLongitude]
                        ]}
                        color="blue"
                        weight={4}
                      />
                    </MapContainer>
                  </div>

                  <div className="mt-6 p-4 bg-accent-cyan/10 rounded-xl">
                    <h4 className="text-white font-bold mb-2">🚗 {activeBooking.vehicle?.model}</h4>
                    <p className="text-white/70">Driver: {activeBooking.driver?.fullName}</p>
                    <p className="text-accent-green font-bold text-xl mt-2">Trip in Progress...</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-white/50">No active trip to track</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">
              📊 Booking History ({completedRides.length})
            </h2>
            <div className="glass-card p-6">
              {completedRides.length > 0 ? (
                <div className="space-y-3">
                  {completedRides.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-3xl">{getVehicleIcon(booking.vehicle?.type)}</div>
                        <div>
                          <p className="text-white font-semibold">Trip #{booking.id}</p>
                          <p className="text-white/50 text-sm">
                            {booking.pickupLocation} → {booking.dropoffLocation}
                          </p>
                        </div>
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
              <div className="text-2xl">🚗</div>
              <h1 className="text-lg font-bold text-white">Customer Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white/70">Welcome, {fullName}</span>
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 pb-3 overflow-x-auto">
            {[
              { id: 'search', label: '🔍 Search' },
              { id: 'upcoming', label: '📅 Upcoming' },
              { id: 'tracking', label: '📍 Track' },
              { id: 'history', label: '📊 History' },
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

