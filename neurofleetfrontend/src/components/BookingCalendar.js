import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/api';

const BookingCalendar = ({ vehicle, onClose, onBookingComplete }) => {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    pickupLocation: '',
    dropoffLocation: '',
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
  const [bookingStatus, setBookingStatus] = useState(null);

  const username = localStorage.getItem('username');

  useEffect(() => {
    loadAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const loadAvailability = async () => {
    setLoading(true);
    try {
      const response = await bookingService.checkAvailability({
        vehicleId: vehicle.id,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      console.log('Availability response:', response.data);
      // Backend returns an array, get the first element
      const availabilityData = Array.isArray(response.data) ? response.data[0] : response.data;
      setAvailability(availabilityData);
    } catch (error) {
      console.error('Error loading availability:', error);
      alert('Failed to load availability. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = (slot) => {
    if (slot.isAvailable) {
      setSelectedSlot(slot);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot || !bookingDetails.pickupLocation || !bookingDetails.dropoffLocation) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        vehicle: { id: vehicle.id },
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        pickupLocation: bookingDetails.pickupLocation,
        dropoffLocation: bookingDetails.dropoffLocation,
        totalPrice: selectedSlot.price,
      };
      console.log('Creating booking with data:', bookingData);

      const response = await bookingService.create(username, bookingData);
      console.log('Booking created successfully:', response.data);

      setBookingStatus('success');
      setTimeout(() => {
        onBookingComplete();
      }, 2000);
    } catch (error) {
      console.error('Error creating booking:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to create booking: ${error.response?.data?.message || error.message}`);
      setBookingStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = Math.round((end - start) / (1000 * 60 * 60));
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="booking-calendar-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Book {vehicle.manufacturer} {vehicle.model}</h2>
            <p className="modal-subtitle">{vehicle.vehicleNumber}</p>
          </div>
          <button className="close-button" onClick={onClose}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {bookingStatus === 'success' ? (
          <div className="booking-success">
            <div className="success-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Booking Confirmed!</h3>
            <p>Your booking has been successfully created.</p>
          </div>
        ) : bookingStatus === 'error' ? (
          <div className="booking-error">
            <div className="error-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Booking Failed</h3>
            <p>There was an error creating your booking. Please try again.</p>
          </div>
        ) : (
          <>
            <div className="modal-body">
              <div className="date-range-selector">
                <div className="date-input-group">
                  <label>From</label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div className="date-input-group">
                  <label>To</label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    min={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading availability...</p>
                </div>
              ) : (
                <>
                  {availability && availability.pricePerHour && (
                    <>
                      <div className="availability-info">
                        <div className="info-card">
                          <span className="info-label">Base Rate</span>
                          <span className="info-value">${availability.pricePerHour.toFixed(2)}/hr</span>
                        </div>
                        <div className="info-card">
                          <span className="info-label">Available Slots</span>
                          <span className="info-value">{availability.availableSlots?.length || 0}</span>
                        </div>
                        <div className="info-card">
                          <span className="info-label">Booked Slots</span>
                          <span className="info-value">{availability.bookedSlots?.length || 0}</span>
                        </div>
                      </div>

                      <div className="slots-section">
                        <h3 className="slots-title">Available Time Slots</h3>
                        <div className="slots-grid">
                          {(availability.availableSlots || []).map((slot, index) => (
                            <div
                              key={index}
                              className={`time-slot ${selectedSlot === slot ? 'selected' : ''}`}
                              onClick={() => handleSlotSelect(slot)}
                            >
                              <div className="slot-time">
                                <svg className="slot-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                  <p className="slot-start">{formatDateTime(slot.startTime)}</p>
                                  <p className="slot-duration">{formatDuration(slot.startTime, slot.endTime)}</p>
                                </div>
                              </div>
                              <div className="slot-price">${slot.price?.toFixed(2) || '0.00'}</div>
                            </div>
                          ))}
                          {(!availability.availableSlots || availability.availableSlots.length === 0) && (
                            <div className="no-slots">
                              <p>No available slots in this date range</p>
                              <p className="no-slots-subtitle">Try selecting different dates</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {selectedSlot && (
                        <div className="booking-form">
                          <h3 className="form-title">Booking Details</h3>
                          <div className="form-group">
                            <label className="form-label">
                              <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Pickup Location
                            </label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Enter pickup address"
                              value={bookingDetails.pickupLocation}
                              onChange={(e) => setBookingDetails(prev => ({ ...prev, pickupLocation: e.target.value }))}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Dropoff Location
                            </label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Enter dropoff address"
                              value={bookingDetails.dropoffLocation}
                              onChange={(e) => setBookingDetails(prev => ({ ...prev, dropoffLocation: e.target.value }))}
                            />
                          </div>

                          <div className="booking-summary">
                            <h4>Booking Summary</h4>
                            <div className="summary-row">
                              <span>Duration:</span>
                              <span>{formatDuration(selectedSlot.startTime, selectedSlot.endTime)}</span>
                            </div>
                            <div className="summary-row">
                              <span>Rate:</span>
                              <span>${availability.pricePerHour?.toFixed(2) || '0.00'}/hr</span>
                            </div>
                            <div className="summary-row total">
                              <span>Total:</span>
                              <span>${selectedSlot.price?.toFixed(2) || '0.00'}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            <div className="modal-footer">
              <button className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button
                className="confirm-button"
                onClick={handleBooking}
                disabled={!selectedSlot || loading}
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingCalendar;