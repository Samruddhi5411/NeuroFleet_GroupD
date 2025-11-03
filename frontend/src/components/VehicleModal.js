import React, { useState, useEffect } from 'react';

const VehicleModal = ({ vehicle, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    model: '',
    manufacturer: '',
    type: 'SEDAN',
    capacity: 5,
    isElectric: false,
    status: 'AVAILABLE',
    latitude: 40.7128,
    longitude: -74.0060,
    batteryLevel: 100,
    fuelLevel: 100,
    mileage: 0,
    healthScore: 100,
    speed: 0,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vehicleNumber: vehicle.vehicleNumber || '',
        model: vehicle.model || '',
        manufacturer: vehicle.manufacturer || '',
        type: vehicle.type || 'SEDAN',
        capacity: vehicle.capacity || 5,
        isElectric: vehicle.isElectric || false,
        status: vehicle.status || 'AVAILABLE',
        latitude: vehicle.latitude || 40.7128,
        longitude: vehicle.longitude || -74.0060,
        batteryLevel: vehicle.batteryLevel || 100,
        fuelLevel: vehicle.fuelLevel || 100,
        mileage: vehicle.mileage || 0,
        healthScore: vehicle.healthScore || 100,
        speed: vehicle.speed || 0,
      });
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Vehicle number is required';
    }
    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }
    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = 'Manufacturer is required';
    }
    if (formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }
    if (formData.batteryLevel < 0 || formData.batteryLevel > 100) {
      newErrors.batteryLevel = 'Battery level must be between 0-100';
    }
    if (formData.fuelLevel < 0 || formData.fuelLevel > 100) {
      newErrors.fuelLevel = 'Fuel level must be between 0-100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      setLoading(true);
      const dataToSave = {
        ...formData,
        capacity: parseInt(formData.capacity),
        batteryLevel: formData.isElectric ? parseInt(formData.batteryLevel) : null,
        fuelLevel: !formData.isElectric ? parseInt(formData.fuelLevel) : null,
        mileage: parseInt(formData.mileage),
        healthScore: parseInt(formData.healthScore),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        speed: parseFloat(formData.speed),
      };
      await onSave(dataToSave);
      onClose();
    } catch (err) {
      setErrors({ submit: 'Failed to save vehicle. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-dark-800/95 backdrop-blur-sm p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Vehicle Number *
              </label>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-dark-700 text-white rounded-lg border ${
                  errors.vehicleNumber ? 'border-red-500' : 'border-white/10'
                } focus:border-accent-cyan focus:outline-none transition-colors`}
                placeholder="NF-001"
              />
              {errors.vehicleNumber && (
                <p className="text-red-400 text-xs mt-1">{errors.vehicleNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Model *
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-dark-700 text-white rounded-lg border ${
                  errors.model ? 'border-red-500' : 'border-white/10'
                } focus:border-accent-cyan focus:outline-none transition-colors`}
                placeholder="Model S"
              />
              {errors.model && (
                <p className="text-red-400 text-xs mt-1">{errors.model}</p>
              )}
            </div>

            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Manufacturer *
              </label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-dark-700 text-white rounded-lg border ${
                  errors.manufacturer ? 'border-red-500' : 'border-white/10'
                } focus:border-accent-cyan focus:outline-none transition-colors`}
                placeholder="Tesla"
              />
              {errors.manufacturer && (
                <p className="text-red-400 text-xs mt-1">{errors.manufacturer}</p>
              )}
            </div>

            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-700 text-white rounded-lg border border-white/10 focus:border-accent-cyan focus:outline-none transition-colors"
              >
                <option value="SEDAN">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="VAN">Van</option>
                <option value="TRUCK">Truck</option>
                <option value="BUS">Bus</option>
                <option value="BIKE">Bike</option>
              </select>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Capacity *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-dark-700 text-white rounded-lg border ${
                  errors.capacity ? 'border-red-500' : 'border-white/10'
                } focus:border-accent-cyan focus:outline-none transition-colors`}
                min="1"
              />
              {errors.capacity && (
                <p className="text-red-400 text-xs mt-1">{errors.capacity}</p>
              )}
            </div>

            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-700 text-white rounded-lg border border-white/10 focus:border-accent-cyan focus:outline-none transition-colors"
              >
                <option value="AVAILABLE">Available</option>
                <option value="IN_USE">In Use</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Latitude
              </label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                step="0.0001"
                className="w-full px-4 py-3 bg-dark-700 text-white rounded-lg border border-white/10 focus:border-accent-cyan focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Longitude
              </label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                step="0.0001"
                className="w-full px-4 py-3 bg-dark-700 text-white rounded-lg border border-white/10 focus:border-accent-cyan focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Mileage
              </label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-700 text-white rounded-lg border border-white/10 focus:border-accent-cyan focus:outline-none transition-colors"
                min="0"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Health Score
              </label>
              <input
                type="number"
                name="healthScore"
                value={formData.healthScore}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-700 text-white rounded-lg border border-white/10 focus:border-accent-cyan focus:outline-none transition-colors"
                min="0"
                max="100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isElectric"
                  checked={formData.isElectric}
                  onChange={handleChange}
                  className="w-5 h-5 rounded bg-dark-700 border-white/10 text-accent-cyan focus:ring-accent-cyan focus:ring-2"
                />
                <span className="text-white/80 font-semibold">Electric Vehicle</span>
              </label>
            </div>

            {formData.isElectric ? (
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-2">
                  Battery Level (%)
                </label>
                <input
                  type="number"
                  name="batteryLevel"
                  value={formData.batteryLevel}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-dark-700 text-white rounded-lg border ${
                    errors.batteryLevel ? 'border-red-500' : 'border-white/10'
                  } focus:border-accent-cyan focus:outline-none transition-colors`}
                  min="0"
                  max="100"
                />
                {errors.batteryLevel && (
                  <p className="text-red-400 text-xs mt-1">{errors.batteryLevel}</p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-2">
                  Fuel Level (%)
                </label>
                <input
                  type="number"
                  name="fuelLevel"
                  value={formData.fuelLevel}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-dark-700 text-white rounded-lg border ${
                    errors.fuelLevel ? 'border-red-500' : 'border-white/10'
                  } focus:border-accent-cyan focus:outline-none transition-colors`}
                  min="0"
                  max="100"
                />
                {errors.fuelLevel && (
                  <p className="text-red-400 text-xs mt-1">{errors.fuelLevel}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-accent-cyan to-accent-blue text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-accent-cyan/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : vehicle ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-dark-700 text-white font-semibold rounded-lg hover:bg-dark-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;
