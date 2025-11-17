import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleService, bookingService } from '../services/api';
import Logo from '../components/Logo';
import BookingModal from '../components/BookingModal';
import {
  VehicleIcon,
  BookingIcon,
  LogoutIcon,
  FilterIcon,
  LocationIcon,
  BatteryIcon,
  CalendarIcon
} from '../components/Icons';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [filterElectric, setFilterElectric] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activeTab, setActiveTab] = useState('browse');

  const fullName = localStorage.getItem('fullName') || 'Customer';
  const username = localStorage.getItem('username');

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      const [vehiclesRes, bookingsRes] = await Promise.all([
        vehicleService.getAllForCustomer(),
        bookingService.getCustomerBookings(username),
      ]);

      setVehicles(vehiclesRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleBookVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsBookingModalOpen(true);
  };

  const handleCreateBooking = async (bookingData) => {
    try {
      const response = await bookingService.create({
        customer: { username },
        vehicle: { id: bookingData.vehicleId },
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        pickupLocation: bookingData.pickupLocation,
        dropoffLocation: bookingData.dropoffLocation,
        totalPrice: bookingData.totalPrice,
      });

      await loadData();
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    if (filterType !== 'ALL' && v.type !== filterType) return false;
    if (filterElectric && !v.isElectric) return false;
    return true;
  });

  const getVehicleStatusStyle = (status) => {
    const statusMap = {
      'AVAILABLE': 'status-available',
      'IN_USE': 'status-in-use',
      'MAINTENANCE': 'status-maintenance',
      'OUT_OF_SERVICE': 'status-critical',
    };
    return statusMap[status] || 'status-maintenance';
  };

  const getStatusStyle = (status) => {
    const statusMap = {
      'CONFIRMED': 'status-available',
      'IN_PROGRESS': 'status-in-use',
      'PENDING': 'status-maintenance',
      'COMPLETED': 'bg-blue-500/20 border-blue-500 text-blue-400',
      'CANCELLED': 'status-critical',
    };
    return statusMap[status] || 'status-maintenance';
  };

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-20"></div>

      <nav className="relative bg-dark-800/40 backdrop-blur-glass border-b border-white/10 shadow-glass">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Logo size="sm" animate={false} showText={true} />
              <div className="h-8 w-px bg-white/20"></div>
              <div>
                <h1 className="text-lg font-bold text-white flex items-center gap-2">
                  👤 Customer Portal
                </h1>
                <p className="text-xs text-white/50">Book Your Perfect Ride</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-white/70">Welcome back,</p>
                <p className="text-sm font-semibold text-white">{fullName}</p>
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary flex items-center gap-2"
              >
                <LogoutIcon size="sm" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <VehicleIcon size="lg" className="text-accent-cyan" />
              Vehicle Booking
            </h2>
            <p className="text-white/50">Find and book the perfect vehicle for your journey</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'browse'
                  ? 'bg-gradient-to-r from-accent-green to-accent-cyan text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              Browse Vehicles
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'bookings'
                  ? 'bg-gradient-to-r from-accent-green to-accent-cyan text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              My Bookings ({bookings.length})
            </button>
          </div>
        </div>

        {activeTab === 'browse' && (
          <>
            <div className="glass-card p-6 mb-8 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <FilterIcon size="md" className="text-accent-cyan" />
                <h3 className="text-xl font-bold text-white">Filters</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-white/70 text-sm font-semibold mb-2">
                    Vehicle Type
                  </label>
                  <select
                    className="input-field"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
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

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer p-3 bg-dark-700/40 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                    <input
                      type="checkbox"
                      checked={filterElectric}
                      onChange={(e) => setFilterElectric(e.target.checked)}
                      className="w-5 h-5 accent-accent-cyan"
                    />
                    <span className="text-white/90 text-sm font-semibold">⚡ Electric Only</span>
                  </label>
                </div>

                <div className="flex items-end ml-auto">
                  <div className="text-white/70 text-sm">
                    <span className="font-semibold text-white">{filteredVehicles.length}</span> vehicles found
                    <span className="ml-2 text-accent-green">
                      ({filteredVehicles.filter(v => v.status === 'AVAILABLE').length} available)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <VehicleIcon size="md" className="text-accent-green" />
                <h3 className="text-xl font-bold text-white">All Vehicles</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle, index) => (
                  <div
                    key={vehicle.id}
                    className="glass-card-hover p-6 group relative overflow-hidden"
                  >
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className={`status-badge ${getVehicleStatusStyle(vehicle.status)}`}>
                        <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                        {vehicle.status === 'IN_USE' ? 'In Use' : vehicle.status === 'OUT_OF_SERVICE' ? 'Out of Service' : vehicle.status}
                      </span>
                      {index === 0 && vehicle.status === 'AVAILABLE' && (
                        <span className="bg-gradient-to-r from-accent-green to-accent-cyan text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                          ✨ Recommended
                        </span>
                      )}
                    </div>

                    <div className="mb-4 mt-8">
                      <h4 className="text-lg font-bold text-white mb-1">{vehicle.model}</h4>
                      <p className="text-sm text-white/50">{vehicle.vehicleNumber}</p>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Type:</span>
                        <span className="text-white font-semibold">{vehicle.type}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Capacity:</span>
                        <span className="text-white font-semibold">{vehicle.capacity} seats</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Fuel Type:</span>
                        <span className="text-white font-semibold">
                          {vehicle.isElectric ? '⚡ Electric' : '⛽ Fuel'}
                        </span>
                      </div>
                      {vehicle.isElectric && (
                        <div className="flex items-center gap-2">
                          <BatteryIcon size="sm" className="text-accent-cyan" level={vehicle.batteryLevel || 100} />
                          <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-accent-cyan to-accent-blue rounded-full transition-all duration-500"
                              style={{ width: `${vehicle.batteryLevel || 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-white/70">{vehicle.batteryLevel || 100}%</span>
                        </div>
                      )}
                      <div className="divider my-2"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Rental Rate:</span>
                        <span className="text-accent-green font-bold text-xl">$10/hr</span>
                      </div>
                    </div>

                    {vehicle.status === 'AVAILABLE' ? (
                      <button
                        onClick={() => handleBookVehicle(vehicle)}
                        className="w-full btn-primary"
                      >
                        Book Now
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full btn-secondary opacity-50 cursor-not-allowed"
                      >
                        {vehicle.status === 'IN_USE' ? 'Currently In Use' :
                          vehicle.status === 'MAINTENANCE' ? 'Under Maintenance' :
                            'Not Available'}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {filteredVehicles.length === 0 && (
                <div className="text-center py-12">
                  <VehicleIcon size="xl" className="text-white/20 mx-auto mb-4" />
                  <p className="text-white/50 text-lg mb-2">No vehicles available</p>
                  <p className="text-white/30 text-sm">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'bookings' && (
          <div className="glass-card p-6 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <BookingIcon size="md" className="text-accent-purple" />
              <h3 className="text-xl font-bold text-white">My Bookings</h3>
            </div>

            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="glass-card-hover p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-white">
                            {booking.vehicle?.model || 'Vehicle'}
                          </h4>
                          <span className={`status-badge ${getStatusStyle(booking.status)}`}>
                            <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm text-white/50">
                          Booking #{booking.id} • {booking.vehicle?.vehicleNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-accent-green font-bold text-2xl">${booking.totalPrice?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon size="sm" className="text-accent-cyan" />
                          <span className="text-white/60">Start:</span>
                          <span className="text-white font-semibold">
                            {new Date(booking.startTime).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon size="sm" className="text-accent-cyan" />
                          <span className="text-white/60">End:</span>
                          <span className="text-white font-semibold">
                            {new Date(booking.endTime).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                          <LocationIcon size="sm" className="text-accent-green mt-0.5" />
                          <div className="flex-1">
                            <p className="text-white/60 mb-1">Pickup:</p>
                            <p className="text-white font-semibold">{booking.pickupLocation || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <LocationIcon size="sm" className="text-accent-pink mt-0.5" />
                          <div className="flex-1">
                            <p className="text-white/60 mb-1">Dropoff:</p>
                            <p className="text-white font-semibold">{booking.dropoffLocation || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookingIcon size="xl" className="text-white/20 mx-auto mb-4" />
                <p className="text-white/50 text-lg mb-2">No bookings yet</p>
                <p className="text-white/30 text-sm mb-6">Start by booking a vehicle from the browse section</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="btn-primary"
                >
                  Browse Vehicles
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBook={handleCreateBooking}
        vehicle={selectedVehicle}
      />
    </div>
  );
};

export default CustomerDashboard;
