import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom vehicle icon
const createVehicleIcon = (type, isMoving) => {
  const iconMap = {
    'SEDAN': '🚗',
    'SUV': '🚙',
    'VAN': '🚐',
    'TRUCK': '🚚',
    'BUS': '🚌',
    'BIKE': '🏍️'
  };

  const emoji = iconMap[type] || '🚗';
  const color = isMoving ? '#22c55e' : '#94a3b8';

  return L.divIcon({
    html: `
      <div style="
        font-size: 32px;
        text-align: center;
        filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));
        ${isMoving ? 'animation: pulse 2s infinite;' : ''}
      ">
        ${emoji}
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      </style>
    `,
    className: 'custom-vehicle-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

// Pickup icon (green marker)
const pickupIcon = L.divIcon({
  html: `
    <div style="
      width: 24px;
      height: 24px;
      background: #22c55e;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>
  `,
  className: 'custom-marker-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

// Dropoff icon (red marker)
const dropoffIcon = L.divIcon({
  html: `
    <div style="
      width: 24px;
      height: 24px;
      background: #ef4444;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>
  `,
  className: 'custom-marker-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const VehicleMap = ({
  booking,
  centerLocation = [19.0760, 72.8777], // Default: Mumbai
  zoom = 13,
  height = '600px',
  showRoute = true,
  showVehicle = true,
  autoUpdate = true,
  updateInterval = 10000 // 10 seconds
}) => {
  const mapRef = useRef(null);
  const [vehicleLocation, setVehicleLocation] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);

  useEffect(() => {
    if (!autoUpdate || !booking?.vehicle?.id) return;

    // Simulate GPS updates (replace with actual API call)
    const updateVehicleLocation = async () => {
      try {
        // In production, call: GET /api/vehicles/{id}/location
        // For now, simulate movement
        if (booking.status === 'IN_PROGRESS') {
          const pickup = [booking.pickupLatitude, booking.pickupLongitude];
          const dropoff = [booking.dropoffLatitude, booking.dropoffLongitude];

          // Simulate vehicle moving from pickup to dropoff
          const progress = Math.random(); // 0 to 1
          const lat = pickup[0] + (dropoff[0] - pickup[0]) * progress;
          const lng = pickup[1] + (dropoff[1] - pickup[1]) * progress;

          const newLocation = {
            latitude: lat,
            longitude: lng,
            speed: 40 + Math.random() * 20, // 40-60 km/h
            timestamp: new Date()
          };

          setVehicleLocation(newLocation);
          setRoutePoints(prev => [...prev.slice(-20), [lat, lng]]); // Keep last 20 points
        }
      } catch (error) {
        console.error('Error updating vehicle location:', error);
      }
    };

    updateVehicleLocation();
    const interval = setInterval(updateVehicleLocation, updateInterval);

    return () => clearInterval(interval);
  }, [booking, autoUpdate, updateInterval]);

  // Center map on vehicle location if available
  useEffect(() => {
    if (vehicleLocation && mapRef.current) {
      const map = mapRef.current;
      map.setView([vehicleLocation.latitude, vehicleLocation.longitude], zoom);
    }
  }, [vehicleLocation, zoom]);

  if (!booking) {
    return (
      <div className="glass-card p-6">
        <div style={{ height: height }}>
          <MapContainer
            center={centerLocation}
            zoom={zoom}
            style={{ height: '100%', width: '100%', borderRadius: '12px' }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </MapContainer>
        </div>
        <p className="text-center text-white/50 mt-4">No active booking to track</p>
      </div>
    );
  }

  const pickup = booking.pickupLatitude && booking.pickupLongitude
    ? [booking.pickupLatitude, booking.pickupLongitude]
    : null;

  const dropoff = booking.dropoffLatitude && booking.dropoffLongitude
    ? [booking.dropoffLatitude, booking.dropoffLongitude]
    : null;

  const currentVehiclePos = vehicleLocation
    ? [vehicleLocation.latitude, vehicleLocation.longitude]
    : (pickup || centerLocation);

  return (
    <div className="space-y-4">
      <div style={{ height: height }}>
        <MapContainer
          center={currentVehiclePos}
          zoom={zoom}
          style={{ height: '100%', width: '100%', borderRadius: '12px' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Pickup Location */}
          {pickup && (
            <Marker position={pickup} icon={pickupIcon}>
              <Popup>
                <div className="p-2">
                  <strong className="text-green-600">📍 Pickup Location</strong><br />
                  <span className="text-sm">{booking.pickupLocation}</span>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Dropoff Location */}
          {dropoff && (
            <Marker position={dropoff} icon={dropoffIcon}>
              <Popup>
                <div className="p-2">
                  <strong className="text-red-600">🎯 Dropoff Location</strong><br />
                  <span className="text-sm">{booking.dropoffLocation}</span>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Vehicle Location */}
          {showVehicle && vehicleLocation && (
            <>
              <Marker
                position={[vehicleLocation.latitude, vehicleLocation.longitude]}
                icon={createVehicleIcon(booking.vehicle?.type, booking.status === 'IN_PROGRESS')}
              >
                <Popup>
                  <div className="p-2">
                    <strong>🚗 {booking.vehicle?.model}</strong><br />
                    <span className="text-sm">{booking.vehicle?.vehicleNumber}</span><br />
                    {booking.driver && (
                      <>
                        <strong className="text-blue-600">Driver:</strong> {booking.driver.fullName}<br />
                      </>
                    )}
                    {vehicleLocation.speed && (
                      <span className="text-sm text-gray-600">
                        Speed: {Math.round(vehicleLocation.speed)} km/h
                      </span>
                    )}
                  </div>
                </Popup>
              </Marker>

              {/* Speed indicator circle */}
              <Circle
                center={[vehicleLocation.latitude, vehicleLocation.longitude]}
                radius={100}
                fillColor="#22c55e"
                fillOpacity={0.2}
                color="#22c55e"
                weight={1}
              />
            </>
          )}

          {/* Route Line */}
          {showRoute && pickup && dropoff && (
            <Polyline
              positions={vehicleLocation ? [pickup, currentVehiclePos, dropoff] : [pickup, dropoff]}
              color="#3b82f6"
              weight={4}
              opacity={0.7}
              dashArray="10, 10"
            />
          )}

          {/* Traveled route (breadcrumb trail) */}
          {routePoints.length > 0 && (
            <Polyline
              positions={routePoints}
              color="#22c55e"
              weight={3}
              opacity={0.5}
            />
          )}
        </MapContainer>
      </div>

      {/* Trip Info Panel */}
      <div className="glass-card p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-white/60 text-xs mb-1">Status</p>
            <p className={`font-bold text-sm ${booking.status === 'IN_PROGRESS' ? 'text-accent-green' :
                booking.status === 'COMPLETED' ? 'text-accent-blue' :
                  'text-white'
              }`}>
              {booking.status}
            </p>
          </div>

          {vehicleLocation && (
            <>
              <div className="text-center">
                <p className="text-white/60 text-xs mb-1">Speed</p>
                <p className="text-white font-bold text-sm">
                  {Math.round(vehicleLocation.speed || 0)} km/h
                </p>
              </div>

              <div className="text-center">
                <p className="text-white/60 text-xs mb-1">Last Update</p>
                <p className="text-white font-bold text-sm">
                  {new Date(vehicleLocation.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </>
          )}

          <div className="text-center">
            <p className="text-white/60 text-xs mb-1">Vehicle</p>
            <p className="text-white font-bold text-sm">
              {booking.vehicle?.vehicleNumber || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleMap;