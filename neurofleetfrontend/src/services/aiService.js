

import axios from 'axios';

const AI_BASE_URL = 'http://localhost:8083/api/ai';

export const aiService = {
  // Predictive Maintenance
  predictMaintenance: (vehicleId) =>
    axios.post(`${AI_BASE_URL}/maintenance/predict/${vehicleId}`),

  analyzeFleetMaintenance: () =>
    axios.get(`${AI_BASE_URL}/maintenance/analyze-fleet`),

  // Route Optimization
  optimizeRoute: (routeData) =>
    axios.post(`${AI_BASE_URL}/route/optimize`, routeData),

  // Smart Recommendations
  getVehicleRecommendations: (customerId) =>
    axios.get(`${AI_BASE_URL}/recommend/vehicles/${customerId}`),
};