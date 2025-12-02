

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
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [etaData, setEtaData] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupLatitude: 19.0760,
    pickupLongitude: 72.8777,
    dropoffLatitude: 19.1136,
    dropoffLongitude: 72.8697,
    startTime: new Date().toISOString().slice(0, 16),
  });
  const username = localStorage.getItem('username');
  const fullName = localStorage.getItem('fullName') || 'Customer';

  const routePresets = {
    'Mumbai Airport T2': { lat: 19.0886, lon: 72.8678 },
    'Mumbai Bandra Station': { lat: 19.0540, lon: 72.8410 },
    'Pune Railway Station': { lat: 18.5288, lon: 73.8740 },
    'Pune Hinjewadi': { lat: 18.5912, lon: 73.7389 },
    'Delhi Connaught Place': { lat: 28.6304, lon: 77.2177 },
    'Delhi Airport T3': { lat: 28.5562, lon: 77.1000 },
    'Gurgaon Cyber City': { lat: 28.4595, lon: 77.0266 },
    'Noida Sector 18': { lat: 28.5686, lon: 77.3260 },
    'Bangalore Koramangala': { lat: 12.9352, lon: 77.6245 },
    'Bangalore Electronic City': { lat: 12.8456, lon: 77.6603 },
    'Bangalore Airport': { lat: 13.1986, lon: 77.7066 },
    'Hyderabad Hi-Tech City': { lat: 17.4435, lon: 78.3772 },
    'Hyderabad Secunderabad': { lat: 17.4399, lon: 78.4983 },
    'Chennai T Nagar': { lat: 13.0418, lon: 80.2341 },
    'Chennai Airport': { lat: 12.9941, lon: 80.1709 },
  };

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

      console.log('✅ Vehicles loaded:', vehiclesRes.data.length);
      console.log('✅ Bookings loaded:', bookingsRes.data.length);

      setVehicles(vehiclesRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error('❌ Error loading data:', error);
    }
  };

  const getAIRecommendations = async () => {
    if (!bookingForm.pickupLatitude || !bookingForm.dropoffLatitude) {
      console.log('⚠️ Missing coordinates');
      return;
    }

    setLoadingAI(true);
    console.log('🤖 Requesting AI recommendations...');
    console.log('📍 Pickup:', bookingForm.pickupLatitude, bookingForm.pickupLongitude);
    console.log('📍 Dropoff:', bookingForm.dropoffLatitude, bookingForm.dropoffLongitude);

    try {
      const token = localStorage.getItem('token');

      //  Call both endpoints
      const [etaRes, recommendRes] = await Promise.all([
        axios.post('http://localhost:8083/api/ai/eta', {
          pickupLat: bookingForm.pickupLatitude,
          pickupLon: bookingForm.pickupLongitude,
          dropoffLat: bookingForm.dropoffLatitude,
          dropoffLon: bookingForm.dropoffLongitude,
          vehicleHealth: 0.85,
          isElectric: false
        }, { headers: { 'Authorization': `Bearer ${token}` } }),

        axios.post('http://localhost:8083/api/ai/recommend-vehicles', {
          pickupLat: bookingForm.pickupLatitude,
          pickupLon: bookingForm.pickupLongitude,
          passengers: 1,
          preferElectric: false,
          topN: 5
        }, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      console.log('✅ ETA Response:', etaRes.data);
      console.log('✅ Recommendations Response:', recommendRes.data);

      setEtaData(etaRes.data);
      setAiRecommendations(recommendRes.data || []);

      if (!recommendRes.data || recommendRes.data.length === 0) {
        console.warn('⚠️ No AI recommendations received');
      } else {
        console.log(`✅ Received ${recommendRes.data.length} AI recommendations`);
      }
    } catch (error) {
      console.error('❌ AI service error:', error);
      console.error('Error details:', error.response?.data);
      setAiRecommendations([]);
      setEtaData(null);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleLocationChange = (field, value) => {
    console.log(`📍 Location changed: ${field} = ${value}`);

    setBookingForm(prev => ({ ...prev, [field]: value }));

    if (routePresets[value]) {
      if (field === 'pickupLocation') {
        setBookingForm(prev => ({
          ...prev,
          pickupLatitude: routePresets[value].lat,
          pickupLongitude: routePresets[value].lon
        }));
      } else if (field === 'dropoffLocation') {
        setBookingForm(prev => ({
          ...prev,
          dropoffLatitude: routePresets[value].lat,
          dropoffLongitude: routePresets[value].lon
        }));
      }
    }
  };

  //  Trigger AI recommendations when both locations are selected
  useEffect(() => {
    if (bookingForm.pickupLocation && bookingForm.dropoffLocation) {
      console.log('🔄 Both locations selected, fetching AI recommendations...');
      getAIRecommendations();
    } else {
      console.log('⚠️ Waiting for both pickup and dropoff locations');
      setAiRecommendations([]);
      setEtaData(null);
    }
  }, [bookingForm.pickupLocation, bookingForm.dropoffLocation]);

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
          pickupLatitude: bookingForm.pickupLatitude,
          pickupLongitude: bookingForm.pickupLongitude,
          dropoffLatitude: bookingForm.dropoffLatitude,
          dropoffLongitude: bookingForm.dropoffLongitude,
          startTime: bookingForm.startTime,
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      alert('✅ Booking created! Waiting for manager approval.');
      setSelectedVehicle(null);
      setBookingForm({
        pickupLocation: '',
        dropoffLocation: '',
        pickupLatitude: 19.0760,
        pickupLongitude: 72.8777,
        dropoffLatitude: 19.1136,
        dropoffLongitude: 72.8697,
        startTime: new Date().toISOString().slice(0, 16),
      });
      setAiRecommendations([]);
      setEtaData(null);
      setActiveTab('upcoming');
      loadData();
    } catch (error) {
      console.error('Booking error:', error);
      alert('❌ Failed to create booking: ' + (error.response?.data?.error || error.message));
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
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8083/api/customer/bookings/${selectedBookingForPayment.id}/pay`,
        { paymentMethod: paymentMethod },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      alert(`✅ Payment of $${selectedBookingForPayment.totalPrice.toFixed(2)} successful!`);
      setSelectedBookingForPayment(null);
      setActiveTab('history');
      loadData();
    } catch (error) {
      console.error('Payment error:', error);
      alert('❌ Payment failed: ' + (error.response?.data?.error || error.message));
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

  const pendingPaymentRides = bookings.filter(b =>
    b.status === 'COMPLETED' && b.paymentStatus !== 'PAID'
  );

  const completedRides = bookings.filter(b => b.status === 'COMPLETED' && b.paymentStatus === 'PAID');

  const renderContent = () => {
    switch (activeTab) {
      case 'search':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">🔍 Search & Book Vehicle</h2>

            {/*  Location Selection Section */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">📍 Select Your Route</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm font-semibold mb-2">
                    Pickup Location *
                  </label>
                  <select
                    className="input-field"
                    value={bookingForm.pickupLocation}
                    onChange={(e) => handleLocationChange('pickupLocation', e.target.value)}
                  >
                    <option value="">Select pickup location</option>
                    {Object.keys(routePresets).map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-semibold mb-2">
                    Dropoff Location *
                  </label>
                  <select
                    className="input-field"
                    value={bookingForm.dropoffLocation}
                    onChange={(e) => handleLocationChange('dropoffLocation', e.target.value)}
                  >
                    <option value="">Select dropoff location</option>
                    {Object.keys(routePresets).map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/*  Loading State */}
            {loadingAI && (
              <div className="glass-card p-6 text-center">
                <div className="animate-spin text-4xl mb-2">🤖</div>
                <p className="text-white/70">AI is analyzing your route...</p>
              </div>
            )}

            {/*  ETA Display */}
            {etaData && !loadingAI && (
              <div className="glass-card p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">🤖 AI Predicted ETA</p>
                    <p className="text-white font-bold text-2xl">{etaData.eta_minutes} min</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-sm">Distance</p>
                    <p className="text-white font-semibold">{etaData.distance_km} km</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-sm">Traffic</p>
                    <p className={`font-semibold ${etaData.traffic_condition === 'Heavy' ? 'text-red-400' :
                      etaData.traffic_condition === 'Moderate' ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>{etaData.traffic_condition}</p>
                  </div>
                </div>
              </div>
            )}

            {/*  AI Recommendations Notice */}
            {aiRecommendations.length > 0 && !loadingAI && (
              <div className="glass-card p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🤖</span>
                  <div>
                    <p className="text-white font-bold">AI Smart Recommendations Active</p>
                    <p className="text-white/70 text-sm">
                      {aiRecommendations.length} vehicles ranked by distance, health, capacity , location state & availability
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/*  Vehicle Grid */}
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
                {filteredVehicles.map((vehicle) => {
                  const aiRec = aiRecommendations.find(r => r.vehicle?.id === vehicle.id);
                  const isAIRecommended = aiRec && aiRec.recommendation_score > 70;

                  console.log(`Vehicle ${vehicle.id}: AI Score = ${aiRec?.recommendation_score || 'N/A'}`);

                  return (
                    <div
                      key={vehicle.id}
                      className={`glass-card-hover p-6 cursor-pointer relative ${isAIRecommended ? 'ring-2 ring-cyan-500' : ''
                        }`}
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setActiveTab('book');
                      }}
                    >
                      {isAIRecommended && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          🤖 AI Top Pick
                        </div>
                      )}
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
                          <span className={`font-semibold ${vehicle.healthScore >= 90 ? 'text-green-400' :
                            vehicle.healthScore >= 75 ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                            {vehicle.healthScore}%
                          </span>
                        </div>
                        {aiRec && (
                          <>
                            <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                              <span className="text-cyan-400 font-semibold">🤖 AI Score:</span>
                              <span className="text-cyan-400 font-bold">{aiRec.recommendation_score.toFixed(1)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/60">Distance:</span>
                              <span className="text-white font-semibold">{aiRec.distance_km.toFixed(1)} km</span>
                            </div>
                            {aiRec.reason && (
                              <p className="text-cyan-400 text-xs italic mt-2">"{aiRec.reason}"</p>
                            )}
                          </>
                        )}
                      </div>

                      <button className="btn-primary w-full mt-4">
                        Select & Book →
                      </button>
                    </div>
                  );
                })}
              </div>

              {filteredVehicles.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🚗</div>
                  <p className="text-white/50">No vehicles available at the moment</p>
                </div>
              )}
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
                        value={bookingForm.pickupLocation}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm font-semibold mb-2">
                        📍 Dropoff Location *
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={bookingForm.dropoffLocation}
                        readOnly
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
            <h2 className="text-3xl font-bold text-white mb-4">💳 Complete Payment</h2>

            {pendingPaymentRides.length > 0 && !selectedBookingForPayment && (
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4">Trips Awaiting Payment</h3>
                <div className="space-y-3">
                  {pendingPaymentRides.map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                      <div>
                        <p className="text-white font-semibold">Trip #{booking.id}</p>
                        <p className="text-white/50 text-sm">{booking.pickupLocation} → {booking.dropoffLocation}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-accent-green font-bold text-xl">${booking.totalPrice?.toFixed(2)}</p>
                        <button
                          onClick={() => setSelectedBookingForPayment(booking)}
                          className="mt-2 px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg text-sm font-semibold"
                        >
                          Pay Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedBookingForPayment ? (
              <div className="glass-card p-6 max-w-2xl mx-auto">
                <div className="mb-6 p-4 bg-accent-cyan/10 rounded-xl">
                  <h3 className="text-white font-bold mb-2">Booking #{selectedBookingForPayment.id}</h3>
                  <p className="text-white/70 text-sm">
                    {selectedBookingForPayment.pickupLocation} → {selectedBookingForPayment.dropoffLocation}
                  </p>
                  <p className="text-accent-green font-bold text-3xl mt-4">
                    ${selectedBookingForPayment.totalPrice?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-white/50 text-xs mt-2">
                    Driver earns: ${((selectedBookingForPayment.totalPrice || 0) * 0.7).toFixed(2)} (70%)
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
                      onClick={() => setSelectedBookingForPayment(null)}
                      className="flex-1 btn-secondary"
                    >
                      Cancel</button>
                    <button onClick={handlePayment} className="flex-1 btn-primary">
                      💳 Confirm Payment
                    </button>
                  </div>
                </div>
              </div>
            ) : !pendingPaymentRides.length && (
              <div className="text-center text-white/50 py-12">
                <div className="text-6xl mb-4">💳</div>
                <p>No pending payments</p>
              </div>
            )}
          </div>
        ); case 'upcoming':
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
                        {/* Only show cancel for PENDING and APPROVED statuses */}
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

            {/* Show pending payment notification */}
            {pendingPaymentRides.length > 0 && (
              <div className="glass-card p-6 bg-yellow-500/10 border-2 border-yellow-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold mb-1">⚠️ Payment Required</h3>
                    <p className="text-white/70 text-sm">
                      You have {pendingPaymentRides.length} completed trip{pendingPaymentRides.length > 1 ? 's' : ''} awaiting payment
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('payment')}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg font-semibold hover:opacity-90"
                  >
                    Pay Now
                  </button>
                </div>
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
                      center={[
                        (activeBooking.pickupLatitude + activeBooking.dropoffLatitude) / 2,
                        (activeBooking.pickupLongitude + activeBooking.dropoffLongitude) / 2
                      ]}
                      zoom={11}
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
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                          ✓ {booking.paymentMethod || 'PAID'}
                        </span>
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
              {pendingPaymentRides.length > 0 && (
                <button
                  onClick={() => setActiveTab('payment')}
                  className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400 font-semibold animate-pulse"
                >
                  💳 {pendingPaymentRides.length} Payment{pendingPaymentRides.length > 1 ? 's' : ''} Pending
                </button>
              )}
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
              { id: 'payment', label: '💳 Payment', badge: pendingPaymentRides.length },
              { id: 'tracking', label: '📍 Track' },
              { id: 'history', label: '📊 History' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap relative ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-accent-green to-accent-cyan text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
              >
                {tab.label}
                {tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
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