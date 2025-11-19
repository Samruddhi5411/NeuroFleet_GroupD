import axios from 'axios';

const API_BASE_URL = 'http://localhost:8083/api';

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
// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export const authService = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  signup: (userData) =>
    api.post('/auth/signup', userData),
};

export const vehicleService = {
  getAll: () => api.get('/admin/vehicles'),
  getAllForManager: () => api.get('/manager/vehicles'),
  getAllForCustomer: () => api.get('/customer/vehicles'),
  getById: (id) => api.get(`/vehicles/${id}`),
  create: (vehicle) => api.post('/admin/vehicles', vehicle),
  update: (id, vehicle) => api.put(`/admin/vehicles/${id}`, vehicle),
  delete: (id) => api.delete(`/admin/vehicles/${id}`),
  updateTelemetry: (id) => api.put(`/vehicles/${id}/telemetry`),
  getByStatus: (status) => api.get(`/vehicles/status/${status}`),
  getActiveVehicleLocations: () => api.get('/vehicles/active-locations'),
  initializeGPS: () => api.post('/admin/vehicles/initialize-gps'),
};

export const bookingService = {
  getAll: () => api.get('/admin/bookings'),
  getCustomerBookings: (username) => api.get(`/customer/bookings?username=${username}`),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (username, booking) => api.post(`/customer/bookings?username=${username}`, booking),
  update: (id, booking) => api.put(`/bookings/${id}`, booking),
  cancel: (id) => api.put(`/customer/bookings/${id}/cancel`),
  getRecommended: (username) => api.get(`/customer/bookings/recommended?username=${username}`),
  searchVehicles: (username, filters) => api.post(`/customer/bookings/search?username=${username}`, filters),
  checkAvailability: (request) => api.post('/customer/bookings/availability', request),
  notifyDriverOfPayment: (bookingId) =>
    api.post(`/customer/bookings/${bookingId}/payment/notify-driver`),
};

export const managerService = {
  getPendingBookings: () => api.get('/manager/bookings/pending'),
  approveBooking: (id) => api.put(`/manager/bookings/${id}/approve`),
  assignDriver: (bookingId, driverId) => api.put(`/manager/bookings/${bookingId}/assign-driver?driverId=${driverId}`),
  getAvailableDrivers: () => api.get('/manager/drivers/available'),
};

export const driverService = {
  // Get assigned bookings
  getAssignedBookings: (username) =>
    api.get(`/driver/bookings?username=${username}`),

  // Start trip
  startTrip: (bookingId) => {
    const username = localStorage.getItem('username');
    return api.put(`/driver/bookings/${bookingId}/start-trip?username=${username}`);
  },

  // Complete trip
  completeTrip: (bookingId) => {
    const username = localStorage.getItem('username');
    return api.put(`/driver/bookings/${bookingId}/complete-trip?username=${username}`);
  },

  // Get driver profile
  getProfile: () => {
    const username = localStorage.getItem('username');
    return api.get(`/driver/profile?username=${username}`);
  },

  // Update driver profile
  updateProfile: (profileData) => {
    const username = localStorage.getItem('username');
    return api.put(`/driver/profile?username=${username}`, profileData);
  },

  // Get driver earnings
  getEarnings: () => {
    const username = localStorage.getItem('username');
    return api.get(`/driver/earnings?username=${username}`);
  },

  // Update driver location (for live tracking)
  updateLocation: (latitude, longitude) => {
    const username = localStorage.getItem('username');
    return api.put(`/driver/location?username=${username}`, { latitude, longitude });
  },
};
export const supportService = {
  getAllTickets: () => api.get('/admin/support/tickets'),
  getCustomerTickets: (username) => api.get(`/customer/support/tickets?username=${username}`),
  getTicketById: (id) => api.get(`/support/tickets/${id}`),
  createTicket: (username, ticket) => api.post(`/customer/support/tickets?username=${username}`, ticket),
  updateTicket: (id, ticket) => api.put(`/support/tickets/${id}`, ticket),
  deleteTicket: (id) => api.delete(`/support/tickets/${id}`),
};

export const maintenanceService = {
  getAll: () => api.get('/admin/maintenance'),
  getById: (id) => api.get(`/maintenance/${id}`),
  getByVehicle: (vehicleId) => api.get(`/maintenance/vehicle/${vehicleId}`),
  getPredictive: () => api.get('/maintenance/predictive'),
  // create: (maintenance) => api.post('/admin/maintenance', maintenance),
  update: (id, maintenance) => api.put(`/admin/maintenance/${id}`, maintenance),
};

export const userService = {
  getAll: () => api.get('/admin/users'),
  getByRole: (role) => api.get(`/admin/users/role/${role}`),
  getById: (id) => api.get(`/admin/users/${id}`),
  toggleActive: (id) => api.put(`/admin/users/${id}/toggle-active`),
};

export const analyticsService = {
  getKPIMetrics: () => api.get('/analytics/kpi'),
  getFleetDistribution: () => api.get('/analytics/fleet-distribution'),
  getHourlyActivity: () => api.get('/analytics/hourly-activity'),
  getDailyTrends: (days) => api.get(`/analytics/daily-trends?days=${days || 7}`),
  getVehiclePerformance: () => api.get('/analytics/vehicle-performance'),

  // ✅ FIX: Add responseType for blob downloads
  downloadFleetReport: () => api.get('/analytics/reports/fleet/csv', {
    responseType: 'blob'
  }),
  downloadBookingsReport: () => api.get('/analytics/reports/bookings/csv', {
    responseType: 'blob'
  }),
  downloadRevenueReport: () => api.get('/analytics/reports/revenue/csv', {
    responseType: 'blob'
  }),
  downloadTripsReport: () => api.get('/analytics/reports/trips/csv', {
    responseType: 'blob'
  }),
  downloadSummaryReport: () => api.get('/analytics/reports/summary/csv', {
    responseType: 'blob'
  }),
};

export default api;
