import React from 'react';

const VehicleRecommendationCard = ({ recommendation, onBook }) => {
  const { vehicle, recommendationScore, reason, isRecommended, pricePerHour } = recommendation;

  const getVehicleIcon = (type) => {
    const icons = {
      SEDAN: '🚗',
      SUV: '🚙',
      VAN: '🚐',
      TRUCK: '🚚',
      BUS: '🚌',
      BIKE: '🏍️'
    };
    return icons[type] || '🚗';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 70) return 'score-good';
    if (score >= 60) return 'score-fair';
    return 'score-low';
  };

  return (
    <div className={`vehicle-recommendation-card ${isRecommended ? 'recommended' : ''}`}>
      {isRecommended && (
        <div className="ai-badge">
          <svg className="ai-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI Recommended
        </div>
      )}

      <div className="vehicle-card-header">
        <div className="vehicle-icon-badge">{getVehicleIcon(vehicle.type)}</div>
        <div className="vehicle-info">
          <h3 className="vehicle-name">{vehicle.manufacturer} {vehicle.model}</h3>
          <p className="vehicle-number">{vehicle.vehicleNumber}</p>
        </div>
        {isRecommended && (
          <div className={`recommendation-score ${getScoreColor(recommendationScore)}`}>
            <span className="score-value">{recommendationScore.toFixed(0)}</span>
            <span className="score-label">Match</span>
          </div>
        )}
      </div>

      <div className="vehicle-details">
        <div className="detail-item">
          <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{vehicle.capacity} Seats</span>
        </div>

        <div className="detail-item">
          <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span>{vehicle.type}</span>
        </div>

        <div className="detail-item">
          {vehicle.isElectric ? (
            <>
              <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="electric-badge">Electric ⚡</span>
            </>
          ) : (
            <>
              <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span>Fuel</span>
            </>
          )}
        </div>

        <div className="detail-item">
          <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Health: {vehicle.healthScore}%</span>
        </div>
      </div>

      {reason && (
        <div className="recommendation-reason">
          <svg className="reason-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{reason}</p>
        </div>
      )}

      <div className="vehicle-card-footer">
        <div className="price-section">
          <span className="price-label">Starting at</span>
          <span className="price-value">${pricePerHour.toFixed(2)}/hr</span>
        </div>
        <button className="book-button" onClick={() => onBook(vehicle)}>
          <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default VehicleRecommendationCard;