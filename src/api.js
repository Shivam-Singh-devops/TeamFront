const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
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
