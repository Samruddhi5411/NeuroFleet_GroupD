
import React, { useState, useEffect } from 'react';
import { aiService } from '../../services/aiService';
import { AlertIcon } from '../../components/Icons';

const PredictiveMaintenance = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMaintenanceAnalysis();
  }, []);

  const loadMaintenanceAnalysis = async () => {
    try {
      setLoading(true);
      const response = await aiService.analyzeFleetMaintenance();
      console.log('🔧 Maintenance Analysis:', response.data);
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error loading maintenance analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'HIGH': return 'text-red-400 bg-red-500/20 border-red-500';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500';
      case 'LOW': return 'text-green-400 bg-green-500/20 border-green-500';
      default: return 'text-white/50';
    }
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
      <div className="flex items-center gap-3">
        <span className="text-4xl">🤖</span>
        <div>
          <h2 className="text-3xl font-bold text-white">AI Predictive Maintenance</h2>
          <p className="text-white/50">Machine learning-powered vehicle health monitoring</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm font-semibold mb-2">Total Vehicles</p>
          <p className="text-4xl font-bold text-accent-cyan">{analysis?.totalVehicles || 0}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm font-semibold mb-2">High Risk</p>
          <p className="text-4xl font-bold text-red-400">{analysis?.highRiskCount || 0}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm font-semibold mb-2">Medium Risk</p>
          <p className="text-4xl font-bold text-yellow-400">{analysis?.mediumRiskCount || 0}</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <AlertIcon size="md" className="text-accent-pink" />
          Vehicles Requiring Attention
        </h3>

        {analysis?.highRiskVehicles?.length > 0 ? (
          <div className="space-y-4">
            {analysis.highRiskVehicles.map((vehicle) => (
              <div key={vehicle.vehicleId} className="glass-card-hover p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-white mb-1">
                      {vehicle.model} - {vehicle.vehicleNumber}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(vehicle.riskLevel)}`}>
                      {vehicle.riskLevel} RISK - {vehicle.riskScore}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-white/70 font-semibold">Recommended Actions:</p>
                  {vehicle.recommendations.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-white/60">
                      <span>•</span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white/50">✅ All vehicles are in good condition</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictiveMaintenance;