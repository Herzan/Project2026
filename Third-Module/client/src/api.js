const TOKEN_KEY = 'tm_token';

export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY)
};

// Called when the server says our token is no longer valid
let onUnauthorized = () => {};
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

async function request(url, { method = 'GET', body } = {}) {
  const headers = {};
  const token = auth.getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    let message = 'Request failed';
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {
      // ignore parse errors
    }
    // 401 on a protected call (not the login form itself) = session ended
    if (res.status === 401 && token) onUnauthorized();
    throw new Error(message);
  }
  return res.json();
}

/* ---------- Auth ---------- */
export function login({ username, password }) {
  return request('/api/auth/login', { method: 'POST', body: { username, password } });
}

export function register({ username, name, password }) {
  return request('/api/auth/register', { method: 'POST', body: { username, name, password } });
}

export function getMe() {
  return request('/api/auth/me');
}

export function getUsers() {
  return request('/api/auth/users');
}

/* ---------- Tasks ---------- */
export function getTasks({ search, assignee, status } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (assignee) params.set('assignee', assignee);
  if (status && status !== 'all') params.set('status', status);
  const qs = params.toString();
  return request(`/api/tasks${qs ? `?${qs}` : ''}`);
}

export function createTask({ title, assignee }) {
  return request('/api/tasks', { method: 'POST', body: { title, assignee } });
}

export function updateTask(id, { title, assignee }) {
  return request(`/api/tasks/${id}`, { method: 'PUT', body: { title, assignee } });
}

export function toggleTask(id) {
  return request(`/api/tasks/${id}/toggle`, { method: 'PUT' });
}

export function deleteTask(id) {
  return request(`/api/tasks/${id}`, { method: 'DELETE' });
}
