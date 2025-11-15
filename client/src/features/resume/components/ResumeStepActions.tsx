import { Button } from '@/components/ui/button';
import type { Resume } from '@shared/schema';

interface ResumeStepActionsProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  isSaving: boolean;
  resume?: Resume;
  onPrevious: () => void;
  onNext: () => void;
  onSave: (data: Partial<Resume>) => void;
}

export function ResumeStepActions({
  isFirstStep,
  isLastStep,
  isSaving,
  resume,
  onPrevious,
  onNext,
  onSave,
}: ResumeStepActionsProps) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
        data-testid="button-previous"
        className="hover-elevate active-elevate-2"
      >
        Previous
      </Button>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => onSave(resume || {})}
          disabled={isSaving}
          data-testid="button-save-draft"
          className="hover-elevate active-elevate-2"
        >
          {isSaving ? 'Saving...' : 'Save Draft'}
        </Button>
        {!isLastStep ? (
          <Button
            onClick={onNext}
            data-testid="button-next"
            className="hover-elevate active-elevate-2"
          >
            Next Step
          </Button>
        ) : (
          <Button
            onClick={() => (window.location.href = '/preview')}
            data-testid="button-preview-download"
            className="hover-elevate active-elevate-2"
          >
            Preview & Download
          </Button>
        )}
      </div>
    </div>
  );
}
