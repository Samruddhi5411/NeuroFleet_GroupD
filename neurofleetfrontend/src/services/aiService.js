

import axios from 'axios';

const AI_API_BASE = 'http://localhost:8080/api/ai';

export const aiService = {
  // Predict ETA
  async predictETA(pickupLat, pickupLon, dropoffLat, dropoffLon, vehicleHealth = 0.85, isElectric = false) {
    const response = await fetch(`${AI_API_BASE}/eta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pickupLat,
        pickupLon,
        dropoffLat,
        dropoffLon,
        vehicleHealth,
        isElectric
      })
    });
    return response.json();
  },

  // Get vehicle recommendations
  async recommendVehicles(pickupLat, pickupLon, passengers = 1, preferElectric = false) {
    const response = await fetch(`${AI_API_BASE}/recommend-vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pickupLat,
        pickupLon,
        passengers,
        preferElectric
      })
    });
    return response.json();
  },

  // Predict maintenance
  async predictMaintenance(vehicleId) {
    const response = await fetch(`${AI_API_BASE}/maintenance/${vehicleId}`);
    return response.json();
  },

  // Train models
  async trainModels() {
    const response = await fetch(`${AI_API_BASE}/train`, { method: 'POST' });
    return response.json();
  }
};