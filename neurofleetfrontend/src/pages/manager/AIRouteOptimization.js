// src/pages/manager/AIRouteOptimization.jsx

import React, { useState } from 'react';
import { aiService } from '../../services/aiService';
import { RouteIcon } from '../../components/Icons';

const AIRouteOptimization = () => {
  const [routeData, setRouteData] = useState({
    startLatitude: 34.0837,
    startLongitude: 74.7973,
    endLatitude: 8.0883,
    endLongitude: 77.5385,
    vehicleType: 'SEDAN'
  });

  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    try {
      setLoading(true);
      const response = await aiService.optimizeRoute(routeData);
      console.log('🗺️ Optimized Route:', response.data);
      setOptimizedRoute(response.data);
    } catch (error) {
      console.error('Error optimizing route:', error);
      alert('Failed to optimize route');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-4xl">🤖</span>
        <div>
          <h2 className="text-3xl font-bold text-white">AI Route Optimization</h2>
          <p className="text-white/50">Dijkstra + Machine Learning ETA Prediction</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Route Parameters</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white/70 text-sm mb-2 block">Start Latitude</label>
            <input
              type="number"
              step="0.0001"
              className="input-field w-full"
              value={routeData.startLatitude}
              onChange={(e) => setRouteData({ ...routeData, startLatitude: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-white/70 text-sm mb-2 block">Start Longitude</label>
            <input
              type="number"
              step="0.0001"
              className="input-field w-full"
              value={routeData.startLongitude}
              onChange={(e) => setRouteData({ ...routeData, startLongitude: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-white/70 text-sm mb-2 block">End Latitude</label>
            <input
              type="number"
              step="0.0001"
              className="input-field w-full"
              value={routeData.endLatitude}
              onChange={(e) => setRouteData({ ...routeData, endLatitude: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-white/70 text-sm mb-2 block">End Longitude</label>
            <input
              type="number"
              step="0.0001"
              className="input-field w-full"
              value={routeData.endLongitude}
              onChange={(e) => setRouteData({ ...routeData, endLongitude: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-white/70 text-sm mb-2 block">Vehicle Type</label>
            <select
              className="input-field w-full"
              value={routeData.vehicleType}
              onChange={(e) => setRouteData({ ...routeData, vehicleType: e.target.value })}
            >
              <option value="SEDAN">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="VAN">Van</option>
              <option value="TRUCK">Truck</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleOptimize}
          disabled={loading}
          className="mt-6 btn-primary w-full"
        >
          {loading ? '🤖 Optimizing...' : '🚀 Optimize Route with AI'}
        </button>
      </div>

      {optimizedRoute && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Optimization Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card-hover p-4">
              <p className="text-white/60 text-sm mb-1">Distance</p>
              <p className="text-2xl font-bold text-accent-cyan">
                {optimizedRoute.primaryRoute?.distanceKm} km
              </p>
            </div>
            <div className="glass-card-hover p-4">
              <p className="text-white/60 text-sm mb-1">ETA</p>
              <p className="text-2xl font-bold text-accent-green">
                {optimizedRoute.primaryRoute?.etaMinutes} min
              </p>
            </div>
            <div className="glass-card-hover p-4">
              <p className="text-white/60 text-sm mb-1">Traffic</p>
              <p className="text-2xl font-bold text-accent-purple">
                {optimizedRoute.primaryRoute?.trafficLevel}
              </p>
            </div>
            <div className="glass-card-hover p-4">
              <p className="text-white/60 text-sm mb-1">Cost</p>
              <p className="text-2xl font-bold text-accent-pink">
                ${optimizedRoute.primaryRoute?.energyCost}
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-accent-green/10 to-accent-cyan/10 border border-accent-green/30 rounded-xl">
            <p className="text-accent-green font-semibold mb-2">
              🤖 AI Optimization: {optimizedRoute.optimizationAlgorithm}
            </p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-white/60">Time Saved:</span>
                <span className="text-white font-bold ml-2">
                  {optimizedRoute.timeSavedMinutes} min
                </span>
              </div>
              <div>
                <span className="text-white/60">Energy Saved:</span>
                <span className="text-white font-bold ml-2">
                  {optimizedRoute.energySavedPercent}%
                </span>
              </div>
              <div>
                <span className="text-white/60">Routes Analyzed:</span>
                <span className="text-white font-bold ml-2">
                  {optimizedRoute.totalRoutesAnalyzed}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRouteOptimization;