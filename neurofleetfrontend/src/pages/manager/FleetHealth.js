import React, { useState, useEffect } from 'react';
import { maintenanceService } from '../../services/api';
import { VehicleIcon, AlertIcon } from '../../components/Icons';

const FleetHealth = () => {
  const [fleetHealth, setFleetHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFleetHealth();
  }, []);

  const fetchFleetHealth = async () => {
    try {
      const response = await fetch('http://localhost:8083/api/manager/maintenance/fleet-health');
      const data = await response.json();
      setFleetHealth(data);
    } catch (error) {
      console.error('Error fetching fleet health:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    const colors = {
      'CRITICAL': 'text-red-500',
      'HIGH': 'text-orange-500',
      'MEDIUM': 'text-yellow-500',
      'LOW': 'text-green-500'
    };
    return colors[riskLevel] || 'text-gray-500';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Fleet Health Dashboard</h2>
        <p className="text-white/50">AI-powered predictive maintenance monitoring</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm mb-2">Total Vehicles</p>
          <p className="text-4xl font-bold text-accent-cyan">{fleetHealth?.totalVehicles || 0}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm mb-2">Average Health</p>
          <p className="text-4xl font-bold text-accent-green">
            {fleetHealth?.averageHealth?.toFixed(1) || 0}%
          </p>
        </div>
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm mb-2">Critical</p>
          <p className="text-4xl font-bold text-red-500">{fleetHealth?.criticalCount || 0}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm mb-2">High Risk</p>
          <p className="text-4xl font-bold text-orange-500">{fleetHealth?.highRiskCount || 0}</p>
        </div>
      </div>

      {/* Vehicle Health List */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Vehicle Health Status</h3>
        <div className="space-y-3">
          {fleetHealth?.vehiclesPredictions?.map((prediction) => (
            <div key={prediction.vehicleId} className="glass-card-hover p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <VehicleIcon size="md" className={getRiskColor(prediction.riskLevel)} />
                  <div>
                    <h4 className="font-bold text-white">{prediction.vehicleNumber}</h4>
                    <p className="text-sm text-white/50">Health: {prediction.healthScore}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(prediction.riskLevel)}`}>
                    {prediction.riskLevel}
                  </span>
                  <p className="text-xs text-white/50 mt-1">
                    {prediction.predictedDaysToFailure} days to failure
                  </p>
                </div>
              </div>
              {prediction.recommendedActions && prediction.recommendedActions.length > 0 && (
                <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <p className="text-sm text-orange-400">
                    <AlertIcon size="sm" className="inline mr-2" />
                    {prediction.recommendedActions[0]}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FleetHealth;