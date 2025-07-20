const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const careersApi = {
  async startCareer(careerId: string) {
    const res = await fetch(`${API_BASE_URL}/careers/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ careerId }),
    });
    if (!res.ok) throw new Error('Failed to start career');
    return res.json();
  },

  async getUserProgress() {
    const res = await fetch(`${API_BASE_URL}/careers/progress`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch progress');
    return res.json();
  },

  async updateProgress(data: any) {
    const res = await fetch(`${API_BASE_URL}/careers/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update progress');
    return res.json();
  },
};