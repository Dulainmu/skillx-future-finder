export interface CareerRecommendation {
  id: string;
  name: string;
  description: string;
  matchPercentage: number;
  roadmap: string[];
  skills: string[];
  averageSalary?: string;
  jobGrowth?: string;
}

export interface RecommendationsResponse {
  recommendations: CareerRecommendation[];
  userId?: string;
  timestamp: string;
}