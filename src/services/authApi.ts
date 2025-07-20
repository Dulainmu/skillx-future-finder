const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authApi = {
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  async register(name: string, email: string, password: string, role: string = 'student') {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password, role }),
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  },

  async getCurrentUser() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  async logout() {
    const res = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Logout failed');
    return res.json();
  },
}; 