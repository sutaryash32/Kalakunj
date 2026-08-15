// Talks to the real NestJS backend — no more local simulation.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const error = new Error(body.message || `Request failed (${res.status})`);
    error.status = res.status;
    throw error;
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  // GET /catalogue — public
  getProducts: () => request('/catalogue'),

  // POST /auth/login — public -> { token, user }
  login: (username, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),

  // GET /auth/me — validates current JWT -> { userId, username, role }
  validateToken: (token) =>
    request('/auth/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }),

  // POST /upload — admin only, multipart -> { url }
  uploadImage: (token, file) => {
    const form = new FormData();
    form.append('file', file);
    return request('/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
  },

  // POST /catalogue — admin only
  addProduct: (token, product) =>
    request('/catalogue', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(product),
    }),

  // DELETE /catalogue/:id — admin only
  deleteProduct: (token, id) =>
    request(`/catalogue/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }),

  // PATCH /catalogue/reorder — admin only
  reorderProducts: (token, orderedIds) =>
    request('/catalogue/reorder', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ orderedIds }),
    }),

  // POST /catalogue/inquiries — public
  sendInquiry: (items) => request('/catalogue/inquiries', { method: 'POST', body: JSON.stringify({ items }) }),

  // GET /catalogue/unread-count — admin only
  getUnreadCount: (token) =>
    request('/catalogue/unread-count', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }),
};
