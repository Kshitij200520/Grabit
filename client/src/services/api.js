import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add authentication interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // When user is authenticated, don't send guest ID
      // This ensures authenticated users get their own cart
    } else {
      // Add guest session ID for non-authenticated requests
      let guestId = localStorage.getItem('guestId');
      if (!guestId) {
        guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('guestId', guestId);
      }
      config.headers['X-Guest-ID'] = guestId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Product API
export const productAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  seed: () => api.post('/products/seed'),
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
