import { CareerRecommendation } from '@/types/recommendations';
import { careersService } from './supabaseServices';

export const recommendationsApi = {
  async getRecommendations(): Promise<CareerRecommendation[]> {
    return careersService.getCareers();
  },

  async getCareers(): Promise<CareerRecommendation[]> {
    return careersService.getCareers();
  },

  async getCareerById(id: string): Promise<CareerRecommendation | null> {
    return careersService.getCareerById(id);
  },
};