import React, { useState } from 'react';
import { BookingIcon, CloseIcon, CalendarIcon, LocationIcon, CheckIcon } from './Icons';

const BookingModal = ({ isOpen, onClose, onBook, vehicle }) => {
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    pickupLocation: '',
    dropoffLocation: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.startTime) newErrors.startTime = 'Start date/time is required';
    if (!formData.endTime) newErrors.endTime = 'End date/time is required';
    if (!formData.pickupLocation.trim()) newErrors.pickupLocation = 'Pickup location is required';
    if (!formData.dropoffLocation.trim()) newErrors.dropoffLocation = 'Dropoff location is required';
    
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      if (end <= start) {
        newErrors.endTime = 'End time must be after start time';
      }
      if (start < new Date()) {
        newErrors.startTime = 'Start time cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDuration = () => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      const hours = Math.ceil((end - start) / (1000 * 60 * 60));
      return hours > 0 ? hours : 0;
    }
    return 0;
  };

  const calculatePrice = () => {
    const hours = calculateDuration();
    const hourlyRate = 10;
    return hours * hourlyRate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const bookingData = {
        ...formData,
        vehicleId: vehicle.id,
        totalPrice: calculatePrice(),
      };
      await onBook(bookingData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({
          startTime: '',
          endTime: '',
          pickupLocation: '',
          dropoffLocation: '',
        });
      }, 2000);
    } catch (error) {
      console.error('Error creating booking:', error);
      setErrors({ submit: 'Failed to create booking. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
        {success ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center">
              <CheckIcon size="xl" className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h2>
            <p className="text-white/70 mb-4">Your vehicle has been successfully booked.</p>
            <div className="glass-card p-6 bg-accent-green/10 border-accent-green/30">
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-white/70">Vehicle:</span>
                  <span className="text-white font-semibold">{vehicle.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Duration:</span>
                  <span className="text-white font-semibold">{calculateDuration()} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Total Price:</span>
                  <span className="text-accent-green font-bold text-xl">${calculatePrice()}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="sticky top-0 bg-dark-800/95 backdrop-blur-md border-b border-white/10 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-accent-green to-accent-cyan">
                  <BookingIcon size="md" className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Book Vehicle</h2>
                  <p className="text-sm text-white/50">{vehicle.model} - {vehicle.vehicleNumber}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="btn-icon hover:bg-dark-700"
                disabled={loading}
              >
                <CloseIcon size="sm" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {errors.submit && (
                <div className="px-4 py-3 rounded-lg bg-red-500/15 border border-red-500 text-red-400">
                  {errors.submit}
                </div>
              )}

              <div className="glass-card p-4 bg-white/5">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <CalendarIcon size="sm" className="text-accent-cyan" />
                  Rental Period
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white/90">
                      Start Date & Time <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      className={`input-field ${errors.startTime ? 'border-red-500' : ''}`}
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      disabled={loading}
                    />
                    {errors.startTime && (
                      <p className="text-red-400 text-xs mt-1">{errors.startTime}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white/90">
                      End Date & Time <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      className={`input-field ${errors.endTime ? 'border-red-500' : ''}`}
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      disabled={loading}
                    />
                    {errors.endTime && (
                      <p className="text-red-400 text-xs mt-1">{errors.endTime}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="glass-card p-4 bg-white/5">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <LocationIcon size="sm" className="text-accent-green" />
                  Location Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white/90">
                      Pickup Location <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      className={`input-field ${errors.pickupLocation ? 'border-red-500' : ''}`}
                      placeholder="Enter pickup address"
                      value={formData.pickupLocation}
                      onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                      disabled={loading}
                    />
                    {errors.pickupLocation && (
                      <p className="text-red-400 text-xs mt-1">{errors.pickupLocation}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white/90">
                      Dropoff Location <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      className={`input-field ${errors.dropoffLocation ? 'border-red-500' : ''}`}
                      placeholder="Enter dropoff address"
                      value={formData.dropoffLocation}
                      onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                      disabled={loading}
                    />
                    {errors.dropoffLocation && (
                      <p className="text-red-400 text-xs mt-1">{errors.dropoffLocation}</p>
                    )}
                  </div>
                </div>
              </div>

              {calculateDuration() > 0 && (
                <div className="glass-card p-4 bg-accent-green/10 border-accent-green/30">
                  <h3 className="font-semibold text-white mb-3">Booking Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Duration:</span>
                      <span className="text-white font-semibold">{calculateDuration()} hours</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Rate:</span>
                      <span className="text-white font-semibold">$10/hour</span>
                    </div>
                    <div className="divider my-2"></div>
                    <div className="flex justify-between">
                      <span className="text-white font-semibold">Total Price:</span>
                      <span className="text-accent-green font-bold text-2xl">${calculatePrice()}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
