import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CareerCard } from '@/components/recommendations/CareerCard';
import { LoadingSpinner } from '@/components/quiz/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { CareerRecommendation } from '@/types/recommendations';
import { recommendationsApi } from '@/services/recommendationsApi';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowLeft } from 'lucide-react';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // In a real app, this would call your actual API:
      // const response = await axios.get('/api/recommendations');
      // setRecommendations(response.data.recommendations);
      
      const data = await recommendationsApi.getRecommendations();
      setRecommendations(data);
      
    } catch (err) {
      console.error('Failed to load recommendations:', err);
      setError('Failed to load recommendations. Please try again.');
      toast({
        title: "Error Loading Recommendations",
        description: "Failed to load your career recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleRetakeQuiz = () => {
    // Clear any existing quiz data
    localStorage.removeItem('skillx-quiz-answers');
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-2xl font-bold text-primary mb-6">
              Your Career Recommendations
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Based on your personality quiz results, here are the careers that best match your interests and strengths.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-muted-foreground">Generating your personalized recommendations...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-center">
                <p className="text-destructive mb-6" role="alert">
                  {error}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={fetchRecommendations} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button onClick={handleRetakeQuiz} variant="default">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retake Quiz
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations Grid */}
          {!isLoading && !error && recommendations.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {recommendations.map((recommendation, index) => (
                  <CareerCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    rank={index + 1}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <Button onClick={handleRetakeQuiz} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retake Quiz
                </Button>
                <Button onClick={fetchRecommendations} variant="secondary">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Recommendations
                </Button>
              </div>
            </>
          )}

          {/* No Recommendations */}
          {!isLoading && !error && recommendations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-center">
                <p className="text-muted-foreground mb-6">
                  No recommendations found. Please retake the quiz to get your personalized career suggestions.
                </p>
                <Button onClick={handleRetakeQuiz} variant="default">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Take Quiz
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Recommendations;