const API_URL = 'https://teamtrack-backend-gxzh.onrender.com';
const BASE = `${API_URL}/api`;

const headers = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export async function apiCall(path, method = 'GET', body = null, token = null) {
  const res = await fetch(BASE + path, {
    method,
    headers: headers(token),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed (${res.status})`);
  }
  return res.json().catch(() => ({}));
}

export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';

export const STATUS_COLORS = {
  TODO: '#60a5fa',
  IN_PROGRESS: '#fbbf24',
  COMPLETED: '#34d399',
};

// Project API calls
export const projectApi = {
  list: (token) => apiCall('/projects', 'GET', null, token),
  get: (id, token) => apiCall(`/projects/${id}`, 'GET', null, token),
  create: (data, token) => apiCall('/projects', 'POST', data, token),
  update: (id, data, token) => apiCall(`/projects/${id}`, 'PUT', data, token),
  delete: (id, token) => apiCall(`/projects/${id}`, 'DELETE', null, token),
  addMember: (id, data, token) => apiCall(`/projects/${id}/members`, 'POST', data, token),
};

// Task API calls
export const taskApi = {
  create: (projectId, data, token) => apiCall(`/tasks/projects/${projectId}`, 'POST', data, token),
  list: (projectId, token) => apiCall(`/tasks/projects/${projectId}`, 'GET', null, token),
  get: (id, token) => apiCall(`/tasks/${id}`, 'GET', null, token),
  update: (id, data, token) => apiCall(`/tasks/${id}`, 'PUT', data, token),
  delete: (id, token) => apiCall(`/tasks/${id}`, 'DELETE', null, token),
  myTasks: (token) => apiCall('/tasks/assigned-to-me', 'GET', null, token),
  stats: (projectId, token) => apiCall(`/tasks/projects/${projectId}/stats`, 'GET', null, token),
};
