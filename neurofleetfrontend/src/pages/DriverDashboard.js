


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('trips');
  const [assignedTrips, setAssignedTrips] = useState([]);
  const [completedTrips, setCompletedTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);
  const [vehicleMetrics, setVehicleMetrics] = useState({
    fuelLevel: 80,
    batteryLevel: 100,
  });
  const username = localStorage.getItem('username');
  const fullName = localStorage.getItem('fullName') || 'Driver';
  const driverId = localStorage.getItem('userId');

  useEffect(() => {
    getDriverLocation();
    loadTrips();
    const interval = setInterval(loadTrips, 15000);
    return () => clearInterval(interval);
  }, []);


  const getDriverLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          console.log(`📍 Got actual location: ${lat}, ${lon}`);
          setDriverLocation([lat, lon]);
        },
        (error) => {
          console.log('Location error:', error);

          // Use username hash instead of userId to ensure consistent distribution
          const usernameHash = username ? username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 1;
          const driverSequence = (usernameHash % 8) + 1; // Force range 1-8

          const cities = [
            { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
            { name: 'Delhi', lat: 28.7041, lon: 77.1025 },
            { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
            { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
            { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
            { name: 'Pune', lat: 18.5204, lon: 73.8567 },
            { name: 'Noida', lat: 28.5355, lon: 77.3910 },
            { name: 'Gurgaon', lat: 28.4595, lon: 77.0266 }
          ];

          const cityIndex = (driverSequence - 1) % cities.length;
          const city = cities[cityIndex];

          const latOffset = (Math.random() - 0.5) * 0.02;
          const lonOffset = (Math.random() - 0.5) * 0.02;

          const finalLat = city.lat + latOffset;
          const finalLon = city.lon + lonOffset;

          console.log(`📍 Driver ${username} (sequence ${driverSequence}) assigned to ${city.name}: ${finalLat}, ${finalLon}`);
          setDriverLocation([finalLat, finalLon]);
        }
      );
    } else {
      // Use username hash for consistent city assignment
      const usernameHash = username ? username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 1;
      const driverSequence = (usernameHash % 8) + 1;

      const cities = [
        { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
        { name: 'Delhi', lat: 28.7041, lon: 77.1025 },
        { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
        { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
        { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
        { name: 'Pune', lat: 18.5204, lon: 73.8567 },
        { name: 'Noida', lat: 28.5355, lon: 77.3910 },
        { name: 'Gurgaon', lat: 28.4595, lon: 77.0266 }
      ];

      const cityIndex = (driverSequence - 1) % cities.length;
      const city = cities[cityIndex];

      const latOffset = (Math.random() - 0.5) * 0.02;
      const lonOffset = (Math.random() - 0.5) * 0.02;

      setDriverLocation([city.lat + latOffset, city.lon + lonOffset]);
    }
  };

  const loadTrips = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [assignedRes, completedRes] = await Promise.all([
        axios.get(`http://localhost:8083/api/driver/bookings?username=${username}`, { headers }),
        axios.get(`http://localhost:8083/api/driver/bookings/completed?username=${username}`, { headers })
      ]);

      setAssignedTrips(assignedRes.data);
      setCompletedTrips(completedRes.data);
    } catch (error) {
      console.error('Error loading trips:', error);
    }
  };

  const handleStartTrip = async (bookingId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8083/api/driver/bookings/${bookingId}/start-trip?username=${username}`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert('✅ Trip started! Customer notified.');
      loadTrips();
    } catch (error) {
      console.error('Start trip error:', error);
      alert('❌ Failed to start trip: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTrip = async (bookingId) => {
    if (!window.confirm('Mark this trip as completed? Customer will be notified to make payment.')) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8083/api/driver/bookings/${bookingId}/complete-trip?username=${username}`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert('✅ Trip completed! Customer will receive payment request. Your earnings will be credited after payment.');
      loadTrips();
    } catch (error) {
      console.error('Complete trip error:', error);
      alert('❌ Failed to complete trip: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMetrics = async () => {
    alert(`📊 Vehicle metrics updated!\nFuel: ${vehicleMetrics.fuelLevel}%\nBattery: ${vehicleMetrics.batteryLevel}%`);
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

  const activeTrips = assignedTrips.filter(t =>
    ['DRIVER_ASSIGNED', 'DRIVER_ACCEPTED', 'CONFIRMED', 'IN_PROGRESS'].includes(t.status)
  );

  const paidTrips = completedTrips.filter(t => t.paymentStatus === 'PAID');
  const totalEarnings = paidTrips.reduce((sum, trip) => sum + (trip.totalPrice * 0.7), 0);
  const pendingEarnings = completedTrips.filter(t => t.paymentStatus !== 'PAID').reduce((sum, trip) => sum + (trip.totalPrice * 0.7), 0);

  const renderContent = () => {
    switch (activeTab) {
      case 'trips':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-white">🚗 Assigned Trips ({activeTrips.length})</h2>
              <div className="text-right">
                <p className="text-white/60 text-sm">Total Earnings (Paid)</p>
                <p className="text-accent-green font-bold text-2xl">${totalEarnings.toFixed(2)}</p>
                {pendingEarnings > 0 && (
                  <p className="text-yellow-400 text-sm">+${pendingEarnings.toFixed(2)} pending</p>
                )}
              </div>
            </div>

            {activeTrips.length > 0 ? (
              <div className="space-y-4">
                {activeTrips.map((trip) => (
                  <div key={trip.id} className="glass-card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{getVehicleIcon(trip.vehicle?.type)}</div>
                        <div>
                          <h4 className="text-lg font-bold text-white">Trip #{trip.id}</h4>
                          <p className="text-white/50 text-sm">Customer: {trip.customer?.fullName}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${trip.status === 'IN_PROGRESS' ? 'bg-accent-cyan/20 text-accent-cyan' :
                        trip.status === 'CONFIRMED' ? 'bg-accent-green/20 text-accent-green' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                        {trip.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-green-400">📍</span>
                          <div className="flex-1">
                            <p className="text-white/60 text-xs">Pickup</p>
                            <p className="text-white font-semibold text-sm">{trip.pickupLocation}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-pink-400">🏁</span>
                          <div className="flex-1">
                            <p className="text-white/60 text-xs">Dropoff</p>
                            <p className="text-white font-semibold text-sm">{trip.dropoffLocation}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400">{getVehicleIcon(trip.vehicle?.type)}</span>
                          <div className="flex-1">
                            <p className="text-white/60 text-xs">Vehicle</p>
                            <p className="text-white font-semibold text-sm">
                              {trip.vehicle?.model} ({trip.vehicle?.vehicleNumber})
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400">📅</span>
                          <div className="flex-1">
                            <p className="text-white/60 text-xs">Start Time</p>
                            <p className="text-white font-semibold text-sm">
                              {new Date(trip.startTime).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <p className="text-white/60 text-sm">Trip Payment</p>
                        <p className="text-accent-green font-bold text-2xl">
                          ${trip.totalPrice?.toFixed(2) || '0.00'}
                        </p>
                        <p className="text-white/50 text-xs">Your earnings: ${((trip.totalPrice || 0) * 0.7).toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2">
                        {trip.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleStartTrip(trip.id)}
                            disabled={loading}
                            className="btn-primary"
                          >
                            🚀 Start Trip
                          </button>
                        )}
                        {trip.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => handleCompleteTrip(trip.id)}
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
              <div className="glass-card p-12 text-center">
                <div className="text-6xl mb-4">🚗</div>
                <p className="text-white/50 mb-2">No assigned trips</p>
                <p className="text-white/30 text-sm">New trips will appear here once assigned by manager</p>
              </div>
            )}
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-white">💳 Earnings & Payment History</h2>
              <div className="glass-card p-4">
                <p className="text-white/60 text-sm">Total Confirmed Earnings</p>
                <p className="text-accent-green font-bold text-3xl">${totalEarnings.toFixed(2)}</p>
                {pendingEarnings > 0 && (
                  <p className="text-yellow-400 text-sm mt-1">+${pendingEarnings.toFixed(2)} pending payment</p>
                )}
              </div>
            </div>

            <div className="glass-card p-6">
              {paidTrips.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                      <p className="text-white/60 text-sm mb-1">Completed Trips</p>
                      <p className="text-white font-bold text-2xl">{paidTrips.length}</p>
                    </div>
                    <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                      <p className="text-white/60 text-sm mb-1">Avg Earnings/Trip</p>
                      <p className="text-white font-bold text-2xl">
                        ${paidTrips.length > 0 ? (totalEarnings / paidTrips.length).toFixed(2) : '0.00'}
                      </p>
                    </div>
                    <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                      <p className="text-white/60 text-sm mb-1">This Month</p>
                      <p className="text-white font-bold text-2xl">
                        ${paidTrips.filter(t => {
                          const tripDate = new Date(t.completedAt);
                          const now = new Date();
                          return tripDate.getMonth() === now.getMonth() && tripDate.getFullYear() === now.getFullYear();
                        }).reduce((sum, t) => sum + (t.totalPrice * 0.7), 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4">Confirmed Payments</h3>
                  <div className="space-y-3">
                    {paidTrips.slice().reverse().map((trip) => (
                      <div key={trip.id} className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl hover:bg-dark-700/60 transition">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-3xl">{getVehicleIcon(trip.vehicle?.type)}</div>
                          <div>
                            <p className="text-white font-semibold">Trip #{trip.id}</p>
                            <p className="text-white/50 text-sm">
                              {trip.pickupLocation} → {trip.dropoffLocation}
                            </p>
                            <p className="text-white/30 text-xs mt-1">
                              {new Date(trip.completedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white/60 text-xs mb-1">Your Earnings (70%)</p>
                          <p className="text-accent-green font-bold text-xl">
                            ${((trip.totalPrice || 0) * 0.7).toFixed(2)}
                          </p>
                          <p className="text-white/50 text-xs">
                            Total: ${(trip.totalPrice || 0).toFixed(2)}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                            ✓ Paid via {trip.paymentMethod || 'CARD'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {pendingEarnings > 0 && (
                    <div className="mt-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                      <h4 className="text-white font-bold mb-2">⏳ Pending Payments</h4>
                      <p className="text-white/70 text-sm">
                        ${pendingEarnings.toFixed(2)} from {completedTrips.filter(t => t.paymentStatus !== 'PAID').length} trip(s) awaiting customer payment
                      </p>
                      <div className="mt-3 space-y-2">
                        {completedTrips.filter(t => t.paymentStatus !== 'PAID').map(trip => (
                          <div key={trip.id} className="flex justify-between text-sm">
                            <span className="text-white/60">Trip #{trip.id}</span>
                            <span className="text-yellow-400 font-semibold">${((trip.totalPrice || 0) * 0.7).toFixed(2)} pending</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💳</div>
                  <p className="text-white/50 mb-2">No payment history yet</p>
                  <p className="text-white/30 text-sm">Complete trips to see your earnings here</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'metrics':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">📊 Vehicle Metrics</h2>
            <div className="glass-card p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm font-semibold mb-3">
                    ⛽ Fuel Level (%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={vehicleMetrics.fuelLevel}
                    onChange={(e) => setVehicleMetrics({ ...vehicleMetrics, fuelLevel: parseInt(e.target.value) })}
                    className="w-full h-3 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-accent-green"
                  />
                  <div className="flex justify-between text-sm mt-3">
                    <span className="text-white/60">0%</span>
                    <span className="text-white font-bold text-xl">{vehicleMetrics.fuelLevel}%</span>
                    <span className="text-white/60">100%</span>
                  </div>
                  <div className="mt-4 p-3 bg-dark-700/40 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Status:</span>
                      <span className={`font-bold ${vehicleMetrics.fuelLevel > 50 ? 'text-accent-green' :
                        vehicleMetrics.fuelLevel > 20 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                        {vehicleMetrics.fuelLevel > 50 ? 'Good' :
                          vehicleMetrics.fuelLevel > 20 ? 'Low' : 'Critical'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-semibold mb-3">
                    🔋 Battery Level (%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={vehicleMetrics.batteryLevel}
                    onChange={(e) => setVehicleMetrics({ ...vehicleMetrics, batteryLevel: parseInt(e.target.value) })}
                    className="w-full h-3 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
                  />
                  <div className="flex justify-between text-sm mt-3">
                    <span className="text-white/60">0%</span>
                    <span className="text-white font-bold text-xl">{vehicleMetrics.batteryLevel}%</span>
                    <span className="text-white/60">100%</span>
                  </div>
                  <div className="mt-4 p-3 bg-dark-700/40 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Status:</span>
                      <span className={`font-bold ${vehicleMetrics.batteryLevel > 50 ? 'text-accent-cyan' :
                        vehicleMetrics.batteryLevel > 20 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                        {vehicleMetrics.batteryLevel > 50 ? 'Charged' :
                          vehicleMetrics.batteryLevel > 20 ? 'Low' : 'Critical'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleUpdateMetrics}
                className="btn-primary w-full mt-6"
              >
                💾 Update Vehicle Metrics
              </button>
            </div>
          </div>
        );

      case 'map':
        const activeTrip = activeTrips.find(t => t.status === 'IN_PROGRESS');
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">📍 Your Current Location</h2>
            <div className="glass-card p-6">
              {activeTrip && (
                <div className="mb-4 p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-bold mb-1">Active Trip #{activeTrip.id}</h4>
                      <p className="text-white/70 text-sm">Navigate to: {activeTrip.dropoffLocation}</p>
                    </div>
                    <div className="text-cyan-400 font-bold text-lg">🔴 LIVE</div>
                  </div>
                </div>
              )}

              {driverLocation ? (
                <div style={{ height: '600px', width: '100%' }} className="rounded-xl overflow-hidden">
                  <MapContainer
                    center={driverLocation}
                    zoom={14}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap'
                    />
                    <Marker position={driverLocation}>
                      <Popup>
                        <strong>📍 Your Location</strong><br />
                        Driver: {fullName}
                      </Popup>
                    </Marker>

                    {activeTrip && (
                      <Marker position={[activeTrip.dropoffLatitude, activeTrip.dropoffLongitude]}>
                        <Popup>
                          <strong>🏁 Destination</strong><br />
                          {activeTrip.dropoffLocation}
                        </Popup>
                      </Marker>
                    )}
                  </MapContainer>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-white/50">Loading your location...</p>
                </div>
              )}

              <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-white/70 text-sm">
                  📍 This map shows YOUR current location. {activeTrip ? 'Navigate to the destination marked on the map.' : 'Start a trip to see your destination.'}
                </p>
              </div>
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
              <h1 className="text-lg font-bold text-white">Driver Portal</h1>
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
              { id: 'trips', label: '🚗 Assigned Trips' },
              { id: 'payment', label: '💳 Earnings' },
              { id: 'metrics', label: '📊 Metrics' },
              { id: 'map', label: '📍 Location' },
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

export default DriverDashboard;