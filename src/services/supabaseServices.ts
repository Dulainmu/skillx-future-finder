import { supabase } from '@/integrations/supabase/client';
import { CareerRecommendation } from '@/types/recommendations';

export const careersService = {
  async getCareers(): Promise<CareerRecommendation[]> {
    const { data, error } = await supabase
      .from('careers')
      .select('*')
      .order('created_at');
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data.map(career => ({
      id: career.id,
      name: career.title,
      description: career.description,
      matchPercentage: 85, // Default value for now
      roadmap: ['Foundation', 'Intermediate', 'Advanced', 'Expert'],
      skills: career.skills,
      difficulty: career.difficulty as 'Beginner-Friendly' | 'Intermediate' | 'Advanced'
    }));
  },

  async getCareerById(id: string): Promise<CareerRecommendation | null> {
    const { data, error } = await supabase
      .from('careers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching career:', error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.title,
      description: data.description,
      matchPercentage: 85,
      roadmap: ['Foundation', 'Intermediate', 'Advanced', 'Expert'],
      skills: data.skills,
      difficulty: data.difficulty as 'Beginner-Friendly' | 'Intermediate' | 'Advanced'
    };
  },

  async startCareer(careerId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Create or update user progress
    const { error: progressError } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        career_id: careerId,
        completed_steps: 0,
        total_steps: 10 // Default value
      });

    if (progressError) {
      throw new Error(progressError.message);
    }

    // Update user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        has_started_career: true,
        current_career: careerId
      })
      .eq('user_id', user.id);

    if (profileError) {
      throw new Error(profileError.message);
    }

    return { success: true };
  },

  async getUserProgress() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_progress')
      .select('*, careers(*)')
      .eq('user_id', user.id);

    if (error) {
      throw new Error(error.message);
    }

    return { data: { progress: data } };
  },

  async updateProgress(progressData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('user_progress')
      .update(progressData)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  }
};

export const quizService = {
  async submitQuizResults(answers: any[], score: number, recommendations: string[]) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('quiz_results')
      .insert({
        user_id: user.id,
        answers,
        score,
        recommendations
      });

    if (error) {
      throw new Error(error.message);
    }

    // Update profile to mark quiz as completed
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ quiz_completed: true })
      .eq('user_id', user.id);

    if (profileError) {
      throw new Error(profileError.message);
    }

    return { success: true };
  },

  async getQuizResults() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    return { data: data[0] || null };
  }
};