const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

import { CareerRecommendation } from '@/types/recommendations';

export const recommendationsApi = {
  async getRecommendations(): Promise<CareerRecommendation[]> {
    const res = await fetch(`${API_BASE_URL}/recommendations`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    const data = await res.json();
    return data.data.recommendations;
  },

  async getCareers(): Promise<CareerRecommendation[]> {
    const res = await fetch(`${API_BASE_URL}/recommendations/careers`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch careers');
    const data = await res.json();
    return data.data.careers;
  },

  async getCareerById(id: string): Promise<CareerRecommendation | null> {
    const res = await fetch(`${API_BASE_URL}/recommendations/careers/${id}`, {
      credentials: 'include',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data.career;
  },
};