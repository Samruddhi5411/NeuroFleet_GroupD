import React, { useState } from 'react';
import { LocationIcon, CalendarIcon } from '../Icons';

const BookingForm = ({ vehicle, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    startTime: new Date().toISOString().slice(0, 16),
    customerNotes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-2xl font-bold text-white mb-6">Book Vehicle</h3>

      {vehicle && (
        <div className="p-4 bg-accent-cyan/10 rounded-xl mb-6">
          <h4 className="text-white font-bold">{vehicle.model}</h4>
          <p className="text-white/50 text-sm">{vehicle.vehicleNumber}</p>
          <div className="flex gap-4 mt-2 text-sm">
            <span className="text-white/60">Type: {vehicle.type}</span>
            <span className="text-white/60">Seats: {vehicle.capacity}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white/70 text-sm font-semibold mb-2">
            <LocationIcon size="sm" className="inline mr-2" />
            Pickup Location *
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Enter pickup location (e.g., Mumbai Airport)"
            value={formData.pickupLocation}
            onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-white/70 text-sm font-semibold mb-2">
            <LocationIcon size="sm" className="inline mr-2" />
            Dropoff Location *
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Enter dropoff location (e.g., Pune Station)"
            value={formData.dropoffLocation}
            onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-white/70 text-sm font-semibold mb-2">
            <CalendarIcon size="sm" className="inline mr-2" />
            Start Time *
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
            Additional Notes
          </label>
          <textarea
            className="input-field"
            placeholder="Any special requirements?"
            rows={3}
            value={formData.customerNotes}
            onChange={(e) => setFormData({ ...formData, customerNotes: e.target.value })}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 btn-primary"
          >
            Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;