import React, { useState, useEffect } from 'react';

const VehicleCard = ({ vehicle, onEdit, onDelete, isCompact }) => {
  const [prevTelemetry, setPrevTelemetry] = useState({
    speed: vehicle.speed,
    battery: vehicle.batteryLevel,
    fuel: vehicle.fuelLevel,
  });

  const [animateChange, setAnimateChange] = useState(false);

  useEffect(() => {
    const hasChanged =
      prevTelemetry.speed !== vehicle.speed ||
      prevTelemetry.battery !== vehicle.batteryLevel ||
      prevTelemetry.fuel !== vehicle.fuelLevel;

    if (hasChanged) {
      setAnimateChange(true);
      setTimeout(() => setAnimateChange(false), 500);
      setPrevTelemetry({
        speed: vehicle.speed,
        battery: vehicle.batteryLevel,
        fuel: vehicle.fuelLevel,
      });
    }
  }, [vehicle]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-accent-green text-white';
      case 'IN_USE':
        return 'bg-accent-cyan text-white';
      case 'MAINTENANCE':
        return 'bg-accent-purple text-white';
      case 'OUT_OF_SERVICE':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return '✓';
      case 'IN_USE':
        return '🚗';
      case 'MAINTENANCE':
        return '🔧';
      case 'OUT_OF_SERVICE':
        return '⚠';
      default:
        return '•';
    }
  };

  const getLevelColor = (level) => {
    if (level >= 70) return 'from-accent-green to-accent-cyan';
    if (level >= 30) return 'from-accent-cyan to-accent-blue';
    return 'from-accent-purple to-accent-pink';
  };

  const getShortAddress = (lat, lon) => {
    if (!lat || !lon) return 'Location unknown';
    return `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
  };

  if (isCompact) {
    return (
      <div
        className={`glass-card p-4 hover:scale-105 transition-all duration-300 ${
          animateChange ? 'ring-2 ring-accent-cyan animate-pulse' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{vehicle.model}</h3>
            <p className="text-sm text-white/50">{vehicle.vehicleNumber}</p>
          </div>
          <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusColor(vehicle.status)}`}>
            {getStatusIcon(vehicle.status)} {vehicle.status.replace('_', ' ')}
          </span>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">📍 {getShortAddress(vehicle.latitude, vehicle.longitude)}</span>
          </div>

          {vehicle.isElectric ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">🔋</span>
              <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getLevelColor(vehicle.batteryLevel || 0)} transition-all duration-500`}
                  style={{ width: `${vehicle.batteryLevel || 0}%` }}
                ></div>
              </div>
              <span className="text-xs text-white/70 font-semibold">{vehicle.batteryLevel || 0}%</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">⛽</span>
              <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getLevelColor(vehicle.fuelLevel || 0)} transition-all duration-500`}
                  style={{ width: `${vehicle.fuelLevel || 0}%` }}
                ></div>
              </div>
              <span className="text-xs text-white/70 font-semibold">{vehicle.fuelLevel || 0}%</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Speed:</span>
            <span className="text-white font-semibold">{vehicle.speed?.toFixed(1) || '0.0'} mph</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(vehicle)}
            className="flex-1 px-3 py-2 bg-accent-cyan/20 text-accent-cyan rounded-lg hover:bg-accent-cyan hover:text-white transition-colors text-sm font-semibold"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(vehicle.id)}
            className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-sm font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`glass-card p-6 hover:scale-[1.02] transition-all duration-300 ${
        animateChange ? 'ring-2 ring-accent-cyan shadow-lg shadow-accent-cyan/30' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-1">{vehicle.model}</h3>
          <p className="text-sm text-white/50">{vehicle.manufacturer} • {vehicle.vehicleNumber}</p>
        </div>
        <span className={`px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-2 ${getStatusColor(vehicle.status)}`}>
          <span className="text-lg">{getStatusIcon(vehicle.status)}</span>
          {vehicle.status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="glass-card-hover p-3">
          <p className="text-xs text-white/50 mb-1">Type</p>
          <p className="text-white font-semibold">{vehicle.type}</p>
        </div>
        <div className="glass-card-hover p-3">
          <p className="text-xs text-white/50 mb-1">Capacity</p>
          <p className="text-white font-semibold">{vehicle.capacity} passengers</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="glass-card-hover p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📍</span>
            <span className="text-sm text-white/60">Location</span>
          </div>
          <p className="text-white font-mono text-sm">{getShortAddress(vehicle.latitude, vehicle.longitude)}</p>
        </div>

        <div className="glass-card-hover p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{vehicle.isElectric ? '🔋' : '⛽'}</span>
              <span className="text-sm text-white/60">
                {vehicle.isElectric ? 'Battery Level' : 'Fuel Level'}
              </span>
            </div>
            <span className="text-white font-bold">
              {vehicle.isElectric ? (vehicle.batteryLevel || 0) : (vehicle.fuelLevel || 0)}%
            </span>
          </div>
          <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getLevelColor(
                vehicle.isElectric ? vehicle.batteryLevel : vehicle.fuelLevel
              )} transition-all duration-500 rounded-full`}
              style={{
                width: `${vehicle.isElectric ? vehicle.batteryLevel || 0 : vehicle.fuelLevel || 0}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="glass-card-hover p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <span className="text-sm text-white/60">Current Speed</span>
            </div>
            <span className={`text-white font-bold ${vehicle.speed > 0 ? 'text-accent-cyan' : ''}`}>
              {vehicle.speed?.toFixed(1) || '0.0'} mph
            </span>
          </div>
          {vehicle.speed > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex-1 h-1 bg-dark-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-cyan to-accent-blue animate-pulse"
                  style={{ width: `${Math.min((vehicle.speed / 80) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card-hover p-3">
            <p className="text-xs text-white/50 mb-1">Health Score</p>
            <p className={`text-lg font-bold ${
              vehicle.healthScore >= 90 ? 'text-accent-green' :
              vehicle.healthScore >= 70 ? 'text-accent-cyan' :
              'text-accent-purple'
            }`}>
              {vehicle.healthScore || 100}%
            </p>
          </div>
          <div className="glass-card-hover p-3">
            <p className="text-xs text-white/50 mb-1">Mileage</p>
            <p className="text-lg font-bold text-white">{vehicle.mileage?.toLocaleString() || 0} mi</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onEdit(vehicle)}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-accent-cyan to-accent-blue text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-accent-cyan/50 transition-all duration-300"
        >
          Edit Vehicle
        </button>
        <button
          onClick={() => onDelete(vehicle.id)}
          className="px-4 py-3 bg-red-500/20 text-red-400 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;
