import { Progress } from '@/components/ui/progress';

interface DashboardProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  progress: number;
}

export function DashboardProgressBar({
  currentStep,
  totalSteps,
  stepTitle,
  progress,
}: DashboardProgressBarProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold">
            Step {currentStep} of {totalSteps}: {stepTitle}
          </h2>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" data-testid="progress-resume" />
      </div>
    </div>
  );
}
