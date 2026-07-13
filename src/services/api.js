import axios from "axios";

const BASE = "http://localhost:5000/api";

const api = axios.create({ baseURL: BASE });

// Attach admin token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout admin on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname.startsWith("/admin")) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_info");
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

// ── User APIs ──────────────────────────────────────────
export const userAPI = {
  sync: (name, username) => api.post("/users/sync", { name, username }),
  getAll: (page = 1, limit = 10) => api.get("/users", { params: { page, limit } }),
  getById: (id) => api.get(`/users/${id}`),
  delete: (id) => api.delete(`/users/${id}`),
};

// ── Product APIs ───────────────────────────────────────
export const productAPI = {
  getAll: (search = "", category = "", minPrice = "", maxPrice = "", sort = "", page = 1, limit = 8, featured = false) =>
    api.get("/products", { params: { search, category, minPrice, maxPrice, sort, page, limit, featured: featured ? "true" : "" } }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// ── Cart APIs ──────────────────────────────────────────
export const cartAPI = {
  sync: (username, name, items) => api.post("/cart/sync", { username, name, items }),
  getByUsername: (username) => api.get(`/cart/user/${username}`),
  getAll: (page = 1, limit = 10) => api.get("/cart", { params: { page, limit } }),
  delete: (username) => api.delete(`/cart/user/${username}`),
};

// ── Order APIs ─────────────────────────────────────────
export const orderAPI = {
  create: (orderData) => api.post("/orders", orderData),
  getAll: (page = 1, limit = 10, status = "") =>
    api.get("/orders", { params: { page, limit, status } }),
  getByUsername: (username, page = 1, limit = 10) =>
    api.get(`/orders/user/${username}`, { params: { page, limit } }),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  delete: (id) => api.delete(`/orders/${id}`),
};

// ── Admin APIs ─────────────────────────────────────────
export const adminAPI = {
  login: (email, password) => api.post("/admin/login", { email, password }),
  dashboard: () => api.get("/admin/dashboard"),
};

// ── Category APIs ──────────────────────────────────────
export const categoryAPI = {
  getAll: () => api.get("/categories"),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export default api;