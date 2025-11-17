import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/api';
import VehicleRecommendationCard from '../../components/VehicleRecommendationCard';
import BookingCalendar from '../../components/BookingCalendar';
import './CustomerBooking.css';


const CustomerBooking = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    vehicleType: 'ALL',
    isElectric: null,
    minCapacity: null,
    maxCapacity: null,
    startTime: null,
    endTime: null,
    sortBy: 'recommendation'
  });

  const username = localStorage.getItem('username');

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await bookingService.searchVehicles(username, searchFilters);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error searching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBookVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowCalendar(true);
  };

  const handleBookingComplete = () => {
    setShowCalendar(false);
    setSelectedVehicle(null);
  };

  return (
    <div className="customer-booking-container page-fade-in">
      <div className="booking-header">
        <h1 className="booking-title">
          <span className="gradient-text">Smart Booking</span>
        </h1>
        <p className="booking-subtitle">AI-powered vehicle recommendations just for you</p>
      </div>

      <div className="booking-filters-card">
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Vehicle Type</label>
            <select
              className="filter-select"
              value={searchFilters.vehicleType}
              onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="SEDAN">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="VAN">Van</option>
              <option value="TRUCK">Truck</option>
              <option value="BUS">Bus</option>
              <option value="BIKE">Bike</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Seats</label>
            <select
              className="filter-select"
              value={searchFilters.minCapacity || ''}
              onChange={(e) => handleFilterChange('minCapacity', e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">Any</option>
              <option value="2">2+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
              <option value="7">7+</option>
              <option value="10">10+</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Power Type</label>
            <select
              className="filter-select"
              value={searchFilters.isElectric === null ? '' : searchFilters.isElectric}
              onChange={(e) => {
                const value = e.target.value === '' ? null : e.target.value === 'true';
                handleFilterChange('isElectric', value);
              }}
            >
              <option value="">All</option>
              <option value="true">Electric Only</option>
              <option value="false">Non-Electric</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sort By</label>
            <select
              className="filter-select"
              value={searchFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="recommendation">AI Recommendation</option>
              <option value="price">Price (Low to High)</option>
              <option value="capacity">Capacity</option>
            </select>
          </div>
        </div>

        <button className="search-button" onClick={handleSearch}>
          <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search Vehicles
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Finding the best vehicles for you...</p>
        </div>
      ) : (
        <>
          {recommendations.filter(r => r.isRecommended).length > 0 && (
            <div className="recommendations-section">
              <div className="section-header">
                <h2 className="section-title">
                  <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI Recommended for You
                </h2>
                <span className="recommendation-badge">
                  {recommendations.filter(r => r.isRecommended).length} matches
                </span>
              </div>
              <div className="vehicles-grid">
                {recommendations
                  .filter(r => r.isRecommended)
                  .map((recommendation) => (
                    <VehicleRecommendationCard
                      key={recommendation.vehicle.id}
                      recommendation={recommendation}
                      onBook={handleBookVehicle}
                    />
                  ))}
              </div>
            </div>
          )}

          <div className="all-vehicles-section">
            <h2 className="section-title">
              {recommendations.filter(r => r.isRecommended).length > 0 ? 'Other Available Vehicles' : 'Available Vehicles'}
            </h2>
            <div className="vehicles-grid">
              {recommendations
                .filter(r => !r.isRecommended)
                .map((recommendation) => (
                  <VehicleRecommendationCard
                    key={recommendation.vehicle.id}
                    recommendation={recommendation}
                    onBook={handleBookVehicle}
                  />
                ))}
            </div>
            {recommendations.length === 0 && !loading && (
              <div className="no-results">
                <svg className="no-results-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p>No vehicles found matching your criteria</p>
                <p className="no-results-subtitle">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </>
      )}

      {showCalendar && selectedVehicle && (
        <BookingCalendar
          vehicle={selectedVehicle}
          onClose={() => setShowCalendar(false)}
          onBookingComplete={handleBookingComplete}
        />
      )}
    </div>
  );
};

export default CustomerBooking;
