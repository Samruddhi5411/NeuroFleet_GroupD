

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingBookings, setPendingBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [maintenancePredictions, setMaintenancePredictions] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [loading, setLoading] = useState(false);
  const fullName = localStorage.getItem('fullName') || 'Manager';

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 30000);
    return () => clearInterval(interval);
  }, []);
  const getDriverCity = (driverId) => {
    const cities = [
      'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad',
      'Chennai', 'Pune', 'Noida', 'Gurgaon'
    ];

    const cityIndex = (driverId - 1) % cities.length;
    return cities[cityIndex];
  };
  const loadAllData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [bookingsRes, driversRes, vehiclesRes] = await Promise.all([
        axios.get('http://localhost:8083/api/manager/bookings/pending', { headers }),
        axios.get('http://localhost:8083/api/manager/drivers/available', { headers }),
        axios.get('http://localhost:8083/api/manager/vehicles', { headers })
      ]);
       console.log('🔍 DRIVERS RESPONSE:', driversRes.data);
    console.log('🔍 First driver totalTrips:', driversRes.data[0]?.totalTrips);
      setPendingBookings(bookingsRes.data);
      setDrivers(driversRes.data);
      setVehicles(vehiclesRes.data);

      // Load AI maintenance predictions
      loadAIMaintenance();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadAIMaintenance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8083/api/ai/maintenance/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMaintenancePredictions(response.data || []);
    } catch (error) {
      console.error('AI maintenance error:', error);
    }
  };

  const handleApproveAndAssign = async () => {
    if (!selectedDriver) {
      alert('Please select a driver!');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      await axios.put(
        `http://localhost:8083/api/manager/bookings/${selectedBooking.id}/approve`,
        {},
        { headers }
      );

      await axios.put(
        `http://localhost:8083/api/manager/bookings/${selectedBooking.id}/assign-driver?driverId=${selectedDriver}`,
        {},
        { headers }
      );

      alert('✅ Booking approved and driver assigned!');
      setSelectedBooking(null);
      setSelectedDriver('');
      loadAllData();
    } catch (error) {
      console.error('Approval error:', error);
      alert('❌ Failed to process booking: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const getStatusStyle = (status) => {
    const map = {
      'AVAILABLE': 'bg-accent-green/20 text-accent-green',
      'IN_USE': 'bg-accent-cyan/20 text-accent-cyan',
      'MAINTENANCE': 'bg-accent-pink/20 text-accent-pink',
      'PENDING': 'bg-yellow-500/20 text-yellow-400',
    };
    return map[status] || 'bg-white/10 text-white/50';
  };

  const getVehicleIcon = (type) => {
    const icons = {
      SEDAN: '🚗',
      SUV: '🚙',
      VAN: '🚐',
      TRUCK: '🚛',
      BUS: '🚌',
      BIKE: '🏍️'
    };
    return icons[type] || '🚗';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'HIGH': 'bg-red-500/20 text-red-400 border-red-500/30',
      'MEDIUM': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'LOW': 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };
    return colors[priority] || 'bg-gray-500/20 text-gray-400';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'vehicles':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">🚗 Fleet Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="glass-card p-6 text-center">
                <p className="text-white/60 text-sm mb-2">Available</p>
                <p className="text-4xl font-bold text-accent-green">
                  {vehicles.filter(v => v.status === 'AVAILABLE').length}
                </p>
              </div>
              <div className="glass-card p-6 text-center">
                <p className="text-white/60 text-sm mb-2">In Use</p>
                <p className="text-4xl font-bold text-accent-cyan">
                  {vehicles.filter(v => v.status === 'IN_USE').length}
                </p>
              </div>
              <div className="glass-card p-6 text-center">
                <p className="text-white/60 text-sm mb-2">Maintenance</p>
                <p className="text-4xl font-bold text-accent-pink">
                  {vehicles.filter(v => v.status === 'MAINTENANCE').length}
                </p>
              </div>
              <div className="glass-card p-6 text-center">
                <p className="text-white/60 text-sm mb-2">Total Fleet</p>
                <p className="text-4xl font-bold text-accent-purple">{vehicles.length}</p>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">Vehicle Status</h3>
              <div className="space-y-3">
                {vehicles.map((vehicle) => {
                  const aiPrediction = maintenancePredictions.find(p => p.vehicle_id === vehicle.id);

                  return (
                    <div key={vehicle.id} className="flex items-center justify-between p-4 bg-dark-700/40 rounded-xl hover:bg-dark-700/60 transition">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{getVehicleIcon(vehicle.type)}</div>
                        <div>
                          <p className="text-white font-semibold">{vehicle.model}</p>
                          <p className="text-white/50 text-sm">{vehicle.vehicleNumber}</p>
                          {aiPrediction && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-cyan-400 text-xs">🤖 AI:</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(aiPrediction.prediction?.priority)}`}>
                                {aiPrediction.prediction?.priority} Priority
                              </span>
                              <span className="text-white/50 text-xs">
                                Risk: {aiPrediction.prediction?.risk_score}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          <p className="text-white/60">Type: {vehicle.type}</p>
                          <p className="text-white/60">Health: {vehicle.healthScore}%</p>
                          <p className="text-white/60">Capacity: {vehicle.capacity} seats</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(vehicle.status)}`}>
                          {vehicle.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'drivers':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">👥 Available Drivers</h2>
            <div className="glass-card p-6">
              {drivers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  {drivers.map((driver) => (
                    <div key={driver.id} className="glass-card-hover p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-white font-bold">
                          {driver.fullName?.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">{driver.fullName}</h4>
                          <p className="text-white/50 text-xs">📍 {getDriverCity(driver.id)}</p>
                        </div>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-white/60">Total Trips:</span>
                          {/*  REAL trips from database */}
                          <span className="text-white font-semibold">{driver.totalTrips || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Earnings:</span>
                          {/*  REAL earnings */}
                          <span className="text-accent-green font-semibold">
                            ₹{(driver.totalEarnings || 0).toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-white/50 py-8">No drivers available</div>
              )}
            </div>
          </div>
        );

      case 'maintenance':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-white">🤖 AI Maintenance Predictions</h2>
              <button
                onClick={loadAIMaintenance}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:opacity-90"
              >
                🔄 Refresh AI
              </button>
            </div>

            {maintenancePredictions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="glass-card p-4 bg-red-500/10 border border-red-500/20">
                  <p className="text-white/60 text-sm mb-1">High Priority</p>
                  <p className="text-red-400 font-bold text-3xl">
                    {maintenancePredictions.filter(p => p.prediction?.priority === 'HIGH').length}
                  </p>
                </div>
                <div className="glass-card p-4 bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-white/60 text-sm mb-1">Medium Priority</p>
                  <p className="text-yellow-400 font-bold text-3xl">
                    {maintenancePredictions.filter(p => p.prediction?.priority === 'MEDIUM').length}
                  </p>
                </div>
                <div className="glass-card p-4 bg-blue-500/10 border border-blue-500/20">
                  <p className="text-white/60 text-sm mb-1">Low Priority</p>
                  <p className="text-blue-400 font-bold text-3xl">
                    {maintenancePredictions.filter(p => p.prediction?.priority === 'LOW').length}
                  </p>
                </div>
              </div>
            )}

            <div className="glass-card p-6">
              {maintenancePredictions.length > 0 ? (
                <div className="space-y-3">
                  {maintenancePredictions
                    .sort((a, b) => {
                      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
                      return priorityOrder[a.prediction?.priority] - priorityOrder[b.prediction?.priority];
                    })
                    .map((item) => (
                      <div key={item.vehicle_id} className={`p-4 rounded-xl border-2 ${item.prediction?.priority === 'HIGH' ? 'bg-red-500/10 border-red-500/30' :
                        item.prediction?.priority === 'MEDIUM' ? 'bg-yellow-500/10 border-yellow-500/30' :
                          'bg-blue-500/10 border-blue-500/30'
                        }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">🔧</div>
                            <div>
                              <p className="text-white font-semibold">{item.vehicle_number}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-cyan-400 text-xs">🤖 AI Prediction</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${getPriorityColor(item.prediction?.priority)}`}>
                                  {item.prediction?.priority} Priority
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white/60 text-xs">Risk Score</p>
                            <p className={`font-bold text-2xl ${item.prediction?.risk_score > 70 ? 'text-red-400' :
                              item.prediction?.risk_score > 40 ? 'text-yellow-400' :
                                'text-blue-400'
                              }`}>
                              {item.prediction?.risk_score}%
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Low Risk:</span>
                            <span className="text-blue-400 font-semibold">{item.prediction?.confidence?.LOW}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Medium Risk:</span>
                            <span className="text-yellow-400 font-semibold">{item.prediction?.confidence?.MEDIUM}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">High Risk:</span>
                            <span className="text-red-400 font-semibold">{item.prediction?.confidence?.HIGH}%</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10">
                          <p className="text-white/60 text-xs mb-2">🤖 AI Recommendations:</p>
                          <ul className="space-y-1">
                            {item.prediction?.recommendations?.map((rec, idx) => (
                              <li key={idx} className="text-white text-sm flex items-start gap-2">
                                <span className="text-cyan-400">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                          {item.prediction?.next_maintenance_days && (
                            <p className="text-white/50 text-xs mt-2">
                              ⏰ Next maintenance in: <strong>{item.prediction.next_maintenance_days} days</strong>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤖</div>
                  <p className="text-white/50 mb-2">No AI predictions available</p>
                  <p className="text-white/30 text-sm">Make sure the AI service is running on port 5000</p>
                </div>
              )}
            </div>
          </div>
        );

      default: // pending bookings
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">📋 Pending Bookings ({pendingBookings.length})</h2>
            {pendingBookings.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pendingBookings.map((booking) => (
                  <div key={booking.id} className="glass-card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-white">Booking #{booking.id}</h4>
                        <p className="text-white/50 text-sm">Customer: {booking.customer?.fullName}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle('PENDING')}`}>
                        PENDING
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-3xl">{getVehicleIcon(booking.vehicle?.type)}</span>
                        <div>
                          <p className="text-white/60 text-xs">Vehicle</p>
                          <p className="text-white font-semibold">
                            {booking.vehicle?.model} ({booking.vehicle?.vehicleNumber})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <span className="text-green-400">📍</span>
                        <div className="flex-1">
                          <p className="text-white/60 text-xs">Pickup</p>
                          <p className="text-white font-semibold">{booking.pickupLocation}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <span className="text-pink-400">🏁</span>
                        <div className="flex-1">
                          <p className="text-white/60 text-xs">Dropoff</p>
                          <p className="text-white font-semibold">{booking.dropoffLocation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-cyan-400">📅</span>
                        <div>
                          <p className="text-white/60 text-xs">Time</p>
                          <p className="text-white font-semibold">
                            {new Date(booking.startTime).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedBooking?.id === booking.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-white/70 text-sm font-semibold mb-2">
                            Assign Driver
                          </label>

                          <select
                            className="input-field"
                            value={selectedDriver}
                            onChange={(e) => setSelectedDriver(e.target.value)}
                          >
                            <option value="">Select driver...</option>
                            {drivers.map((driver) => (
                              <option key={driver.id} value={driver.id}>
                                {driver.fullName} (📍 {getDriverCity(driver.id)}) - {driver.totalTrips || 0} trips
                              </option>
                            ))}
                          </select>

                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedBooking(null)}
                            className="flex-1 btn-secondary"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleApproveAndAssign}
                            disabled={loading}
                            className="flex-1 btn-primary"
                          >
                            {loading ? 'Processing...' : '✅ Approve & Assign'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="w-full btn-primary"
                      >
                        Process Booking
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-white/50">No pending bookings</p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <nav className="bg-dark-800/40 backdrop-blur-glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-2xl">🚗</div>
              <h1 className="text-lg font-bold text-white">Manager Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white/70">Welcome, {fullName}</span>
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 pb-3 overflow-x-auto">
            {[
              { id: 'pending', label: '📋 Pending Bookings' },
              { id: 'vehicles', label: '🚗 Fleet' },
              { id: 'drivers', label: '👥 Drivers' },
              { id: 'maintenance', label: '🤖 AI Maintenance' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-accent-purple to-accent-pink text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default ManagerDashboard;