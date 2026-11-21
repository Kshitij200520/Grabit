import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

const PRODUCT_CACHE_TTL = 30_000;
let cachedProducts = null;
let cachedProductsAt = 0;

const invalidateProductsCache = () => {
  cachedProducts = null;
  cachedProductsAt = 0;
};

// Add authentication interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
      guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('guestId', guestId);
    }

    config.headers['X-Guest-ID'] = guestId;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Product API
export const productAPI = {
  getAll: async (params = {}) => {
    const unfiltered = Object.keys(params).length === 0;
    if (unfiltered && Array.isArray(cachedProducts) && Date.now() - cachedProductsAt < PRODUCT_CACHE_TTL) {
      return { data: cachedProducts };
    }

    const response = await api.get('/products', { params });
    if (unfiltered && Array.isArray(response.data)) {
      cachedProducts = response.data;
      cachedProductsAt = Date.now();
    }
    return response;
  },
  getById: (id) => api.get(`/products/${id}`),
  create: async (data) => {
    const response = await api.post('/products', data);
    invalidateProductsCache();
    return response;
  },
  update: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    invalidateProductsCache();
    return response;
  },
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    invalidateProductsCache();
    return response;
  },
  seed: async () => {
    const response = await api.post('/products/seed');
    invalidateProductsCache();
    return response;
  },
};

// Cart API - Updated to match backend
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/add', data),
  updateQuantity: (productId, data) => api.put(`/cart/update/${productId}`, data),
  removeItem: (productId) => api.delete(`/cart/remove/${productId}`),
  clearCart: () => api.delete('/cart/clear'),
};

// Order API
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getById: (id) => api.get(`/orders/${id}`),
  getUserOrders: (userId) => api.get(`/orders/user/${userId}`),
  getAll: () => api.get('/orders'),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  markAsPaid: (id) => api.put(`/orders/${id}/pay`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

// User API
export const userAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getProfile: (id) => api.get(`/users/profile/${id}`),
  updateProfile: (id, data) => api.put(`/users/profile/${id}`, data),
  getAll: () => api.get('/users'),
};

// Payment API
export const paymentAPI = {
  createOrder: (data) => api.post('/payments/order', data),
  verifyPayment: (data) => api.post('/payments/verify', data),
  handleFailure: (data) => api.post('/payments/failure', data),
};

export default api;
