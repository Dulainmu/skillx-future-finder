const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const quizApi = {
  async getQuestions() {
    const res = await fetch(`${API_BASE_URL}/quiz/questions`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch quiz questions');
    return res.json();
  },

  async submitAnswers(answers: { questionId: number; score: number; category: string }[]) {
    const res = await fetch(`${API_BASE_URL}/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ answers }),
    });
    if (!res.ok) throw new Error('Failed to submit quiz');
    return res.json();
  },

  async getProgress() {
    const res = await fetch(`${API_BASE_URL}/quiz/progress`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch quiz progress');
    return res.json();
  },

  async clearQuiz() {
    const res = await fetch(`${API_BASE_URL}/quiz/clear`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to clear quiz data');
    return res.json();
  },
}; 