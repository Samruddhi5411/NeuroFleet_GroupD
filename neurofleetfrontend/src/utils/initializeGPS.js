// Utility to initialize GPS coordinates for all vehicles
import axios from 'axios';

export const initializeVehicleGPS = async () => {
  try {
    const response = await axios.post('http://localhost:8083/api/admin/vehicles/initialize-gps');
    console.log('GPS initialization result:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error initializing GPS:', error);
    throw error;
  }
};

// Run this once to fix coordinates
// Usage: import { initializeVehicleGPS } from './utils/initializeGPS';
// Then call: initializeVehicleGPS();
