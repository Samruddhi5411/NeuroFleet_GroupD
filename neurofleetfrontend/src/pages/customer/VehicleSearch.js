import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FilterIcon, VehicleIcon } from '../Icons';

const VehicleSearch = ({ onSelectVehicle }) => {
  const [vehicles, setVehicles] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [filterElectric, setFilterElectric] = useState(null);
  const [minCapacity, setMinCapacity] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, [filterType, filterElectric, minCapacity]);

  const loadVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filterType !== 'ALL') params.append('type', filterType);
      if (filterElectric !== null) params.append('isElectric', filterElectric);
      if (minCapacity > 0) params.append('minCapacity', minCapacity);

      const response = await axios.get(
        `http://localhost:8083/api/customer/vehicles/search?${params}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setVehicles(response.data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-white py-12">Loading vehicles...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <FilterIcon size="md" className="text-accent-cyan" />
          <h3 className="text-xl font-bold text-white">Search Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="input-field"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">All Types</option>
            <option value="SEDAN">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="VAN">Van</option>
            <option value="TRUCK">Truck</option>
          </select>

          <select
            className="input-field"
            value={filterElectric === null ? '' : filterElectric}
            onChange={(e) => setFilterElectric(e.target.value === '' ? null : e.target.value === 'true')}
          >
            <option value="">Electric/Non-Electric</option>
            <option value="true">Electric Only</option>
            <option value="false">Non-Electric</option>
          </select>

          <input
            type="number"
            className="input-field"
            placeholder="Min Seats"
            min="0"
            value={minCapacity || ''}
            onChange={(e) => setMinCapacity(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      {/* Results */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Available Vehicles</h3>
          <span className="text-white/60">{vehicles.length} found</span>
        </div>

        {vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="glass-card-hover p-6 cursor-pointer"
                onClick={() => onSelectVehicle(vehicle)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <VehicleIcon size="md" className="text-accent-cyan" />
                  <div>
                    <h4 className="text-white font-bold">{vehicle.model}</h4>
                    <p className="text-white/50 text-sm">{vehicle.vehicleNumber}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Type:</span>
                    <span className="text-white font-semibold">{vehicle.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Seats:</span>
                    <span className="text-white font-semibold">{vehicle.capacity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Type:</span>
                    <span className={`font-semibold ${vehicle.isElectric ? 'text-accent-green' : 'text-white'}`}>
                      {vehicle.isElectric ? '⚡ Electric' : '⛽ Fuel'}
                    </span>
                  </div>
                </div>
                <button className="btn-primary w-full mt-4">
                  Select & Book
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white/50 py-12">
            <p>No vehicles found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleSearch;