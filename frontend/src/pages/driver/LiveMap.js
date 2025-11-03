import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LocationIcon, RouteIcon } from '../../components/Icons';
import webSocketService from '../../services/WebSocketService';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom vehicle icon
const createVehicleIcon = (isMoving) => {
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
      ${isMoving ? 'animation: pulse 2s infinite;' : ''}
    ">🚗</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Map auto-center component
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

const LiveMap = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // NYC default
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const subscriptionRef = useRef(null);

  // Sample route coordinates (you can replace with real route data)
  const routeCoordinates = [
    [40.7128, -74.0060],
    [40.7150, -74.0050],
    [40.7180, -74.0030],
    [40.7200, -74.0010],
  ];

  useEffect(() => {
    console.log('LiveMap: Initializing WebSocket connection...');
    
    webSocketService.connect(() => {
      console.log('LiveMap: WebSocket connected successfully');
      setConnectionStatus('Connected');
      
      subscriptionRef.current = webSocketService.subscribe('/topic/telemetry', (data) => {
        console.log('LiveMap: Received telemetry data:', data);
        setVehicles(data);
        
        setSelectedVehicle(prev => {
          // Auto-select first vehicle if none selected
          if (!prev && data.length > 0) {
            const firstVehicle = data[0];
            if (firstVehicle.latitude && firstVehicle.longitude) {
              setMapCenter([firstVehicle.latitude, firstVehicle.longitude]);
            }
            return firstVehicle;
          } else if (prev) {
            // Update selected vehicle data
            const updated = data.find(v => v.id === prev.id);
            if (updated) {
              if (updated.latitude && updated.longitude) {
                setMapCenter([updated.latitude, updated.longitude]);
              }
              return updated;
            }
          }
          return prev;
        });
      });
    });

    return () => {
      console.log('LiveMap: Cleaning up WebSocket subscription');
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []);

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    if (vehicle.latitude && vehicle.longitude) {
      setMapCenter([vehicle.latitude, vehicle.longitude]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <LocationIcon size="lg" className="text-accent-green" />
          Live Map View
        </h2>
        <p className="text-white/50">Real-time GPS tracking and navigation</p>
        <div className="mt-2 flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${connectionStatus === 'Connected' ? 'bg-accent-green animate-pulse' : 'bg-red-500'}`}></span>
          <span className="text-white/70 text-sm">{connectionStatus}</span>
          <span className="text-white/50 text-sm">• {vehicles.length} vehicles tracked</span>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="rounded-xl overflow-hidden border border-white/10" style={{ height: '500px' }}>
          <MapContainer 
            center={mapCenter} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={mapCenter} />
            
            {/* Route line */}
            <Polyline 
              positions={routeCoordinates} 
              color="#10b981" 
              weight={4}
              opacity={0.7}
            />

            {/* Vehicle markers */}
            {vehicles.map((vehicle) => (
              vehicle.latitude && vehicle.longitude && (
                <Marker 
                  key={vehicle.id}
                  position={[vehicle.latitude, vehicle.longitude]}
                  icon={createVehicleIcon(vehicle.status === 'IN_USE')}
                  eventHandlers={{
                    click: () => handleVehicleSelect(vehicle),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg">{vehicle.vehicleNumber}</h3>
                      <p className="text-sm">{vehicle.model}</p>
                      <p className="text-sm">Status: <span className={vehicle.status === 'IN_USE' ? 'text-green-600' : 'text-gray-600'}>{vehicle.status}</span></p>
                      <p className="text-sm">Speed: {vehicle.speed ? vehicle.speed.toFixed(1) : '0'} km/h</p>
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
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <RouteIcon size="md" className="text-accent-cyan" />
            Current Vehicle
          </h3>
          {selectedVehicle ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-accent-green/10 border border-accent-green/30 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center">
                  <span className="text-2xl">🚗</span>
                </div>
                <div>
                  <p className="text-accent-green text-sm font-semibold mb-1">{selectedVehicle.vehicleNumber}</p>
                  <p className="text-white font-bold">{selectedVehicle.model}</p>
                  <p className="text-white/50 text-sm">{selectedVehicle.manufacturer}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-dark-700/40 rounded-lg">
                  <span className="text-white/60 text-sm">Status</span>
                  <span className={`font-bold text-sm ${selectedVehicle.status === 'IN_USE' ? 'text-accent-green' : 'text-white/70'}`}>
                    {selectedVehicle.status}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-700/40 rounded-lg">
                  <span className="text-white/60 text-sm">Speed</span>
                  <span className="text-white font-bold text-sm">{selectedVehicle.speed ? selectedVehicle.speed.toFixed(1) : '0'} km/h</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-700/40 rounded-lg">
                  <span className="text-white/60 text-sm">Mileage</span>
                  <span className="text-white font-bold text-sm">{selectedVehicle.mileage} km</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-700/40 rounded-lg">
                  <span className="text-white/60 text-sm">{selectedVehicle.isElectric ? 'Battery' : 'Fuel'}</span>
                  <span className="text-white font-bold text-sm">
                    {selectedVehicle.isElectric ? selectedVehicle.batteryLevel : selectedVehicle.fuelLevel}%
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-white/50">
              <p>Select a vehicle from the map to view details</p>
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">All Vehicles</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => handleVehicleSelect(vehicle)}
                  className={`p-3 bg-dark-700/40 rounded-lg border cursor-pointer transition-all ${
                    selectedVehicle?.id === vehicle.id 
                      ? 'border-accent-green bg-accent-green/10' 
                      : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold text-sm">{vehicle.vehicleNumber}</p>
                      <p className="text-white/50 text-xs">{vehicle.model}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-semibold ${vehicle.status === 'IN_USE' ? 'text-accent-green' : 'text-white/50'}`}>
                        {vehicle.status}
                      </p>
                      <p className="text-white/70 text-xs">{vehicle.speed ? vehicle.speed.toFixed(1) : '0'} km/h</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-white/50">
                <p>No vehicles available</p>
                <p className="text-xs mt-2">Make sure the backend is running</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
