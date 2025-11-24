import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VehicleMap from '../map/VehicleMap';
import { RouteIcon, LocationIcon, CalendarIcon, VehicleIcon } from '../Icons';

const TripControl = ({ trip, onTripUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const username = localStorage.getItem('username');

  // Get current GPS location
  useEffect(() => {
    if (navigator.geolocation && trip?.status === 'IN_PROGRESS') {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            speed: position.coords.speed || 0
          };
          setCurrentLocation(location);
          setGpsEnabled(true);

          // Update backend with new location
          updateLocationOnServer(location);
        },
        (error) => {
          console.error('GPS Error:', error);
          setGpsEnabled(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [trip?.status]);

  const updateLocationOnServer = async (location) => {
    if (!trip?.id) return;

    try {
      await axios.put(
        `http://localhost:8083/api/trips/${trip.id}/location`,
        location,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      );
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  };

  const handleStartTrip = async () => {
    if (!trip?.id) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      // Get current location for trip start
      let startLocation = { latitude: 19.0760, longitude: 72.8777 }; // Default Mumbai

      if (navigator.geolocation) {
        await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              startLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              resolve();
            },
            () => resolve() // Use default if GPS fails
          );
        });
      }

      const response = await axios.put(
        `http://localhost:8083/api/trips/${trip.id}/start?username=${username}`,
        startLocation,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      alert('✅ Trip started! GPS tracking enabled.');
      onTripUpdate(response.data);
    } catch (error) {
      console.error('Failed to start trip:', error);
      alert('❌ Failed to start trip: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTrip = async () => {
    if (!trip?.id) return;

    const confirm = window.confirm('Complete this trip? This action cannot be undone.');
    if (!confirm) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8083/api/trips/${trip.id}/complete?username=${username}`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      alert('✅ Trip completed! Earnings updated.');
      onTripUpdate(response.data);
    } catch (error) {
      console.error('Failed to complete trip:', error);
      alert('❌ Failed to complete trip: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!trip) {
    return (
      <div className="glass-card p-12 text-center">
        <RouteIcon size="xl" className="text-white/20 mx-auto mb-4" />
        <p className="text-white/50">No active trip</p>
      </div>
    );
  }

  const booking = trip.booking || {};

  return (
    <div className="space-y-6">
      {/* Trip Details Card */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white">Trip #{trip.id}</h3>
            <p className="text-white/50 text-sm">
              Customer: {trip.customer?.fullName || 'Unknown'}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${trip.status === 'ONGOING' ? 'bg-accent-green/20 text-accent-green animate-pulse' :
              trip.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                trip.status === 'COMPLETED' ? 'bg-accent-blue/20 text-accent-blue' :
                  'bg-red-500/20 text-red-400'
            }`}>
            {trip.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Locations */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-green/20 flex items-center justify-center flex-shrink-0">
                <LocationIcon size="sm" className="text-accent-green" />
              </div>
              <div className="flex-1">
                <p className="text-white/60 text-xs mb-1">Pickup</p>
                <p className="text-white font-semibold text-sm">{booking.pickupLocation}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-pink/20 flex items-center justify-center flex-shrink-0">
                <LocationIcon size="sm" className="text-accent-pink" />
              </div>
              <div className="flex-1">
                <p className="text-white/60 text-xs mb-1">Dropoff</p>
                <p className="text-white font-semibold text-sm">{booking.dropoffLocation}</p>
              </div>
            </div>
          </div>

          {/* Vehicle & Time */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <VehicleIcon size="sm" className="text-accent-cyan" />
              <div className="flex-1">
                <p className="text-white/60 text-xs mb-1">Vehicle</p>
                <p className="text-white font-semibold text-sm">
                  {trip.vehicle?.model} ({trip.vehicle?.vehicleNumber})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CalendarIcon size="sm" className="text-accent-cyan" />
              <div className="flex-1">
                <p className="text-white/60 text-xs mb-1">Scheduled</p>
                <p className="text-white font-semibold text-sm">
                  {trip.scheduledStartTime ? new Date(trip.scheduledStartTime).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>

            {trip.actualStartTime && (
              <div className="flex items-center gap-3">
                <CalendarIcon size="sm" className="text-accent-green" />
                <div className="flex-1">
                  <p className="text-white/60 text-xs mb-1">Started</p>
                  <p className="text-white font-semibold text-sm">
                    {new Date(trip.actualStartTime).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* GPS Status */}
        {trip.status === 'ONGOING' && (
          <div className="p-3 bg-dark-700/40 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${gpsEnabled ? 'bg-accent-green animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-white/70 text-sm">
                  GPS Tracking: {gpsEnabled ? 'Active' : 'Disabled'}
                </span>
              </div>
              {currentLocation && (
                <span className="text-white/50 text-xs">
                  Speed: {Math.round(currentLocation.speed * 3.6)} km/h
                </span>
              )}
            </div>
          </div>
        )}

        {/* Earnings */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <p className="text-white/60 text-sm">Trip Fare</p>
            <p className="text-accent-green font-bold text-2xl">
              ${trip.tripFare?.toFixed(2) || '0.00'}
            </p>
            <p className="text-white/50 text-xs">
              Your earnings: ${trip.driverEarnings?.toFixed(2) || '0.00'} (70%)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {trip.status === 'PENDING' && (
              <button
                onClick={handleStartTrip}
                disabled={loading}
                className="btn-primary px-8"
              >
                {loading ? 'Starting...' : '🚀 Start Trip'}
              </button>
            )}

            {trip.status === 'ONGOING' && (
              <button
                onClick={handleCompleteTrip}
                disabled={loading}
                className="btn-primary bg-gradient-to-r from-accent-green to-accent-cyan px-8"
              >
                {loading ? 'Completing...' : '✅ Complete Trip'}
              </button>
            )}

            {trip.status === 'COMPLETED' && (
              <div className="text-center">
                <p className="text-accent-green font-bold">✅ Trip Completed</p>
                <p className="text-white/50 text-xs mt-1">
                  {trip.actualEndTime ? new Date(trip.actualEndTime).toLocaleString() : ''}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Live Route</h3>
        <VehicleMap
          booking={{
            ...booking,
            vehicle: trip.vehicle,
            driver: trip.driver,
            status: trip.status === 'ONGOING' ? 'IN_PROGRESS' : trip.status
          }}
          showVehicle={true}
          showRoute={true}
          autoUpdate={trip.status === 'ONGOING'}
          height="500px"
        />
      </div>
    </div>
  );
};

export default TripControl;