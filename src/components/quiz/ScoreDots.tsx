interface ScoreDotsProps {
  questionId: number;
  selectedScore?: number;
  onScoreSelect: (score: number) => void;
  className?: string;
}

export const ScoreDots = ({ questionId, selectedScore, onScoreSelect, className = "" }: ScoreDotsProps) => {
  const scores = [1, 2, 3, 4, 5];
  const labels = {
    1: "Strongly Disagree",
    2: "Disagree", 
    3: "Neutral",
    4: "Agree",
    5: "Strongly Agree"
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Labels */}
      <div className="flex justify-between w-full max-w-md text-sm text-muted-foreground">
        <span>Strongly Disagree</span>
        <span>Strongly Agree</span>
      </div>
      
      {/* Dots */}
      <div className="flex items-center space-x-6">
        {scores.map((score) => (
          <button
            key={score}
            onClick={() => onScoreSelect(score)}
            aria-label={`Score ${score} for question ${questionId}: ${labels[score as keyof typeof labels]}`}
            className={`
              w-6 h-6 rounded-full border-2 transition-all duration-200 
              hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              ${selectedScore === score 
                ? 'bg-success border-success shadow-md' 
                : 'bg-muted border-border hover:border-success/50'
              }
            `}
          >
            <span className="sr-only">{labels[score as keyof typeof labels]}</span>
          </button>
        ))}
      </div>
      
      {/* Score numbers */}
      <div className="flex items-center space-x-6">
        {scores.map((score) => (
          <span 
            key={score} 
            className={`text-sm font-medium transition-colors ${
              selectedScore === score ? 'text-success' : 'text-muted-foreground'
            }`}
          >
            {score}
          </span>
        ))}
      </div>
    </div>
  );
};