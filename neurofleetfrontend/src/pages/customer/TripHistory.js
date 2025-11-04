import React from 'react';
import { RouteIcon, LocationIcon } from '../../components/Icons';

const TripHistory = () => {
  const trips = [
    {
      id: 1,
      date: '2025-10-20',
      pickup: '123 Main St',
      dropoff: '456 Park Ave',
      vehicle: 'Tesla Model S',
      driver: 'John Driver',
      duration: 25,
      distance: 5.2,
      fare: 52.00,
      rating: 5
    },
    {
      id: 2,
      date: '2025-10-15',
      pickup: '789 Broadway',
      dropoff: '321 5th Ave',
      vehicle: 'Ford Explorer',
      driver: 'Jane Driver',
      duration: 35,
      distance: 7.8,
      fare: 78.00,
      rating: 4
    },
    {
      id: 3,
      date: '2025-10-10',
      pickup: '555 Madison Ave',
      dropoff: '777 Lexington Ave',
      vehicle: 'Toyota Camry',
      driver: 'Mike Driver',
      duration: 20,
      distance: 3.5,
      fare: 35.00,
      rating: 5
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <RouteIcon size="lg" className="text-accent-purple" />
          Trip History
        </h2>
        <p className="text-white/50">Review your past trips and experiences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm font-semibold mb-2">Total Trips</p>
          <p className="text-4xl font-bold text-accent-cyan">{trips.length}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm font-semibold mb-2">Total Distance</p>
          <p className="text-4xl font-bold text-accent-green">
            {trips.reduce((sum, t) => sum + t.distance, 0).toFixed(1)} km
          </p>
        </div>
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm font-semibold mb-2">Avg Rating Given</p>
          <p className="text-4xl font-bold text-accent-purple">
            {(trips.reduce((sum, t) => sum + t.rating, 0) / trips.length).toFixed(1)} ⭐
          </p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-6">Completed Trips</h3>
        <div className="space-y-4">
          {trips.map((trip) => (
            <div key={trip.id} className="glass-card-hover p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-bold text-white">Trip #{trip.id}</h4>
                    <span className="status-badge status-available">
                      ✓ Completed
                    </span>
                  </div>
                  <p className="text-sm text-white/50 mb-3">
                    📅 {new Date(trip.date).toLocaleDateString()} • 🚗 {trip.vehicle} • 👤 {trip.driver}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-accent-green font-bold text-2xl">${trip.fare.toFixed(2)}</p>
                  <p className="text-white/50 text-sm">{trip.distance} km • {trip.duration} min</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-start gap-2">
                  <LocationIcon size="sm" className="text-accent-green mt-1" />
                  <div>
                    <p className="text-white/60 text-sm mb-1">Pickup</p>
                    <p className="text-white font-semibold">{trip.pickup}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <LocationIcon size="sm" className="text-accent-pink mt-1" />
                  <div>
                    <p className="text-white/60 text-sm mb-1">Dropoff</p>
                    <p className="text-white font-semibold">{trip.dropoff}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-white/60 text-sm">Your Rating:</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < trip.rating ? 'text-accent-cyan' : 'text-white/20'}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
                <button className="btn-secondary text-sm px-4 py-2">
                  View Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripHistory;