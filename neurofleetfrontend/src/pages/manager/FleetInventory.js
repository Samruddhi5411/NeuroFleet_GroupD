import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import VehicleCard from '../../components/VehicleCard';
import VehicleModal from '../../components/VehicleModal';

const FleetInventory = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompactView, setIsCompactView] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    minBattery: '',
    sortBy: '',
  });

  const wsRef = useRef(null);

  useEffect(() => {
    loadVehicles();
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vehicles, filters]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8083/api/admin/vehicles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicles(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load vehicles');
      console.error('Error loading vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    const pollTelemetry = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8083/api/admin/vehicles', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVehicles(response.data);
      } catch (err) {
        console.error('Error polling telemetry:', err);
      }
    };

    const interval = setInterval(pollTelemetry, 3000);
    wsRef.current = { close: () => clearInterval(interval) };
  };

  const applyFilters = () => {
    let filtered = [...vehicles];

    if (filters.status) {
      filtered = filtered.filter(v => v.status === filters.status);
    }

    if (filters.type) {
      filtered = filtered.filter(v => v.type === filters.type);
    }

    if (filters.minBattery) {
      const minBat = parseInt(filters.minBattery);
      filtered = filtered.filter(v => {
        const level = v.isElectric ? v.batteryLevel : v.fuelLevel;
        return level >= minBat;
      });
    }

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'battery':
            const levelA = a.isElectric ? (a.batteryLevel || 0) : (a.fuelLevel || 0);
            const levelB = b.isElectric ? (b.batteryLevel || 0) : (b.fuelLevel || 0);
            return levelB - levelA;
          case 'status':
            return a.status.localeCompare(b.status);
          case 'type':
            return a.type.localeCompare(b.type);
          case 'speed':
            return (b.speed || 0) - (a.speed || 0);
          default:
            return 0;
        }
      });
    }

    setFilteredVehicles(filtered);
  };

  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setIsModalOpen(true);
  };

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8083/api/admin/vehicles/${vehicleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await loadVehicles();
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      alert('Failed to delete vehicle');
    }
  };

  const handleSaveVehicle = async (vehicleData) => {
    try {
      const token = localStorage.getItem('token');
      if (selectedVehicle) {
        await axios.put(
          `http://localhost:8083/api/admin/vehicles/${selectedVehicle.id}`,
          vehicleData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:8083/api/admin/vehicles',
          vehicleData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setIsModalOpen(false);
      await loadVehicles();
    } catch (err) {
      console.error('Error saving vehicle:', err);
      throw err;
    }
  };

  const getStatusCount = (status) => {
    return vehicles.filter(v => v.status === status).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-accent-cyan"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Fleet Inventory & Telemetry</h1>
            <p className="text-white/60">Real-time vehicle monitoring and management</p>
          </div>
          <button
            onClick={handleAddVehicle}
            className="px-6 py-3 bg-gradient-to-r from-accent-cyan to-accent-blue text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-cyan/50 transition-all duration-300 transform hover:scale-105"
          >
            + Add Vehicle
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Available</p>
                <p className="text-2xl font-bold text-accent-green">{getStatusCount('AVAILABLE')}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent-green/20 flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">In Use</p>
                <p className="text-2xl font-bold text-accent-cyan">{getStatusCount('IN_USE')}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent-cyan/20 flex items-center justify-center">
                <span className="text-2xl">🚗</span>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Maintenance</p>
                <p className="text-2xl font-bold text-accent-purple">{getStatusCount('MAINTENANCE')}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent-purple/20 flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Fleet</p>
                <p className="text-2xl font-bold text-white">{vehicles.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 bg-dark-700 text-white rounded-lg border border-white/10 focus:border-accent-cyan focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="IN_USE">In Use</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-4 py-2 bg-dark-700 text-white rounded-lg border border-white/10 focus:border-accent-cyan focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="SEDAN">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="VAN">Van</option>
              <option value="TRUCK">Truck</option>
              <option value="BUS">Bus</option>
              <option value="BIKE">Bike</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="px-4 py-2 bg-dark-700 text-white rounded-lg border border-white/10 focus:border-accent-cyan focus:outline-none"
            >
              <option value="">Sort By</option>
              <option value="battery">Battery/Fuel Level</option>
              <option value="status">Status</option>
              <option value="type">Type</option>
              <option value="speed">Speed</option>
            </select>

            <input
              type="number"
              placeholder="Min Battery %"
              value={filters.minBattery}
              onChange={(e) => setFilters({ ...filters, minBattery: e.target.value })}
              className="px-4 py-2 bg-dark-700 text-white rounded-lg border border-white/10 focus:border-accent-cyan focus:outline-none"
              min="0"
              max="100"
            />

            <button
              onClick={() => setFilters({ status: '', type: '', minBattery: '', sortBy: '' })}
              className="px-4 py-2 bg-dark-700 text-white rounded-lg border border-white/10 hover:border-accent-cyan transition-colors"
            >
              Clear Filters
            </button>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-white/60 text-sm">View:</span>
              <button
                onClick={() => setIsCompactView(!isCompactView)}
                className={`px-4 py-2 rounded-lg transition-colors ${isCompactView
                    ? 'bg-accent-cyan text-white'
                    : 'bg-dark-700 text-white/60 hover:text-white'
                  }`}
              >
                {isCompactView ? 'Compact' : 'Grid'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
              {error}
            </div>
          )}

          <div className={`grid gap-6 ${isCompactView
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 lg:grid-cols-2'
            }`}>
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onEdit={handleEditVehicle}
                onDelete={handleDeleteVehicle}
                isCompact={isCompactView}
              />
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">No vehicles found matching your filters</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <VehicleModal
          vehicle={selectedVehicle}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveVehicle}
        />
      )}
    </div>
  );
};

export default FleetInventory;
