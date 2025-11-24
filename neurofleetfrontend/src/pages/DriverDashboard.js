import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { RouteIcon, LocationIcon, LogoutIcon, VehicleIcon, CalendarIcon } from '../components/Icons';

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
  const [loading, setLoading] = useState(false);
  const [vehicleMetrics, setVehicleMetrics] = useState({
    fuelLevel: 80,
    batteryLevel: 100,
  });
  const [currentLocation, setCurrentLocation] = useState([19.0760, 72.8777]); // Mumbai
  const username = localStorage.getItem('username');
  const fullName = localStorage.getItem('fullName') || 'Driver';

  useEffect(() => {
    loadAssignedTrips();
    const interval = setInterval(loadAssignedTrips, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadAssignedTrips = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8083/api/driver/bookings?username=${username}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setAssignedTrips(response.data);
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
      alert('✅ Trip started!');
      loadAssignedTrips();
    } catch (error) {
      alert('❌ Failed to start trip');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTrip = async (bookingId) => {
    if (!window.confirm('Complete this trip?')) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8083/api/driver/bookings/${bookingId}/complete-trip?username=${username}`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert('✅ Trip completed! Earnings updated.');
      loadAssignedTrips();
    } catch (error) {
      alert('❌ Failed to complete trip');
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

  const activeTrips = assignedTrips.filter(t =>
    ['DRIVER_ASSIGNED', 'DRIVER_ACCEPTED', 'CONFIRMED', 'IN_PROGRESS'].includes(t.status)
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'metrics':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Vehicle Metrics Input</h2>
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
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Route Map (India)</h2>
            <div className="glass-card p-6">
              <div style={{ height: '600px', width: '100%' }}>
                <MapContainer
                  center={currentLocation}
                  zoom={13}
                  style={{ height: '100%', width: '100%', borderRadius: '12px' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  <Marker position={currentLocation}>
                    <Popup>
                      <strong>Your Current Location</strong><br />
                      Mumbai, India
                    </Popup>
                  </Marker>
                  {activeTrips[0] && (
                    <>
                      <Marker position={[19.0896, 72.8656]}>
                        <Popup>
                          <strong>Pickup Location</strong><br />
                          {activeTrips[0].pickupLocation}
                        </Popup>
                      </Marker>
                      <Marker position={[19.0652, 72.8489]}>
                        <Popup>
                          <strong>Drop Location</strong><br />
                          {activeTrips[0].dropoffLocation}
                        </Popup>
                      </Marker>
                      <Polyline
                        positions={[
                          currentLocation,
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
            </div>
          </div>
        );

      default: // trips
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Assigned Trips ({activeTrips.length})</h2>
            {activeTrips.length > 0 ? (
              <div className="space-y-4">
                {activeTrips.map((trip) => (
                  <div key={trip.id} className="glass-card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-white">Trip #{trip.id}</h4>
                        <p className="text-white/50 text-sm">Customer: {trip.customer?.fullName}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${trip.status === 'IN_PROGRESS' ? 'bg-accent-cyan/20 text-accent-cyan' :
                          trip.status === 'CONFIRMED' ? 'bg-accent-green/20 text-accent-green' :
                            'bg-yellow-500/20 text-yellow-400'
                        }`}>
                        {trip.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <VehicleIcon size="sm" className="text-accent-cyan" />
                          <span className="text-white/60">Vehicle:</span>
                          <span className="text-white font-semibold">
                            {trip.vehicle?.model} ({trip.vehicle?.vehicleNumber})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon size="sm" className="text-accent-cyan" />
                          <span className="text-white/60">Start:</span>
                          <span className="text-white font-semibold">
                            {new Date(trip.startTime).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <LocationIcon size="sm" className="text-accent-green mt-0.5" />
                          <div className="flex-1">
                            <p className="text-white/60 text-sm">Pickup</p>
                            <p className="text-white font-semibold text-sm">{trip.pickupLocation}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <LocationIcon size="sm" className="text-accent-pink mt-0.5" />
                          <div className="flex-1">
                            <p className="text-white/60 text-sm">Dropoff</p>
                            <p className="text-white font-semibold text-sm">{trip.dropoffLocation}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <p className="text-white/60 text-sm">Trip Payment</p>
                        <p className="text-accent-green font-bold text-2xl">
                          ${trip.totalPrice?.toFixed(2)}
                        </p>
                        <p className="text-white/50 text-xs">Your earnings: ${(trip.totalPrice * 0.7)?.toFixed(2)}</p>
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
                <RouteIcon size="xl" className="text-white/20 mx-auto mb-4" />
                <p className="text-white/50">No assigned trips</p>
              </div>
            )}
          </div>
        );
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
              <h1 className="text-lg font-bold text-white">Driver Portal</h1>
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
          <div className="flex gap-2 pb-3">
            {[
              { id: 'trips', label: 'Assigned Trips' },
              { id: 'metrics', label: 'Vehicle Metrics' },
              { id: 'map', label: 'Route Map' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === tab.id
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