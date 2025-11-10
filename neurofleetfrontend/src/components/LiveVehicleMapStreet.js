import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { vehicleService } from '../services/api';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom vehicle marker icons
const createVehicleIcon = (type, status) => {
  const emoji = {
    SEDAN: '🚗',
    SUV: '🚙',
    VAN: '🚐',
    TRUCK: '🚚',
    BUS: '🚌',
    BIKE: '🏍️'
  }[type] || '🚗';

  const color = {
    AVAILABLE: '#10b981',
    IN_USE: '#f59e0b',
    MAINTENANCE: '#ef4444',
    OUT_OF_SERVICE: '#6b7280'
  }[status] || '#6b7280';

  return L.divIcon({
    html: `
      <div style="
        font-size: 2rem;
        text-align: center;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        position: relative;
      ">
        <div style="
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 12px;
          background: ${color};
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        "></div>
        ${emoji}
      </div>
    `,
    className: 'custom-vehicle-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

// Component to automatically adjust map bounds
const MapBoundsAdjuster = ({ vehicles }) => {
  const map = useMap();

  useEffect(() => {
    if (vehicles.length > 0) {
      const bounds = vehicles.map(v => [v.latitude, v.longitude]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [vehicles, map]);

  return null;
};

const LiveVehicleMapStreet = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    loadVehicleLocations();
    const interval = setInterval(() => {
      loadVehicleLocations();
      setLastUpdate(new Date());
    }, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadVehicleLocations = async () => {
    try {
      const response = await vehicleService.getAllForCustomer();
      // Filter vehicles with GPS coordinates and valid status
      const vehiclesWithGPS = response.data.filter(
        v => v.latitude && v.longitude &&
          (v.status === 'AVAILABLE' || v.status === 'IN_USE')
      );
      setVehicles(vehiclesWithGPS);
      setLoading(false);
    } catch (error) {
      console.error('Error loading vehicle locations:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return '#10b981';
      case 'IN_USE':
        return '#f59e0b';
      case 'MAINTENANCE':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const defaultCenter = [40.7128, -74.0060]; // New York City
  const defaultZoom = 13;

  if (loading) {
    return (
      <div className="live-map-street-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading street map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="live-map-street-container">
      <div className="live-map-header">
        <div>
          <h2 className="live-map-title">📍 Live Vehicle Tracking</h2>
          <p className="live-map-subtitle">
            {vehicles.length} vehicles • Last update: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <div className="map-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#10b981' }}></span>
            Available
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#f59e0b' }}></span>
            In Use
          </div>
        </div>
      </div>

      <div className="map-container-wrapper">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '600px', width: '100%', borderRadius: '12px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapBoundsAdjuster vehicles={vehicles} />

          {vehicles.map((vehicle) => (
            <Marker
              key={vehicle.id}
              position={[vehicle.latitude, vehicle.longitude]}
              icon={createVehicleIcon(vehicle.type, vehicle.status)}
              eventHandlers={{
                click: () => setSelectedVehicle(vehicle),
              }}
            >
              <Popup>
                <div className="vehicle-popup">
                  <div className="popup-header">
                    <strong>{vehicle.manufacturer} {vehicle.model}</strong>
                    <span
                      className="status-badge-small"
                      style={{ backgroundColor: getStatusColor(vehicle.status) }}
                    >
                      {vehicle.status}
                    </span>
                  </div>
                  <div className="popup-details">
                    <div className="popup-row">
                      <span>Vehicle #:</span>
                      <span>{vehicle.vehicleNumber}</span>
                    </div>
                    <div className="popup-row">
                      <span>Type:</span>
                      <span>{vehicle.type}</span>
                    </div>
                    <div className="popup-row">
                      <span>Capacity:</span>
                      <span>{vehicle.capacity} seats</span>
                    </div>
                    {vehicle.speed !== null && vehicle.speed > 0 && (
                      <div className="popup-row">
                        <span>Speed:</span>
                        <span className="speed-text">{vehicle.speed.toFixed(0)} mph</span>
                      </div>
                    )}
                    {vehicle.isElectric && vehicle.batteryLevel && (
                      <div className="popup-row">
                        <span>Battery:</span>
                        <span>{vehicle.batteryLevel}%</span>
                      </div>
                    )}
                    {!vehicle.isElectric && vehicle.fuelLevel && (
                      <div className="popup-row">
                        <span>Fuel:</span>
                        <span>{vehicle.fuelLevel}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {selectedVehicle && (
        <div className="vehicle-info-card">
          <div className="info-card-header">
            <div className="vehicle-header-content">
              <h3>{selectedVehicle.manufacturer} {selectedVehicle.model}</h3>
              <p className="vehicle-number">{selectedVehicle.vehicleNumber}</p>
            </div>
            <button
              className="close-info-btn"
              onClick={() => setSelectedVehicle(null)}
            >
              ×
            </button>
          </div>
          <div className="info-card-body">
            <div className="info-row">
              <span className="info-label">Status:</span>
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(selectedVehicle.status) }}
              >
                {selectedVehicle.status}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Type:</span>
              <span>{selectedVehicle.type}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Capacity:</span>
              <span>{selectedVehicle.capacity} seats</span>
            </div>
            <div className="info-row">
              <span className="info-label">Location:</span>
              <span className="coordinates">
                {selectedVehicle.latitude.toFixed(4)}, {selectedVehicle.longitude.toFixed(4)}
              </span>
            </div>
            {selectedVehicle.speed !== null && (
              <div className="info-row">
                <span className="info-label">Speed:</span>
                <span>{selectedVehicle.speed.toFixed(1)} mph</span>
              </div>
            )}
            {selectedVehicle.isElectric && selectedVehicle.batteryLevel && (
              <div className="info-row">
                <span className="info-label">Battery:</span>
                <div className="battery-bar">
                  <div
                    className="battery-fill"
                    style={{ width: `${selectedVehicle.batteryLevel}%` }}
                  ></div>
                  <span className="battery-text">{selectedVehicle.batteryLevel}%</span>
                </div>
              </div>
            )}
            {!selectedVehicle.isElectric && selectedVehicle.fuelLevel && (
              <div className="info-row">
                <span className="info-label">Fuel:</span>
                <div className="battery-bar">
                  <div
                    className="battery-fill fuel"
                    style={{ width: `${selectedVehicle.fuelLevel}%` }}
                  ></div>
                  <span className="battery-text">{selectedVehicle.fuelLevel}%</span>
                </div>
              </div>
            )}
            {selectedVehicle.healthScore && (
              <div className="info-row">
                <span className="info-label">Health:</span>
                <span>{selectedVehicle.healthScore}%</span>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .live-map-street-container {
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .live-map-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          color: white;
        }

        .live-map-title {
          font-size: 1.75rem;
          font-weight: bold;
          margin: 0;
        }

        .live-map-subtitle {
          margin: 0.5rem 0 0 0;
          opacity: 0.9;
          font-size: 0.875rem;
        }

        .map-legend {
          display: flex;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .map-container-wrapper {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          position: relative;
        }

        .vehicle-popup {
          min-width: 200px;
        }

        .popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.5rem;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .status-badge-small {
          padding: 0.125rem 0.5rem;
          border-radius: 12px;
          font-size: 0.625rem;
          font-weight: 600;
          color: white;
        }

        .popup-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .popup-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
        }

        .popup-row span:first-child {
          color: #6b7280;
          font-weight: 500;
        }

        .speed-text {
          color: #ef4444;
          font-weight: 600;
        }

        .vehicle-info-card {
          position: absolute;
          top: 5rem;
          right: 2rem;
          background: white;
          border-radius: 12px;
          padding: 1.25rem;
          width: 320px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .info-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .vehicle-header-content h3 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 700;
          color: #1f2937;
        }

        .vehicle-number {
          margin: 0.25rem 0 0 0;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .close-info-btn {
          background: none;
          border: none;
          font-size: 1.75rem;
          cursor: pointer;
          color: #9ca3af;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .close-info-btn:hover {
          background: #f3f4f6;
          color: #1f2937;
        }

        .info-card-body {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
        }

        .info-label {
          font-weight: 600;
          color: #4b5563;
        }

        .coordinates {
          font-family: monospace;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .status-badge {
          padding: 0.375rem 0.875rem;
          border-radius: 16px;
          font-size: 0.75rem;
          font-weight: 700;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .battery-bar {
          position: relative;
          width: 120px;
          height: 20px;
          background: #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
        }

        .battery-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          transition: width 0.3s ease;
        }

        .battery-fill.fuel {
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
        }

        .battery-text {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          font-size: 0.625rem;
          font-weight: 700;
          color: #1f2937;
          z-index: 1;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: white;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .custom-vehicle-marker {
          background: none;
          border: none;
        }

        @media (max-width: 768px) {
          .vehicle-info-card {
            top: auto;
            bottom: 1rem;
            right: 1rem;
            left: 1rem;
            width: auto;
          }

          .map-legend {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LiveVehicleMapStreet;