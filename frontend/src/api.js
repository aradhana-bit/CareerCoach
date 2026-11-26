const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
function clearSession() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}
async function parseResponse(response) {
  return response.json().catch(() => ({}));
}
export async function request(path, options = {}) {
  const send = token => fetch(`${API}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers }
  });
  let accessToken = localStorage.getItem('accessToken');
  let response = await send(accessToken);
  let data = await parseResponse(response);
  if (response.status === 401 && localStorage.getItem('refreshToken')) {
    const refreshResponse = await fetch(`${API}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') })
    });
    const refreshed = await parseResponse(refreshResponse);
    if (refreshResponse.ok && refreshed.accessToken) {
      accessToken = refreshed.accessToken;
      localStorage.setItem('accessToken', refreshed.accessToken);
      if (refreshed.refreshToken) localStorage.setItem('refreshToken', refreshed.refreshToken);
      response = await send(accessToken);
      data = await parseResponse(response);
    } else {
      clearSession();
      window.dispatchEvent(new Event('careercoach:session-expired'));
      throw new Error(refreshed.message || 'Your session has expired. Please log in again.');
    }
  }
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}
export { API };
