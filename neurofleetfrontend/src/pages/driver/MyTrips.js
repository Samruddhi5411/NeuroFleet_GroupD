import React, { useState } from 'react';
import { RouteIcon, LocationIcon, CalendarIcon } from '../../components/Icons';

const MyTrips = () => {
  const [trips] = useState([
    {
      id: 1,
      pickup: '123 Main St, New York',
      dropoff: '456 Park Ave, New York',
      time: '2025-10-24T10:00:00',
      status: 'SCHEDULED',
      customer: 'Alice Customer',
      vehicle: 'Tesla Model S - NF-001',
      distance: 5.2,
      fare: 52.00
    },
    {
      id: 2,
      pickup: '789 Broadway, New York',
      dropoff: '321 5th Ave, New York',
      time: '2025-10-24T14:00:00',
      status: 'IN_PROGRESS',
      customer: 'Bob Customer',
      vehicle: 'Ford Explorer - NF-005',
      distance: 3.8,
      fare: 38.00
    },
    {
      id: 3,
      pickup: '555 Madison Ave, New York',
      dropoff: '777 Lexington Ave, New York',
      time: '2025-10-23T16:00:00',
      status: 'COMPLETED',
      customer: 'Carol Customer',
      vehicle: 'Toyota Camry - NF-003',
      distance: 7.1,
      fare: 71.00
    },
    {
      id: 4,
      pickup: '100 Wall St, New York',
      dropoff: '200 Broadway, New York',
      time: '2025-10-24T18:00:00',
      status: 'SCHEDULED',
      customer: 'David Customer',
      vehicle: 'Honda Accord - NF-004',
      distance: 4.5,
      fare: 45.00
    },
  ]);

  const getStatusStyle = (status) => {
    const statusMap = {
      'SCHEDULED': 'status-maintenance',
      'IN_PROGRESS': 'status-in-use',
      'COMPLETED': 'status-available',
      'CANCELLED': 'status-critical',
    };
    return statusMap[status] || 'status-maintenance';
  };

  const handleStartTrip = (tripId) => {
    console.log('Starting trip:', tripId);
  };

  const handleCompleteTrip = (tripId) => {
    console.log('Completing trip:', tripId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <RouteIcon size="lg" className="text-accent-cyan" />
          My Trips
        </h2>
        <p className="text-white/50">View and manage your assigned trips</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/60 text-sm font-semibold">Today's Trips</p>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
              <RouteIcon size="sm" className="text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-accent-cyan">
            {trips.filter(t => new Date(t.time).toDateString() === new Date().toDateString()).length}
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/60 text-sm font-semibold">In Progress</p>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center">
              <LocationIcon size="sm" className="text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-accent-green">
            {trips.filter(t => t.status === 'IN_PROGRESS').length}
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/60 text-sm font-semibold">Completed</p>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
              <CalendarIcon size="sm" className="text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-accent-purple">
            {trips.filter(t => t.status === 'COMPLETED').length}
          </p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-6">All Trips</h3>
        <div className="space-y-4">
          {trips.map((trip) => (
            <div key={trip.id} className="glass-card-hover p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-bold text-white">Trip #{trip.id}</h4>
                    <span className={`status-badge ${getStatusStyle(trip.status)}`}>
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                      {trip.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-white/50">{trip.vehicle}</p>
                </div>
                <div className="text-right">
                  <p className="text-accent-green font-bold text-2xl">${trip.fare.toFixed(2)}</p>
                  <p className="text-sm text-white/50">{trip.distance} km</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <LocationIcon size="sm" className="text-accent-green mt-1" />
                    <div>
                      <p className="text-white/60 text-sm mb-1">Pickup Location</p>
                      <p className="text-white font-semibold">{trip.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <LocationIcon size="sm" className="text-accent-pink mt-1" />
                    <div>
                      <p className="text-white/60 text-sm mb-1">Dropoff Location</p>
                      <p className="text-white font-semibold">{trip.dropoff}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-dark-700/40 rounded-lg border border-white/5">
                    <span className="text-white/60 text-sm">Customer</span>
                    <span className="text-white font-semibold">{trip.customer}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-dark-700/40 rounded-lg border border-white/5">
                    <span className="text-white/60 text-sm">Scheduled Time</span>
                    <span className="text-white font-semibold">{new Date(trip.time).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {trip.status === 'SCHEDULED' && (
                  <button
                    onClick={() => handleStartTrip(trip.id)}
                    className="flex-1 btn-primary"
                  >
                    Start Trip
                  </button>
                )}
                {trip.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => handleCompleteTrip(trip.id)}
                    className="flex-1 btn-primary"
                  >
                    Complete Trip
                  </button>
                )}
                {trip.status === 'COMPLETED' && (
                  <button
                    className="flex-1 btn-secondary cursor-default"
                    disabled
                  >
                    ✓ Trip Completed
                  </button>
                )}
                <button className="flex-1 btn-secondary">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyTrips;