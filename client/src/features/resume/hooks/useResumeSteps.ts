import { useState } from 'react';
import { User, Code, GraduationCap, Layout, Briefcase, Trophy, Image, FileText } from 'lucide-react';
import { PersonalDetailsForm } from '@/components/resume/personal-details-form';
import { SkillsForm } from '@/components/resume/skills-form';
import { EducationForm } from '@/components/resume/education-form';
import { ProjectsForm } from '@/components/resume/projects-form';
import { ExperienceForm } from '@/components/resume/experience-form';
import { AchievementsForm } from '@/components/resume/achievements-form';
import { PhotoSocialForm } from '@/components/resume/photo-social-form';
import { TemplateSelector } from '@/components/resume/template-selector';

export const RESUME_STEPS = [
  { id: 1, title: 'Personal', icon: User, component: PersonalDetailsForm },
  { id: 2, title: 'Skills', icon: Code, component: SkillsForm },
  { id: 3, title: 'Education', icon: GraduationCap, component: EducationForm },
  { id: 4, title: 'Projects', icon: Layout, component: ProjectsForm },
  { id: 5, title: 'Experience', icon: Briefcase, component: ExperienceForm },
  { id: 6, title: 'Achievements', icon: Trophy, component: AchievementsForm },
  { id: 7, title: 'Photo & Social', icon: Image, component: PhotoSocialForm },
  { id: 8, title: 'Template', icon: FileText, component: TemplateSelector },
];

export function useResumeSteps() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < RESUME_STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (stepId: number) => {
    if (stepId >= 1 && stepId <= RESUME_STEPS.length) {
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const progress = (currentStep / RESUME_STEPS.length) * 100;
  const currentStepData = RESUME_STEPS[currentStep - 1];

  return {
    currentStep,
    currentStepData,
    progress,
    handleNext,
    handlePrevious,
    goToStep,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === RESUME_STEPS.length,
    totalSteps: RESUME_STEPS.length,
  };
}
