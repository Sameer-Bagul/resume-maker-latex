import { RESUME_STEPS } from '../hooks/useResumeSteps';

interface StepNavigatorProps {
  currentStep: number;
  onStepChange: (stepId: number) => void;
}

export function StepNavigator({ currentStep, onStepChange }: StepNavigatorProps) {
  return (
    <div className="border-b border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto py-4">
          {RESUME_STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <button
                key={step.id}
                onClick={() => onStepChange(step.id)}
                data-testid={`button-step-${step.id}`}
                className={`flex flex-shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all hover-elevate active-elevate-2 ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : isCompleted
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-card text-muted-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
