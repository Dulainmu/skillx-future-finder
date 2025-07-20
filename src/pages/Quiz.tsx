import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizApi } from '@/services/quizApi';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { ScoreDots } from '@/components/quiz/ScoreDots';
import { LoadingSpinner } from '@/components/quiz/LoadingSpinner';

const Quiz = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await quizApi.getQuestions();
        setQuestions(res.data.questions || []);
      } catch (err: any) {
        setError('Failed to load quiz questions.');
        toast({
          title: 'Error',
          description: err.message || 'Failed to load quiz questions.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [toast]);

  const handleScore = (score: number) => {
    setAnswers({ ...answers, [questions[current].id]: score });
  };

  const canProceed = answers[questions[current]?.id] !== undefined;

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
  };
  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    if (!canProceed) {
      setError('Please select a score before submitting.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, score]) => {
        const q = questions.find(q => q.id === Number(questionId));
        return {
          questionId: Number(questionId),
          score,
          category: q?.category || '',
        };
      });
      await quizApi.submitAnswers(formattedAnswers);
      toast({
        title: 'Quiz Submitted Successfully!',
        description: 'Generating your personalized career recommendations...',
      });
      navigate('/recommendations');
    } catch (err: any) {
      setError('Failed to submit quiz.');
      toast({
        title: 'Submission Failed',
        description: err.message || 'Failed to submit quiz. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;
  if (!questions.length) return <div className="text-center mt-8">No quiz questions found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <ProgressBar current={current + 1} total={questions.length} />
      <div className="mt-8 mb-4">
        <h2 className="text-xl font-bold mb-2">{questions[current].question}</h2>
        <ScoreDots
          questionId={questions[current].id}
          selectedScore={answers[questions[current].id]}
          onScoreSelect={handleScore}
        />
      </div>
      <div className="flex justify-between mt-8">
        <Button onClick={handlePrev} disabled={current === 0 || submitting} variant="outline">Previous</Button>
        {current < questions.length - 1 ? (
          <Button onClick={handleNext} disabled={!canProceed || submitting}>Next</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!canProceed || submitting}>
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Quiz;