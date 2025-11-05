import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom vehicle icon
const createVehicleIcon = () => {
  return L.divIcon({
    className: 'custom-vehicle-icon',
    html: `<div style="
      width: 32px; 
      height: 32px; 
      background: linear-gradient(135deg, #10b981, #06b6d4);
      border-radius: 50%;
      border: 3px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5);
    ">🚗</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const LiveMap = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Center of India

  useEffect(() => {
    loadVehicles();
    // Refresh every 5 seconds
    const interval = setInterval(loadVehicles, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8083/api/driver/vehicles', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setVehicles(response.data);

      // Auto-select first vehicle if none selected
      if (!selectedVehicle && response.data.length > 0) {
        const firstVehicle = response.data[0];
        if (firstVehicle.latitude && firstVehicle.longitude) {
          setSelectedVehicle(firstVehicle);
          setMapCenter([firstVehicle.latitude, firstVehicle.longitude]);
        }
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    if (vehicle.latitude && vehicle.longitude) {
      setMapCenter([vehicle.latitude, vehicle.longitude]);
    }
  };

  const getIndianCity = (lat, lon) => {
    // Map coordinates to Indian cities
    if (lat >= 18 && lat <= 20 && lon >= 72 && lon <= 73) return 'Mumbai';
    if (lat >= 28 && lat <= 29 && lon >= 76 && lon <= 78) return 'Delhi';
    if (lat >= 12 && lat <= 13 && lon >= 77 && lon <= 78) return 'Bangalore';
    if (lat >= 18 && lat <= 19 && lon >= 73 && lon <= 74) return 'Pune';
    if (lat >= 13 && lat <= 14 && lon >= 80 && lon <= 81) return 'Chennai';
    return 'India';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          📍 Live Map - India
        </h2>
        <p className="text-white/50">Real-time GPS tracking across Indian cities</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-accent-green animate-pulse"></span>
          <span className="text-white/70 text-sm">Live</span>
          <span className="text-white/50 text-sm">• {vehicles.length} vehicles tracked</span>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="rounded-xl overflow-hidden border border-white/10" style={{ height: '500px' }}>
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {vehicles.map((vehicle) => (
              vehicle.latitude && vehicle.longitude && (
                <Marker
                  key={vehicle.id}
                  position={[vehicle.latitude, vehicle.longitude]}
                  icon={createVehicleIcon()}
                  eventHandlers={{
                    click: () => handleVehicleSelect(vehicle),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg">{vehicle.vehicleNumber}</h3>
                      <p className="text-sm">{vehicle.model}</p>
                      <p className="text-sm">City: {getIndianCity(vehicle.latitude, vehicle.longitude)}</p>
                      <p className="text-sm">Status: {vehicle.status}</p>
                      <p className="text-sm">Speed: {vehicle.speed || 0} km/h</p>
                      {vehicle.isElectric ? (
                        <p className="text-sm">Battery: {vehicle.batteryLevel}%</p>
                      ) : (
                        <p className="text-sm">Fuel: {vehicle.fuelLevel}%</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Current Vehicle</h3>
          {selectedVehicle ? (
            <div className="space-y-4">
              <div className="p-4 bg-accent-green/10 border border-accent-green/30 rounded-xl">
                <p className="text-accent-green text-sm font-semibold mb-1">{selectedVehicle.vehicleNumber}</p>
                <p className="text-white font-bold">{selectedVehicle.model}</p>
                <p className="text-white/50 text-sm">{getIndianCity(selectedVehicle.latitude, selectedVehicle.longitude)}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-dark-700/40 rounded-lg">
                  <span className="text-white/60">Status</span>
                  <span className="text-white font-bold">{selectedVehicle.status}</span>
                </div>
                <div className="flex justify-between p-3 bg-dark-700/40 rounded-lg">
                  <span className="text-white/60">Speed</span>
                  <span className="text-white font-bold">{selectedVehicle.speed || 0} km/h</span>
                </div>
                <div className="flex justify-between p-3 bg-dark-700/40 rounded-lg">
                  <span className="text-white/60">{selectedVehicle.isElectric ? 'Battery' : 'Fuel'}</span>
                  <span className="text-white font-bold">
                    {selectedVehicle.isElectric ? selectedVehicle.batteryLevel : selectedVehicle.fuelLevel}%
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-white/50">
              <p>Select a vehicle from the map</p>
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">All Vehicles</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => handleVehicleSelect(vehicle)}
                className={`p-3 bg-dark-700/40 rounded-lg cursor-pointer transition-all ${selectedVehicle?.id === vehicle.id
                  ? 'border-accent-green bg-accent-green/10 border'
                  : 'border border-white/5 hover:border-white/20'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">{vehicle.vehicleNumber}</p>
                    <p className="text-white/50 text-xs">{getIndianCity(vehicle.latitude, vehicle.longitude)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-xs">{vehicle.speed || 0} km/h</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;