import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { API } from '../api.js';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  useEffect(() => {
    const expireSession = () => setUser(null);
    window.addEventListener('careercoach:session-expired', expireSession);
    return () => window.removeEventListener('careercoach:session-expired', expireSession);
  }, []);
  async function authenticate(path, payload) {
    const response = await fetch(`${API}/auth/${path}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Authentication failed');
    localStorage.setItem('accessToken', data.accessToken);
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }
  async function logout() {
    const accessToken = localStorage.getItem('accessToken');
    try {
      if (accessToken) await fetch(`${API}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
      });
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  }
  const value = useMemo(() => ({ user, login: p => authenticate('login', p), register: p => authenticate('register', p), logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
