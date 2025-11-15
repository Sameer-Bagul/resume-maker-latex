import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PersonalDetailsForm } from "@/components/resume/personal-details-form";
import { SkillsForm } from "@/components/resume/skills-form";
import { EducationForm } from "@/components/resume/education-form";
import { ProjectsForm } from "@/components/resume/projects-form";
import { ExperienceForm } from "@/components/resume/experience-form";
import { AchievementsForm } from "@/components/resume/achievements-form";
import { PhotoSocialForm } from "@/components/resume/photo-social-form";
import { TemplateSelector } from "@/components/resume/template-selector";
import { FileText, User, Briefcase, GraduationCap, Code, Trophy, Image, Layout } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Resume } from "@shared/schema";

const STEPS = [
  { id: 1, title: "Personal", icon: User, component: PersonalDetailsForm },
  { id: 2, title: "Skills", icon: Code, component: SkillsForm },
  { id: 3, title: "Education", icon: GraduationCap, component: EducationForm },
  { id: 4, title: "Projects", icon: Layout, component: ProjectsForm },
  { id: 5, title: "Experience", icon: Briefcase, component: ExperienceForm },
  { id: 6, title: "Achievements", icon: Trophy, component: AchievementsForm },
  { id: 7, title: "Photo & Social", icon: Image, component: PhotoSocialForm },
  { id: 8, title: "Template", icon: FileText, component: TemplateSelector },
];

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [user, authLoading, toast]);

  // Fetch user's resume
  const { data: resume, isLoading: resumeLoading } = useQuery<Resume>({
    queryKey: ["/api/resumes/current"],
    enabled: !!user,
  });

  // Create or update resume mutation
  const saveResumeMutation = useMutation({
    mutationFn: async (data: Partial<Resume>) => {
      if (resume?.id) {
        return await apiRequest("PATCH", `/api/resumes/${resume.id}`, data);
      } else {
        return await apiRequest("POST", "/api/resumes", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes/current"] });
      toast({
        title: "Saved",
        description: "Your resume has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = (data: Partial<Resume>) => {
    saveResumeMutation.mutate(data);
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;
  const progress = (currentStep / STEPS.length) * 100;

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading text-xl font-bold">ResumeCraft</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Avatar className="h-9 w-9" data-testid="avatar-user">
                <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {user?.firstName?.[0] || user?.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="ghost" 
                size="sm" 
                asChild
                data-testid="button-logout"
                className="hover-elevate active-elevate-2"
              >
                <a href="/api/logout">Log Out</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold">
              Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
            </h2>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-resume" />
        </div>
      </div>

      {/* Step Navigation (Desktop) */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  data-testid={`button-step-${step.id}`}
                  className={`flex flex-shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all hover-elevate active-elevate-2 ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                      ? "bg-accent text-accent-foreground"
                      : "bg-card text-muted-foreground"
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-4xl p-6 sm:p-8">
          <CurrentStepComponent
            resume={resume || {}}
            onSave={handleSave}
            isSaving={saveResumeMutation.isPending}
          />
          
          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              data-testid="button-previous"
              className="hover-elevate active-elevate-2"
            >
              Previous
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleSave(resume || {})}
                disabled={saveResumeMutation.isPending}
                data-testid="button-save-draft"
                className="hover-elevate active-elevate-2"
              >
                {saveResumeMutation.isPending ? "Saving..." : "Save Draft"}
              </Button>
              {currentStep < STEPS.length ? (
                <Button
                  onClick={handleNext}
                  data-testid="button-next"
                  className="hover-elevate active-elevate-2"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={() => window.location.href = "/preview"}
                  data-testid="button-preview-download"
                  className="hover-elevate active-elevate-2"
                >
                  Preview & Download
                </Button>
              )}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
