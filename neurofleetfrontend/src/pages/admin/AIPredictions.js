import React, { useState, useEffect } from 'react';
import { aiService } from '../../services/api';

const AIPredictions = () => {
  const [etaPrediction, setEtaPrediction] = useState(null);
  const [maintenancePrediction, setMaintenancePrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const [etaInputs, setEtaInputs] = useState({
    distanceKm: 50,
    avgSpeed: 60,
    trafficLevel: 'Medium',
    batteryLevel: 80,
    fuelLevel: 70
  });

  const [maintenanceInputs, setMaintenanceInputs] = useState({
    healthScore: 85,
    mileage: 25000,
    kmsSinceService: 2500,
    batteryLevel: 75
  });

  const predictETA = async () => {
    setLoading(true);
    try {
      const result = await aiService.predictETA(
        etaInputs.distanceKm,
        etaInputs.avgSpeed,
        etaInputs.trafficLevel,
        etaInputs.batteryLevel,
        etaInputs.fuelLevel
      );
      setEtaPrediction(result.data);
    } catch (error) {
      console.error('ETA prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const predictMaintenance = async () => {
    setLoading(true);
    try {
      const result = await aiService.predictMaintenance(
        maintenanceInputs.healthScore,
        maintenanceInputs.mileage,
        maintenanceInputs.kmsSinceService,
        maintenanceInputs.batteryLevel
      );
      setMaintenancePrediction(result.data);
    } catch (error) {
      console.error('Maintenance prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-4xl">🤖</span>
          AI Predictions Dashboard
        </h2>
        <p className="text-white/50">Machine Learning powered predictions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ETA Prediction */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">⏱️</span>
            ETA Prediction
          </h3>

          <div className="space-y-3 mb-4">
            <div>
              <label className="text-white/70 text-sm mb-1 block">Distance (km)</label>
              <input
                type="number"
                className="w-full bg-dark-700 border border-white/20 rounded-lg px-3 py-2 text-white"
                value={etaInputs.distanceKm}
                onChange={(e) => setEtaInputs({ ...etaInputs, distanceKm: parseFloat(e.target.value) })}
              />
            </div>

            <div>
              <label className="text-white/70 text-sm mb-1 block">Average Speed (km/h)</label>
              <input
                type="number"
                className="w-full bg-dark-700 border border-white/20 rounded-lg px-3 py-2 text-white"
                value={etaInputs.avgSpeed}
                onChange={(e) => setEtaInputs({ ...etaInputs, avgSpeed: parseFloat(e.target.value) })}
              />
            </div>

            <div>
              <label className="text-white/70 text-sm mb-1 block">Traffic Level</label>
              <select
                className="w-full bg-dark-700 border border-white/20 rounded-lg px-3 py-2 text-white"
                value={etaInputs.trafficLevel}
                onChange={(e) => setEtaInputs({ ...etaInputs, trafficLevel: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <button
              onClick={predictETA}
              disabled={loading}
              className="w-full bg-gradient-to-r from-accent-cyan to-accent-blue text-white font-bold py-3 rounded-lg hover:shadow-lg disabled:opacity-50"
            >
              {loading ? '⚙️ Predicting...' : '🎯 Predict ETA'}
            </button>
          </div>

          {etaPrediction && (
            <div className="bg-gradient-to-r from-accent-green/10 to-accent-cyan/10 border border-accent-green/30 rounded-xl p-4">
              <div className="text-center">
                <p className="text-white/60 text-sm mb-1">Predicted ETA</p>
                <p className="text-4xl font-bold text-accent-green mb-2">
                  {etaPrediction.predicted_eta} min
                </p>
                {etaPrediction.fallback && (
                  <p className="text-yellow-400 text-xs">⚠️ Fallback calculation (AI service offline)</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Maintenance Prediction */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🔧</span>
            Maintenance Prediction
          </h3>

          <div className="space-y-3 mb-4">
            <div>
              <label className="text-white/70 text-sm mb-1 block">Health Score (%)</label>
              <input
                type="number"
                className="w-full bg-dark-700 border border-white/20 rounded-lg px-3 py-2 text-white"
                value={maintenanceInputs.healthScore}
                onChange={(e) => setMaintenanceInputs({ ...maintenanceInputs, healthScore: parseFloat(e.target.value) })}
              />
            </div>

            <div>
              <label className="text-white/70 text-sm mb-1 block">Mileage (km)</label>
              <input
                type="number"
                className="w-full bg-dark-700 border border-white/20 rounded-lg px-3 py-2 text-white"
                value={maintenanceInputs.mileage}
                onChange={(e) => setMaintenanceInputs({ ...maintenanceInputs, mileage: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <label className="text-white/70 text-sm mb-1 block">Km Since Service</label>
              <input
                type="number"
                className="w-full bg-dark-700 border border-white/20 rounded-lg px-3 py-2 text-white"
                value={maintenanceInputs.kmsSinceService}
                onChange={(e) => setMaintenanceInputs({ ...maintenanceInputs, kmsSinceService: parseInt(e.target.value) })}
              />
            </div>

            <button
              onClick={predictMaintenance}
              disabled={loading}
              className="w-full bg-gradient-to-r from-accent-purple to-accent-pink text-white font-bold py-3 rounded-lg hover:shadow-lg disabled:opacity-50"
            >
              {loading ? '⚙️ Analyzing...' : '🤖 Predict Maintenance'}
            </button>
          </div>

          {maintenancePrediction && (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-accent-purple/10 to-accent-pink/10 border border-accent-purple/30 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Risk Score</p>
                    <p className="text-2xl font-bold text-accent-purple">
                      {maintenancePrediction.risk_score}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Priority</p>
                    <p className={`text-2xl font-bold ${maintenancePrediction.priority === 'CRITICAL' ? 'text-red-400' :
                        maintenancePrediction.priority === 'HIGH' ? 'text-orange-400' :
                          'text-accent-cyan'
                      }`}>
                      {maintenancePrediction.priority}
                    </p>
                  </div>
                </div>
              </div>

              {maintenancePrediction.issues && maintenancePrediction.issues.length > 0 && (
                <div className="bg-dark-700/40 rounded-xl p-3">
                  <p className="text-white/60 text-sm mb-2">Detected Issues:</p>
                  {maintenancePrediction.issues.map((issue, i) => (
                    <p key={i} className="text-white text-sm">• {issue}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ML Model Info */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">🧠 ML Model Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-dark-700/40 rounded-xl p-4">
            <p className="text-white/60 text-sm mb-1">ETA Model</p>
            <p className="text-white font-semibold">XGBoost Regressor</p>
            <p className="text-accent-cyan text-xs mt-1">R² Score: 0.94</p>
          </div>
          <div className="bg-dark-700/40 rounded-xl p-4">
            <p className="text-white/60 text-sm mb-1">Maintenance Model</p>
            <p className="text-white font-semibold">Random Forest</p>
            <p className="text-accent-purple text-xs mt-1">Accuracy: 91%</p>
          </div>
          <div className="bg-dark-700/40 rounded-xl p-4">
            <p className="text-white/60 text-sm mb-1">Training Data</p>
            <p className="text-white font-semibold">1000+ samples</p>
            <p className="text-accent-green text-xs mt-1">Last updated: Nov 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPredictions;