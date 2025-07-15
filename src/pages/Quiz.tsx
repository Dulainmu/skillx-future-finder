import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScoreDots } from '@/components/quiz/ScoreDots';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { QuizNavigation } from '@/components/quiz/QuizNavigation';
import { LoadingSpinner } from '@/components/quiz/LoadingSpinner';
import { useQuiz } from '@/contexts/QuizContext';
import { quizQuestions } from '@/data/quizQuestions';
import { useToast } from '@/hooks/use-toast';

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { answers, setAnswer, getAnswer, isLoading, setIsLoading } = useQuiz();

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const currentQuestionNumber = currentQuestionIndex + 1;
  const selectedScore = getAnswer(currentQuestion.id);
  const canProceed = selectedScore !== undefined;

  const handleScoreSelect = (score: number) => {
    setAnswer(currentQuestion.id, score);
    setError(''); // Clear any existing error
  };

  const handleNext = () => {
    if (!canProceed) {
      setError('Please select a score before continuing.');
      return;
    }
    
    setError('');
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!canProceed) {
      setError('Please select a score before submitting.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would be an actual API call:
      // const response = await fetch('/api/quiz/submit', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     answers: Object.entries(answers).map(([questionId, score]) => ({
      //       questionId: parseInt(questionId),
      //       score
      //     })),
      //     timestamp: new Date().toISOString()
      //   })
      // });

      toast({
        title: "Quiz Submitted Successfully!",
        description: "Generating your personalized career recommendations...",
      });

      // Navigate to recommendations page
      navigate('/recommendations');
      
    } catch (error) {
      console.error('Quiz submission error:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background py-12 px-4 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-8 rounded-lg shadow-lg flex flex-col items-center space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-foreground font-medium">Submitting your quiz...</p>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <ProgressBar 
            current={currentQuestionNumber} 
            total={quizQuestions.length}
            className="mb-12"
          />

          {/* Question Section */}
          <div className="text-center mb-12">
            <h1 className="text-2xl font-bold text-primary mb-8 max-w-2xl mx-auto leading-relaxed">
              {currentQuestion.question}
            </h1>

            {/* Score Dots */}
            <ScoreDots
              questionId={currentQuestion.id}
              selectedScore={selectedScore}
              onScoreSelect={handleScoreSelect}
              className="mb-8"
            />

            {/* Error Message */}
            {error && (
              <div 
                className="text-destructive text-sm font-medium mb-6"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            {/* Navigation */}
            <QuizNavigation
              currentQuestion={currentQuestionNumber}
              totalQuestions={quizQuestions.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={handleSubmit}
              canProceed={canProceed}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Quiz;