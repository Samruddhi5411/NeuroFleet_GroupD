import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const RouteOptimization = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loads, setLoads] = useState([]);
  const [formData, setFormData] = useState({
    vehicleId: '',
    startLocation: '',
    endLocation: '',
    startLatitude: 40.7128,
    startLongitude: -74.0060,
    endLatitude: 40.7580,
    endLongitude: -73.9855,
  });
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoutes();
    fetchVehicles();
    fetchLoads();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/routes');
      setRoutes(response.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/manager/vehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const fetchLoads = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/loads');
      setLoads(response.data);
    } catch (error) {
      console.error('Error fetching loads:', error);
    }
  };

  const handleOptimizeRoute = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/routes/optimize', {
        ...formData,
        vehicleId: formData.vehicleId || null,
        includeTrafficData: true,
        generateAlternatives: true,
      });
      setOptimizationResult(response.data);
      setSelectedRoute(response.data.primaryRoute);
      fetchRoutes();
    } catch (error) {
      console.error('Error optimizing route:', error);
      alert('Failed to optimize route. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoAssignLoads = async () => {
    try {
      await axios.post('http://localhost:8080/api/loads/auto-assign');
      alert('Loads auto-assigned successfully!');
      fetchLoads();
      fetchVehicles();
    } catch (error) {
      console.error('Error auto-assigning loads:', error);
      alert('Failed to auto-assign loads.');
    }
  };

  const getRouteColor = (optimizationType) => {
    switch (optimizationType) {
      case 'FASTEST':
        return '#10b981';
      case 'ENERGY_EFFICIENT':
        return '#3b82f6';
      case 'BALANCED':
        return '#f59e0b';
      case 'SHORTEST':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const getTrafficColor = (trafficLevel) => {
    switch (trafficLevel) {
      case 'LOW':
        return '#10b981';
      case 'MEDIUM':
        return '#f59e0b';
      case 'HIGH':
        return '#ef4444';
      case 'SEVERE':
        return '#991b1b';
      default:
        return '#6b7280';
    }
  };

  const generatePolylineCoordinates = (route) => {
    const startLat = route.startLatitude || 40.7128;
    const startLon = route.startLongitude || -74.0060;
    const endLat = route.endLatitude || 40.7580;
    const endLon = route.endLongitude || -73.9855;

    const steps = 20;
    const coordinates = [];
    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      const lat = startLat + (endLat - startLat) * ratio + (Math.random() - 0.5) * 0.01;
      const lon = startLon + (endLon - startLon) * ratio + (Math.random() - 0.5) * 0.01;
      coordinates.push([lat, lon]);
    }
    return coordinates;
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-4xl">🗺️</span>
          AI Route & Load Optimization
        </h2>
        <p className="text-white/50">Dijkstra's Algorithm + ML ETA Predictor with Live Map Visualization</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🚀</span> Optimize Route
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-white/70 text-sm mb-1 block">Vehicle</label>
              <select
                className="w-full bg-dark-700 border border-white/20 rounded-lg px-3 py-2 text-white"
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
              >
                <option value="">Select Vehicle (Optional)</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.vehicleNumber} - {v.model}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Start Location</label>
              <input
                type="text"
                className="w-full bg-dark-700 border border-white/20 rounded-lg px-3 py-2 text-white"
                placeholder="New York City"
                value={formData.startLocation}
                onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="0.0001"
                className="bg-dark-700 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                placeholder="Start Lat"
                value={formData.startLatitude}
                onChange={(e) => setFormData({ ...formData, startLatitude: parseFloat(e.target.value) })}
              />
              <input
                type="number"
                step="0.0001"
                className="bg-dark-700 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                placeholder="Start Lon"
                value={formData.startLongitude}
                onChange={(e) => setFormData({ ...formData, startLongitude: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">End Location</label>
              <input
                type="text"
                className="w-full bg-dark-700 border border-white/20 rounded-lg px-3 py-2 text-white"
                placeholder="Times Square"
                value={formData.endLocation}
                onChange={(e) => setFormData({ ...formData, endLocation: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="0.0001"
                className="bg-dark-700 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                placeholder="End Lat"
                value={formData.endLatitude}
                onChange={(e) => setFormData({ ...formData, endLatitude: parseFloat(e.target.value) })}
              />
              <input
                type="number"
                step="0.0001"
                className="bg-dark-700 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                placeholder="End Lon"
                value={formData.endLongitude}
                onChange={(e) => setFormData({ ...formData, endLongitude: parseFloat(e.target.value) })}
              />
            </div>
            <button
              onClick={handleOptimizeRoute}
              disabled={loading}
              className="w-full bg-gradient-to-r from-accent-green to-accent-cyan text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-accent-green/30 transition-all disabled:opacity-50"
            >
              {loading ? '⚙️ Optimizing...' : '🎯 Generate Routes'}
            </button>
            <button
              onClick={handleAutoAssignLoads}
              className="w-full bg-gradient-to-r from-accent-purple to-accent-cyan text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-accent-purple/30 transition-all"
            >
              🤖 Auto-Assign Loads
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Interactive Route Map</h3>
          <div className="rounded-xl overflow-hidden border border-white/20" style={{ height: '500px' }}>
            <MapContainer
              center={[40.7128, -74.0060]}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {optimizationResult && optimizationResult.alternativeRoutes &&
                optimizationResult.alternativeRoutes.map((route, index) => (
                  <Polyline
                    key={index}
                    positions={generatePolylineCoordinates(route)}
                    color={getRouteColor(route.optimizationType)}
                    weight={selectedRoute?.routeId === route.routeId ? 6 : 4}
                    opacity={selectedRoute?.routeId === route.routeId ? 1 : 0.6}
                    eventHandlers={{
                      click: () => setSelectedRoute(route),
                    }}
                  >
                    <Popup>
                      <div className="text-sm">
                        <strong>{route.optimizationType}</strong><br />
                        Distance: {route.distanceKm.toFixed(2)} km<br />
                        ETA: {route.etaMinutes} min<br />
                        Traffic: {route.trafficLevel}
                      </div>
                    </Popup>
                  </Polyline>
                ))}
              {optimizationResult && optimizationResult.primaryRoute && (
                <>
                  <Marker position={[optimizationResult.primaryRoute.startLatitude, optimizationResult.primaryRoute.startLongitude]}>
                    <Popup>Start: {optimizationResult.primaryRoute.startLocation}</Popup>
                  </Marker>
                  <Marker position={[optimizationResult.primaryRoute.endLatitude, optimizationResult.primaryRoute.endLongitude]}>
                    <Popup>End: {optimizationResult.primaryRoute.endLocation}</Popup>
                  </Marker>
                </>
              )}
            </MapContainer>
          </div>
        </div>
      </div>

      {optimizationResult && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📊</span> Route Options - Click on map to select
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {optimizationResult.alternativeRoutes.map((route, index) => (
              <div
                key={index}
                onClick={() => setSelectedRoute(route)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${selectedRoute?.routeId === route.routeId
                    ? 'bg-gradient-to-br from-accent-green/20 to-accent-cyan/20 border-2 border-accent-green'
                    : 'bg-dark-700/40 border border-white/10 hover:border-accent-green/50'
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: getRouteColor(route.optimizationType) }}
                  >
                    {route.optimizationType}
                  </div>
                  <div
                    className="px-2 py-1 rounded text-xs font-bold text-white"
                    style={{ backgroundColor: getTrafficColor(route.trafficLevel) }}
                  >
                    {route.trafficLevel}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Distance:</span>
                    <span className="text-white font-bold">{route.distanceKm.toFixed(2)} km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">ETA:</span>
                    <span className="text-accent-green font-bold">{route.etaMinutes} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Energy Cost:</span>
                    <span className="text-accent-cyan font-bold">${route.energyCost.toFixed(2)}</span>
                  </div>
                  <div className="mt-3 text-xs text-white/50">
                    {route.optimizedPath}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-accent-green/10 to-accent-cyan/10 border border-accent-green/30 rounded-xl">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-accent-green">{optimizationResult.totalRoutesAnalyzed}</div>
                <div className="text-sm text-white/60">Routes Analyzed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent-cyan">{optimizationResult.timeSavedMinutes.toFixed(1)} min</div>
                <div className="text-sm text-white/60">Time Saved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent-purple">{optimizationResult.energySavedPercent.toFixed(1)}%</div>
                <div className="text-sm text-white/60">Energy Saved</div>
              </div>
            </div>
            <div className="mt-3 text-center text-sm text-white/70">
              Algorithm: {optimizationResult.optimizationAlgorithm}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📦</span> Load Management
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loads.slice(0, 10).map((load) => (
              <div key={load.loadId} className="p-3 bg-dark-700/40 border border-white/10 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">Load #{load.loadId}</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${load.status === 'DELIVERED' ? 'bg-accent-green/20 text-accent-green' :
                      load.status === 'IN_TRANSIT' ? 'bg-accent-cyan/20 text-accent-cyan' :
                        load.status === 'ASSIGNED' ? 'bg-accent-purple/20 text-accent-purple' :
                          'bg-white/10 text-white/70'
                    }`}>
                    {load.status}
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-white/60">Weight:</span>
                    <span className="text-white">{load.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Destination:</span>
                    <span className="text-white">{load.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Priority:</span>
                    <span className={`font-bold ${load.priority === 'URGENT' ? 'text-red-400' :
                        load.priority === 'HIGH' ? 'text-orange-400' :
                          'text-white'
                      }`}>
                      {load.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📍</span> Recent Routes
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {routes.slice(0, 10).map((route) => (
              <div
                key={route.routeId}
                className="p-3 bg-dark-700/40 border border-white/10 rounded-lg hover:border-accent-green/50 transition-all cursor-pointer"
                onClick={() => setSelectedRoute(route)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: getRouteColor(route.optimizationType) }}
                  >
                    {route.optimizationType}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${route.status === 'COMPLETED' ? 'bg-accent-green/20 text-accent-green' :
                      route.status === 'ACTIVE' ? 'bg-accent-cyan/20 text-accent-cyan' :
                        'bg-white/10 text-white/70'
                    }`}>
                    {route.status}
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <div className="text-white/70">{route.startLocation} → {route.endLocation}</div>
                  <div className="flex justify-between">
                    <span className="text-white/60">{route.distanceKm.toFixed(1)} km</span>
                    <span className="text-accent-green font-bold">{route.etaMinutes} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">🎨 Route Color Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
            <span className="text-white/80">Fastest Route</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
            <span className="text-white/80">Energy Efficient</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
            <span className="text-white/80">Balanced</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-4 rounded" style={{ backgroundColor: '#8b5cf6' }}></div>
            <span className="text-white/80">Shortest</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteOptimization;