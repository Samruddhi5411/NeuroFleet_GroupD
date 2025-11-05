

const API_BASE_URL = 'http://localhost:8083/api';

// Create axios-like wrapper
const createRequest = async (method, url, data = null) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { data: result };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

const api = {
  get: (url) => createRequest('GET', url),
  post: (url, data) => createRequest('POST', url, data),
  put: (url, data) => createRequest('PUT', url, data),
  delete: (url) => createRequest('DELETE', url),
};

// ============ AUTH SERVICE ============
export const authService = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  signup: (userData) => api.post('/auth/signup', userData),
};

// ============ VEHICLE SERVICE ============
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

// ============ BOOKING SERVICE - FIXED ============
export const bookingService = {
  getAll: () => api.get('/admin/bookings'),
  getCustomerBookings: (username) => api.get(`/customer/bookings?username=${username}`),
  getById: (id) => api.get(`/bookings/${id}`),
  create: async (booking) => {
    try {
      // Format the booking data correctly
      const bookingData = {
        customer: booking.customer,
        vehicle: booking.vehicle,
        startTime: booking.startTime,
        endTime: booking.endTime,
        pickupLocation: booking.pickupLocation || '',
        dropoffLocation: booking.dropoffLocation || '',
        totalPrice: booking.totalPrice || 0,
        status: 'PENDING'
      };

      console.log('Creating booking with data:', bookingData);
      return await api.post('/customer/bookings', bookingData);
    } catch (error) {
      console.error('Booking creation error:', error);
      throw new Error('Failed to create booking. Please try again.');
    }
  },
  update: (id, booking) => api.put(`/bookings/${id}`, booking),
  getRecommended: (username) => api.get(`/customer/bookings/recommended?username=${username}`),
};

// ============ MAINTENANCE SERVICE ============
export const maintenanceService = {
  getAll: () => api.get('/admin/maintenance'),
  getById: (id) => api.get(`/maintenance/${id}`),
  getByVehicle: (vehicleId) => api.get(`/maintenance/vehicle/${vehicleId}`),
  getPredictive: () => api.get('/maintenance/predictive'),
  create: (maintenance) => api.post('/admin/maintenance', maintenance),
  update: (id, maintenance) => api.put(`/admin/maintenance/${id}`, maintenance),
};

// ============ USER SERVICE ============
export const userService = {
  getAll: () => api.get('/admin/users'),
  getByRole: (role) => api.get(`/admin/users/role/${role}`),
  getById: (id) => api.get(`/admin/users/${id}`),
  toggleActive: (id) => api.put(`/admin/users/${id}/toggle-active`),
};

// ============ AI SERVICE ============
export const aiService = {
  predictETA: async (distanceKm, avgSpeed, trafficLevel, batteryLevel, fuelLevel) => {
    try {
      return await api.post('/ai/predict-eta', {
        distanceKm,
        avgSpeed,
        trafficLevel,
        batteryLevel,
        fuelLevel,
      });
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        data: {
          predicted_eta: Math.round((distanceKm / avgSpeed) * 60 * 1.5),
          fallback: true
        }
      };
    }
  },

  predictMaintenance: async (healthScore, mileage, kmsSinceService, batteryLevel) => {
    try {
      return await api.post('/ai/predict-maintenance', {
        healthScore,
        mileage,
        kmsSinceService,
        batteryLevel,
      });
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        data: {
          risk_score: 0,
          priority: 'LOW',
          fallback: true
        }
      };
    }
  },

  optimizeRoute: async (pickup, dropoff, trafficCondition) => {
    try {
      return await api.post('/ai/optimize-route', {
        pickup,
        dropoff,
        trafficCondition,
      });
    } catch (error) {
      console.error('AI Service Error:', error);
      return { data: { routes: [], fallback: true } };
    }
  },

  checkHealth: async () => {
    try {
      return await api.get('/ai/health');
    } catch (error) {
      return { data: { status: 'offline' } };
    }
  },
};

export default api;