import { quizService } from './supabaseServices';
import { quizQuestions } from '@/data/quizQuestions';

export const quizApi = {
  async getQuestions() {
    return { data: { questions: quizQuestions } };
  },

  async submitAnswers(answers: { questionId: number; score: number; category: string }[]) {
    // Calculate total score and determine recommendations
    const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
    const categoryScores = answers.reduce((acc, answer) => {
      acc[answer.category] = (acc[answer.category] || 0) + answer.score;
      return acc;
    }, {} as Record<string, number>);
    
    // Get top 3 categories as recommendations
    const recommendations = Object.entries(categoryScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);
    
    await quizService.submitQuizResults(answers, totalScore, recommendations);
    return { success: true, data: { totalScore, recommendations } };
  },

  async getProgress() {
    const result = await quizService.getQuizResults();
    return { data: result };
  },

  async clearQuiz() {
    // For now, just return success - could implement clearing logic if needed
    return { success: true };
  },
};