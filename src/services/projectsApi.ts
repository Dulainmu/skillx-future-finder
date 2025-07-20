const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const projectsApi = {
  async submitProject(formData: FormData) {
    const res = await fetch(`${API_BASE_URL}/projects/submit`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to submit project');
    return res.json();
  },

  async getUserProjects() {
    const res = await fetch(`${API_BASE_URL}/projects/user`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async getMentorProjects() {
    const res = await fetch(`${API_BASE_URL}/projects/mentor`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch mentor projects');
    return res.json();
  },

  async reviewProject(projectId: string, score: number, feedback: string) {
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ score, feedback }),
    });
    if (!res.ok) throw new Error('Failed to review project');
    return res.json();
  },
};