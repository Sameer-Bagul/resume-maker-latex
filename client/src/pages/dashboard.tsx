import { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Resume } from '@shared/schema';
import { useGuardedRoute } from '@/features/auth/hooks/useGuardedRoute';
import { useResumeSteps } from '@/features/resume/hooks/useResumeSteps';
import {
  DashboardHeader,
  DashboardProgressBar,
  StepNavigator,
  ResumeStepActions,
} from '@/features/resume/components';
import type { FormHandle } from '@/components/resume/personal-details-form';

export default function Dashboard() {
  const { user, isLoading: authLoading } = useGuardedRoute();
  const { toast } = useToast();
  const formRef = useRef<FormHandle>(null);
  
  const {
    currentStep,
    currentStepData,
    progress,
    handleNext: originalHandleNext,
    handlePrevious: originalHandlePrevious,
    goToStep,
    isFirstStep,
    isLastStep,
    totalSteps,
  } = useResumeSteps();

  const { data: resume, isLoading: resumeLoading } = useQuery<Resume>({
    queryKey: ['/api/resumes/current'],
    enabled: !!user,
  });

  const saveResumeMutation = useMutation({
    mutationFn: async (data: Partial<Resume>) => {
      if (resume?.id) {
        return await apiRequest('PATCH', `/api/resumes/${resume.id}`, data);
      } else {
        return await apiRequest('POST', '/api/resumes', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resumes/current'] });
      toast({
        title: 'Saved',
        description: 'Your resume has been saved successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save resume. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSave = (data: Partial<Resume>) => {
    console.log('Saving resume data:', data);
    console.log('Current resume in state:', resume);
    saveResumeMutation.mutate(data);
  };

  const autoSaveAndNavigate = async (navigateFn: () => void) => {
    if (formRef.current?.getCurrentData) {
      try {
        const currentData = formRef.current.getCurrentData();
        if (currentData && Object.keys(currentData).length > 0) {
          handleSave(currentData);
        }
      } catch (error) {
        console.log('Auto-save skipped for this form:', error);
      }
    }
    navigateFn();
  };

  const handleNext = () => {
    autoSaveAndNavigate(originalHandleNext);
  };

  const handlePrevious = () => {
    autoSaveAndNavigate(originalHandlePrevious);
  };

  if (authLoading || resumeLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = currentStepData.component;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <DashboardProgressBar
        currentStep={currentStep}
        totalSteps={totalSteps}
        stepTitle={currentStepData.title}
        progress={progress}
      />

      <StepNavigator currentStep={currentStep} onStepChange={goToStep} />

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-4xl p-6 sm:p-8">
          <CurrentStepComponent
            ref={formRef}
            resume={resume || {}}
            onSave={handleSave}
            isSaving={saveResumeMutation.isPending}
          />

          <ResumeStepActions
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            isSaving={saveResumeMutation.isPending}
            resume={resume}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSave={handleSave}
          />
        </Card>
      </main>
    </div>
  );
}
