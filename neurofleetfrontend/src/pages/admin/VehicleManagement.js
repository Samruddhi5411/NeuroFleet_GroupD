import React, { useState, useEffect } from 'react';
import { vehicleService } from '../../services/api';
import { VehicleIcon, AlertIcon } from '../../components/Icons';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    manufacturer: '',
    model: '',
    type: 'SEDAN',
    capacity: 4,
    isElectric: false,
    status: 'AVAILABLE',
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await vehicleService.create(formData);
      alert('✅ Vehicle added successfully!');
      setShowAddModal(false);
      setFormData({
        vehicleNumber: '',
        manufacturer: '',
        model: '',
        type: 'SEDAN',
        capacity: 4,
        isElectric: false,
        status: 'AVAILABLE',
      });
      loadVehicles();
    } catch (error) {
      alert('❌ Failed to add vehicle: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await vehicleService.delete(id);
      alert('✅ Vehicle deleted successfully!');
      loadVehicles();
    } catch (error) {
      alert('❌ Failed to delete vehicle');
    }
  };

  const getStatusStyle = (status) => {
    const map = {
      'AVAILABLE': 'status-available',
      'IN_USE': 'status-in-use',
      'MAINTENANCE': 'status-maintenance',
      'OUT_OF_SERVICE': 'status-critical',
    };
    return map[status] || 'status-maintenance';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <VehicleIcon size="lg" className="text-accent-cyan" />
            Vehicle Management
          </h2>
          <p className="text-white/50">Manage your fleet inventory</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          + Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="glass-card p-6 group">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-white">{vehicle.model}</h4>
                <p className="text-white/50 text-sm">{vehicle.vehicleNumber}</p>
              </div>
              <span className={`status-badge ${getStatusStyle(vehicle.status)}`}>
                <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                {vehicle.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Type:</span>
                <span className="text-white">{vehicle.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Manufacturer:</span>
                <span className="text-white">{vehicle.manufacturer}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Capacity:</span>
                <span className="text-white">{vehicle.capacity} seats</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Type:</span>
                <span className="text-white">{vehicle.isElectric ? '⚡ Electric' : '⛽ Fuel'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Health:</span>
                <span className="text-accent-green">{vehicle.healthScore || 100}%</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(vehicle.id)}
                className="flex-1 btn-secondary text-red-400 border-red-400 hover:bg-red-400/10"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Add New Vehicle</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"
              >
                <span className="text-white text-xl">×</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm font-semibold mb-2">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., MH-12-AB-1234"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-semibold mb-2">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., Toyota"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-semibold mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., Camry"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-semibold mb-2">
                    Type
                  </label>
                  <select
                    className="input-field"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="SEDAN">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="VAN">Van</option>
                    <option value="TRUCK">Truck</option>
                    <option value="BUS">Bus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-semibold mb-2">
                    Capacity (seats)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-semibold mb-2">
                    Status
                  </label>
                  <select
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="OUT_OF_SERVICE">Out of Service</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isElectric"
                  checked={formData.isElectric}
                  onChange={(e) => setFormData({ ...formData, isElectric: e.target.checked })}
                  className="w-5 h-5 accent-accent-cyan"
                />
                <label htmlFor="isElectric" className="text-white/90 cursor-pointer">
                  ⚡ Electric Vehicle
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;