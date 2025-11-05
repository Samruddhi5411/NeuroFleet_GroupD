import axios from 'axios';

const API_BASE_URL = 'http://localhost:8083/api';
const AI_SERVICE_URL = 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  signup: (userData) => api.post('/auth/signup', userData),
};

export const vehicleService = {
  getAll: () => api.get('/admin/vehicles'),
  getAllForCustomer: () => api.get('/customer/vehicles'),
  getById: (id) => api.get(`/vehicles/${id}`),
  create: (vehicle) => api.post('/admin/vehicles', vehicle),
  update: (id, vehicle) => api.put(`/admin/vehicles/${id}`, vehicle),
  delete: (id) => api.delete(`/admin/vehicles/${id}`),
  updateTelemetry: (id) => api.put(`/vehicles/${id}/telemetry`),
  getByStatus: (status) => api.get(`/vehicles/status/${status}`),
};

export const bookingService = {
  getAll: () => api.get('/admin/bookings'),
  getCustomerBookings: (username) => api.get(`/customer/bookings?username=${username}`),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (booking) => api.post('/customer/bookings', booking),
  update: (id, booking) => api.put(`/bookings/${id}`, booking),
  getRecommended: (username) => api.get(`/customer/bookings/recommended?username=${username}`),
};

export const maintenanceService = {
  getAll: () => api.get('/admin/maintenance'),
  getById: (id) => api.get(`/maintenance/${id}`),
  getByVehicle: (vehicleId) => api.get(`/maintenance/vehicle/${vehicleId}`),
  getPredictive: () => api.get('/maintenance/predictive'),
  create: (maintenance) => api.post('/admin/maintenance', maintenance),
  update: (id, maintenance) => api.put(`/admin/maintenance/${id}`, maintenance),
};

export const userService = {
  getAll: () => api.get('/admin/users'),
  getByRole: (role) => api.get(`/admin/users/role/${role}`),
  getById: (id) => api.get(`/admin/users/${id}`),
  toggleActive: (id) => api.put(`/admin/users/${id}/toggle-active`),
};

// ============ AI SERVICE INTEGRATION ============

export const aiService = {
  // Predict ETA using ML model
  predictETA: async (distanceKm, avgSpeed, trafficLevel, batteryLevel, fuelLevel) => {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/predict-eta`, {
        distanceKm,
        avgSpeed,
        trafficLevel,
        batteryLevel,
        fuelLevel,
      });
      return response.data;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  },

  // Predict maintenance needs
  predictMaintenance: async (healthScore, mileage, kmsSinceService, batteryLevel) => {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/predict-maintenance`, {
        healthScore,
        mileage,
        kmsSinceService,
        batteryLevel,
      });
      return response.data;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  },

  // Optimize route
  optimizeRoute: async (pickup, dropoff, trafficCondition) => {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/optimize-route`, {
        pickup,
        dropoff,
        trafficCondition,
      });
      return response.data;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  },

  // Check AI service health
  checkHealth: async () => {
    try {
      const response = await axios.get(`${AI_SERVICE_URL}/health`);
      return response.data;
    } catch (error) {
      return { status: 'offline' };
    }
  },
};

export default api;