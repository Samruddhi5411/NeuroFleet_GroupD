import React, { useState } from 'react';
import { LocationIcon, CalendarIcon, AlertIcon } from './Icons';

const BookingModal = ({ isOpen, onClose, onBook, vehicle }) => {
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupLatitude: 19.0760,
    pickupLongitude: 72.8777,
    dropoffLatitude: 19.1136,
    dropoffLongitude: 72.8697,
    startTime: new Date().toISOString().slice(0, 16),
    customerNotes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !vehicle) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const bookingData = {
        vehicleId: vehicle.id,
        ...formData,
        totalPrice: 100.0,
      };

      await onBook(bookingData);
      alert('Booking created successfully! Waiting for manager approval.');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="glass-card max-w-2xl w-full p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Book Vehicle</h3>
            <p className="text-white/50 text-sm">{vehicle.model} - {vehicle.vehicleNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <span className="text-white text-xl">×</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-xl flex items-center gap-2">
            <AlertIcon size="sm" className="text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm font-semibold mb-2">
                <LocationIcon size="sm" className="inline mr-2" />
                Pickup Location
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter pickup location"
                value={formData.pickupLocation}
                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-semibold mb-2">
                <LocationIcon size="sm" className="inline mr-2" />
                Dropoff Location
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter dropoff location"
                value={formData.dropoffLocation}
                onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-semibold mb-2">
              <CalendarIcon size="sm" className="inline mr-2" />
              Start Time
            </label>
            <input
              type="datetime-local"
              className="input-field"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm font-semibold mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              className="input-field resize-none"
              rows="3"
              placeholder="Any special requests or instructions..."
              value={formData.customerNotes}
              onChange={(e) => setFormData({ ...formData, customerNotes: e.target.value })}
            />
          </div>

          <div className="divider"></div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Estimated Price</p>
              <p className="text-2xl font-bold text-accent-green">$100.00</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Creating...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;