import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';

interface QuizNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canProceed: boolean;
  isLoading: boolean;
}

export const QuizNavigation = ({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  canProceed,
  isLoading
}: QuizNavigationProps) => {
  const isFirstQuestion = currentQuestion === 1;
  const isLastQuestion = currentQuestion === totalQuestions;

  return (
    <div className="flex justify-between items-center w-full max-w-md mx-auto">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstQuestion || isLoading}
        className={`${isFirstQuestion ? 'invisible' : 'visible'}`}
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Previous
      </Button>

      {isLastQuestion ? (
        <Button
          variant="success"
          onClick={onSubmit}
          disabled={!canProceed || isLoading}
          className="min-w-[100px]"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      ) : (
        <Button
          variant="success"
          onClick={onNext}
          disabled={!canProceed || isLoading}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
};