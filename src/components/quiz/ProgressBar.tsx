interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export const ProgressBar = ({ current, total, className = "" }: ProgressBarProps) => {
  const percentage = (current / total) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground">
          Question {current} of {total}
        </span>
        <span className="text-sm text-muted-foreground">
          {Math.round(percentage)}% Complete
        </span>
      </div>
      <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-success transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`Progress: ${current} of ${total} questions completed`}
        />
      </div>
    </div>
  );
};