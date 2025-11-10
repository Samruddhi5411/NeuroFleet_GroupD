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

export const authService = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  signup: (userData) =>
    api.post('/auth/signup', userData),
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
  create: (maintenance) => api.post('/admin/maintenance', maintenance),
  update: (id, maintenance) => api.put(`/admin/maintenance/${id}`, maintenance),
};

export const userService = {
  getAll: () => api.get('/admin/users'),
  getByRole: (role) => api.get(`/admin/users/role/${role}`),
  getById: (id) => api.get(`/admin/users/${id}`),
  toggleActive: (id) => api.put(`/admin/users/${id}/toggle-active`),
};

export default api;