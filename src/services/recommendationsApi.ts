import { CareerRecommendation } from '@/types/recommendations';

// Mock API service - replace with real API calls when backend is ready
export const recommendationsApi = {
  async getRecommendations(): Promise<CareerRecommendation[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock recommendations - in real app this would come from your backend
    return [
      {
        id: '1',
        name: 'Data Scientist',
        description: 'Analyze complex data to uncover insights and drive business decisions using statistical methods and machine learning.',
        matchPercentage: 95,
        roadmap: [
          'Learn Python programming fundamentals',
          'Master statistics and probability',
          'Study machine learning algorithms',
          'Practice with real datasets on Kaggle',
          'Build a portfolio of data science projects',
          'Earn relevant certifications (e.g., Google Data Analytics)',
          'Apply for entry-level data analyst positions'
        ],
        skills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization'],
        averageSalary: '$95,000 - $150,000',
        jobGrowth: '35% (Much faster than average)'
      },
      {
        id: '2',
        name: 'UX Designer',
        description: 'Create intuitive and engaging user experiences for digital products through research, design, and testing.',
        matchPercentage: 88,
        roadmap: [
          'Learn design thinking principles',
          'Master design tools (Figma, Sketch, Adobe XD)',
          'Study user research methodologies',
          'Practice wireframing and prototyping',
          'Build a strong design portfolio',
          'Take online UX courses or bootcamps',
          'Seek internships or junior UX roles'
        ],
        skills: ['Design Thinking', 'Prototyping', 'User Research', 'Figma', 'Usability Testing'],
        averageSalary: '$75,000 - $120,000',
        jobGrowth: '13% (Faster than average)'
      },
      {
        id: '3',
        name: 'Product Manager',
        description: 'Guide product development from concept to launch, working with cross-functional teams to deliver user-focused solutions.',
        matchPercentage: 82,
        roadmap: [
          'Understand product management fundamentals',
          'Learn agile development methodologies',
          'Develop analytical and technical skills',
          'Practice project management tools',
          'Build communication and leadership skills',
          'Gain experience through side projects or internships',
          'Network with product management professionals'
        ],
        skills: ['Product Strategy', 'Agile', 'Data Analysis', 'Leadership', 'Market Research'],
        averageSalary: '$85,000 - $140,000',
        jobGrowth: '19% (Much faster than average)'
      }
    ];
  }
};