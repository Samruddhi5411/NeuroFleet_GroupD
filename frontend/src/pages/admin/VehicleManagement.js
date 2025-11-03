import React, { useState, useEffect } from 'react';
import { vehicleService } from '../../services/api';
import VehicleModal from '../../components/VehicleModal';
import { VehicleIcon, BatteryIcon, LocationIcon } from '../../components/Icons';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const response = await vehicleService.getAll();
      setVehicles(response.data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  };

  const handleSaveVehicle = async (vehicleData) => {
    try {
      if (selectedVehicle) {
        await vehicleService.update(selectedVehicle.id, vehicleData);
      } else {
        await vehicleService.create(vehicleData);
      }
      await loadVehicles();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      throw error;
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await vehicleService.delete(id);
        await loadVehicles();
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert('Failed to delete vehicle. It may be in use.');
      }
    }
  };

  const getStatusStyle = (status) => {
    const statusMap = {
      'AVAILABLE': 'status-available',
      'IN_USE': 'status-in-use',
      'MAINTENANCE': 'status-maintenance',
      'OUT_OF_SERVICE': 'status-critical',
    };
    return statusMap[status] || 'status-maintenance';
  };

  const filteredVehicles = vehicles
    .filter(v => filterStatus === 'ALL' || v.status === filterStatus)
    .filter(v => 
      v.vehicleNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const statusCounts = {
    ALL: vehicles.length,
    AVAILABLE: vehicles.filter(v => v.status === 'AVAILABLE').length,
    IN_USE: vehicles.filter(v => v.status === 'IN_USE').length,
    MAINTENANCE: vehicles.filter(v => v.status === 'MAINTENANCE').length,
    OUT_OF_SERVICE: vehicles.filter(v => v.status === 'OUT_OF_SERVICE').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <VehicleIcon size="lg" className="text-accent-cyan" />
            Vehicle Management
          </h2>
          <p className="text-white/50">Manage your entire fleet operations</p>
        </div>
        <button
          onClick={() => {
            setSelectedVehicle(null);
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <VehicleIcon size="sm" />
          Add Vehicle
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by vehicle number or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field flex-1 min-w-[300px]"
          />
          <select
            className="input-field"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All ({statusCounts.ALL})</option>
            <option value="AVAILABLE">Available ({statusCounts.AVAILABLE})</option>
            <option value="IN_USE">In Use ({statusCounts.IN_USE})</option>
            <option value="MAINTENANCE">Maintenance ({statusCounts.MAINTENANCE})</option>
            <option value="OUT_OF_SERVICE">Out of Service ({statusCounts.OUT_OF_SERVICE})</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="glass-card-hover p-6 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-1">{vehicle.model}</h4>
                  <p className="text-sm text-white/50">{vehicle.vehicleNumber}</p>
                </div>
                <span className={`status-badge ${getStatusStyle(vehicle.status)}`}>
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                  {vehicle.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Type:</span>
                  <span className="text-white font-semibold">{vehicle.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Capacity:</span>
                  <span className="text-white font-semibold">{vehicle.capacity} seats</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Mileage:</span>
                  <span className="text-white font-semibold">{vehicle.mileage || 0} km</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Health Score:</span>
                  <span className={`font-semibold ${
                    vehicle.healthScore >= 90 ? 'text-accent-green' :
                    vehicle.healthScore >= 70 ? 'text-accent-cyan' :
                    'text-accent-pink'
                  }`}>
                    {vehicle.healthScore || 100}%
                  </span>
                </div>
                
                {vehicle.isElectric ? (
                  <div className="flex items-center gap-2">
                    <BatteryIcon size="sm" className="text-accent-cyan" level={vehicle.batteryLevel || 100} />
                    <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent-cyan to-accent-blue rounded-full transition-all duration-500"
                        style={{ width: `${vehicle.batteryLevel || 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-white/70">{vehicle.batteryLevel || 100}%</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LocationIcon size="sm" className="text-accent-green" />
                    <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent-green to-accent-cyan rounded-full transition-all duration-500"
                        style={{ width: `${vehicle.fuelLevel || 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-white/70">{vehicle.fuelLevel || 100}%</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setIsModalOpen(true);
                  }}
                  className="flex-1 btn-secondary text-sm py-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="flex-1 btn-secondary text-sm py-2 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <VehicleIcon size="xl" className="text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">No vehicles found</p>
            <button
              onClick={() => {
                setSelectedVehicle(null);
                setIsModalOpen(true);
              }}
              className="btn-primary mt-4"
            >
              Add Your First Vehicle
            </button>
          </div>
        )}
      </div>

      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveVehicle}
        vehicle={selectedVehicle}
      />
    </div>
  );
};

export default VehicleManagement;
