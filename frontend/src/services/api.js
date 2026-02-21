/**
 * Central API helper — all API calls go through here
 */

const BASE_URL = process.env.REACT_APP_API_URL || '/api';

const getToken = () => localStorage.getItem('luxe_token');

const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };
  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

export const api = {
 // AUTH
register:      (body) => apiCall('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
login:         (body) => apiCall('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
getMe:         ()     => apiCall('/auth/me'),
updateProfile: (body) => apiCall('/auth/update-profile', { method: 'PUT', body: JSON.stringify(body) }),

// PRODUCTS
getProducts:   (params = '') => apiCall(`/products${params}`),
getProduct:    (id)          => apiCall(`/products/${id}`),
createProduct: (body)        => apiCall('/products',       { method: 'POST',   body: JSON.stringify(body) }),
updateProduct: (id, body)    => apiCall(`/products/${id}`, { method: 'PUT',    body: JSON.stringify(body) }),
deleteProduct: (id)          => apiCall(`/products/${id}`, { method: 'DELETE' }),

// ORDERS
createOrder:       (body)       => apiCall('/orders',          { method: 'POST', body: JSON.stringify(body) }),
getMyOrders:       ()           => apiCall('/orders/my'),       // myorders → my
getAllOrders:       ()           => apiCall('/orders'),
updateOrderStatus: (id, status) => apiCall(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

// ADMIN
getDashboardStats: () => apiCall('/admin/dashboard'),   // stats → dashboard
getAllCustomers:    () => apiCall('/admin/users'),        // customers → users
};
