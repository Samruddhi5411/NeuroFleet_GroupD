import React, { useState, useEffect } from 'react';
import { vehicleService } from '../services/api';

const LiveVehicleMap = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicleLocations();
    const interval = setInterval(loadVehicleLocations, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadVehicleLocations = async () => {
    try {
      const response = await vehicleService.getActiveVehicleLocations();
      setVehicles(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading vehicle locations:', error);
      setLoading(false);
    }
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'SEDAN':
        return '🚗';
      case 'SUV':
        return '🚙';
      case 'VAN':
        return '🚐';
      case 'TRUCK':
        return '🚚';
      case 'BUS':
        return '🚌';
      case 'BIKE':
        return '🏍️';
      default:
        return '🚗';
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

  const calculateMapBounds = () => {
    if (vehicles.length === 0) {
      return { minLat: 40.7128, maxLat: 40.7128, minLng: -74.0060, maxLng: -74.0060 };
    }

    const lats = vehicles.map(v => v.latitude);
    const lngs = vehicles.map(v => v.longitude);

    return {
      minLat: Math.min(...lats) - 0.02,
      maxLat: Math.max(...lats) + 0.02,
      minLng: Math.min(...lngs) - 0.02,
      maxLng: Math.max(...lngs) + 0.02,
    };
  };

  const bounds = calculateMapBounds();
  const latRange = bounds.maxLat - bounds.minLat;
  const lngRange = bounds.maxLng - bounds.minLng;

  const getVehiclePosition = (lat, lng) => {
    const x = ((lng - bounds.minLng) / lngRange) * 100;
    const y = ((bounds.maxLat - lat) / latRange) * 100;
    return { x, y };
  };

  if (loading) {
    return (
      <div className="live-map-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading vehicle locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="live-map-container">
      <div className="live-map-header">
        <div>
          <h2 className="live-map-title">Live Vehicle Tracking</h2>
          <p className="live-map-subtitle">
            {vehicles.length} vehicles tracked in real-time
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

      <div className="map-view">
        <div className="map-canvas">
          {vehicles.map((vehicle) => {
            const pos = getVehiclePosition(vehicle.latitude, vehicle.longitude);
            return (
              <div
                key={vehicle.id}
                className={`vehicle-marker ${selectedVehicle?.id === vehicle.id ? 'selected' : ''}`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  color: getStatusColor(vehicle.status),
                }}
                onClick={() => setSelectedVehicle(vehicle)}
                title={`${vehicle.manufacturer} ${vehicle.model}`}
              >
                <div className="marker-icon">
                  {getVehicleIcon(vehicle.type)}
                </div>
                {vehicle.status === 'IN_USE' && vehicle.speed > 0 && (
                  <div className="speed-badge">{vehicle.speed.toFixed(0)} mph</div>
                )}
              </div>
            );
          })}
        </div>

        {selectedVehicle && (
          <div className="vehicle-info-card">
            <div className="info-card-header">
              <span className="vehicle-emoji">
                {getVehicleIcon(selectedVehicle.type)}
              </span>
              <div>
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
                <span>
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
                  <span>{selectedVehicle.batteryLevel}%</span>
                </div>
              )}
              {!selectedVehicle.isElectric && selectedVehicle.fuelLevel && (
                <div className="info-row">
                  <span className="info-label">Fuel:</span>
                  <span>{selectedVehicle.fuelLevel}%</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .live-map-container {
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
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0;
        }

        .live-map-subtitle {
          margin: 0.25rem 0 0 0;
          opacity: 0.9;
        }

        .map-legend {
          display: flex;
          gap: 1rem;
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

        .map-view {
          position: relative;
          background: linear-gradient(to bottom, #e0f2fe 0%, #dbeafe 100%);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .map-canvas {
          position: relative;
          width: 100%;
          height: 500px;
          background-image: 
            linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .vehicle-marker {
          position: absolute;
          transform: translate(-50%, -50%);
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .vehicle-marker:hover {
          transform: translate(-50%, -50%) scale(1.2);
        }

        .vehicle-marker.selected {
          z-index: 20;
          transform: translate(-50%, -50%) scale(1.3);
        }

        .marker-icon {
          font-size: 2rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .speed-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ef4444;
          color: white;
          font-size: 0.625rem;
          padding: 2px 6px;
          border-radius: 8px;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .vehicle-info-card {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: white;
          border-radius: 12px;
          padding: 1rem;
          width: 300px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          z-index: 30;
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
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .vehicle-emoji {
          font-size: 2rem;
        }

        .info-card-header h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .vehicle-number {
          margin: 0.25rem 0 0 0;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .close-info-btn {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6b7280;
          padding: 0;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .close-info-btn:hover {
          background: #f3f4f6;
        }

        .info-card-body {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
        }

        .info-label {
          font-weight: 500;
          color: #6b7280;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
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
      `}</style>
    </div>
  );
};

export default LiveVehicleMap;