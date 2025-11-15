import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileText, Download, ArrowLeft } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Resume } from "@shared/schema";

export default function Preview() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

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

  // Download PDF mutation
  const downloadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/resumes/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: resume?.id }),
      });
      
      if (!response.ok) throw new Error("Failed to download resume");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume?.fullName || "Resume"}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your resume has been downloaded.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to download resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (authLoading || resumeLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="mx-auto max-w-md p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 font-heading text-2xl font-bold">No Resume Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your resume first before previewing.
          </p>
          <Button
            asChild
            className="mt-6 hover-elevate active-elevate-2"
            data-testid="button-create-resume"
          >
            <a href="/">Create Resume</a>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Button
              variant="ghost"
              asChild
              data-testid="button-back"
              className="hover-elevate active-elevate-2"
            >
              <a href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Editor
              </a>
            </Button>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button
                onClick={() => downloadMutation.mutate()}
                disabled={downloadMutation.isPending}
                data-testid="button-download-pdf"
                className="hover-elevate active-elevate-2"
              >
                <Download className="mr-2 h-4 w-4" />
                {downloadMutation.isPending ? "Downloading..." : "Download PDF"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Preview Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold">Resume Preview</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Template: {resume.templateId || "Modern Professional"}
              </p>
            </div>
          </div>

          {/* Resume Preview Card */}
          <Card className="overflow-hidden bg-white dark:bg-card p-12 shadow-lg">
            {/* Header Section */}
            {resume.includePersonalDetails && (
              <div className="border-b border-border pb-6">
                <h1 className="font-heading text-4xl font-bold text-foreground">
                  {resume.fullName || "Your Name"}
                </h1>
                <p className="mt-2 text-xl text-muted-foreground">
                  {resume.jobTitle || "Your Job Title"}
                </p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {resume.email && <span>{resume.email}</span>}
                  {resume.phone && <span>{resume.phone}</span>}
                  {resume.location && <span>{resume.location}</span>}
                </div>
                {resume.summary && (
                  <p className="mt-4 text-sm leading-relaxed text-foreground">
                    {resume.summary}
                  </p>
                )}
              </div>
            )}

            {/* Skills Section */}
            {resume.includeSkills && resume.skills && resume.skills.length > 0 && (
              <div className="border-b border-border py-6">
                <h2 className="font-heading text-2xl font-bold text-foreground">Skills</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {resume.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="rounded bg-primary/10 px-3 py-1 text-sm font-medium text-foreground"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Section */}
            {resume.includeExperience && resume.experience && resume.experience.length > 0 && (
              <div className="border-b border-border py-6">
                <h2 className="font-heading text-2xl font-bold text-foreground">Experience</h2>
                <div className="mt-4 space-y-4">
                  {resume.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-foreground">{exp.position}</h3>
                        <span className="text-sm text-muted-foreground">
                          {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                      <ul className="mt-2 space-y-1">
                        {exp.responsibilities.map((resp, j) => (
                          <li key={j} className="text-sm text-foreground">• {resp}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {resume.includeEducation && resume.education && resume.education.length > 0 && (
              <div className="border-b border-border py-6">
                <h2 className="font-heading text-2xl font-bold text-foreground">Education</h2>
                <div className="mt-4 space-y-3">
                  {resume.education.map((edu, i) => (
                    <div key={i}>
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-foreground">
                          {edu.degree} in {edu.field}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      {edu.gpa && <p className="text-sm text-muted-foreground">GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {resume.includeProjects && resume.projects && resume.projects.length > 0 && (
              <div className="border-b border-border py-6">
                <h2 className="font-heading text-2xl font-bold text-foreground">Projects</h2>
                <div className="mt-4 space-y-4">
                  {resume.projects.map((project, i) => (
                    <div key={i}>
                      <h3 className="font-semibold text-foreground">{project.title}</h3>
                      <p className="mt-1 text-sm text-foreground">{project.description}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Tech: {project.techStack.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements Section */}
            {resume.includeAchievements && resume.achievements && resume.achievements.length > 0 && (
              <div className="border-b border-border py-6">
                <h2 className="font-heading text-2xl font-bold text-foreground">Achievements</h2>
                <ul className="mt-3 space-y-2">
                  {resume.achievements.map((achievement, i) => (
                    <li key={i} className="text-sm text-foreground">• {achievement}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Social Links Section */}
            {resume.includeSocialLinks && (resume.githubUrl || resume.linkedinUrl || resume.youtubeUrl || resume.portfolioUrl) && (
              <div className="py-6">
                <h2 className="font-heading text-2xl font-bold text-foreground">Links</h2>
                <div className="mt-3 space-y-2">
                  {resume.githubUrl && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">GitHub:</span>
                      <a 
                        href={resume.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                        data-testid="link-github"
                      >
                        {resume.githubUrl}
                      </a>
                    </div>
                  )}
                  {resume.linkedinUrl && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">LinkedIn:</span>
                      <a 
                        href={resume.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                        data-testid="link-linkedin"
                      >
                        {resume.linkedinUrl}
                      </a>
                    </div>
                  )}
                  {resume.youtubeUrl && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">YouTube:</span>
                      <a 
                        href={resume.youtubeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                        data-testid="link-youtube"
                      >
                        {resume.youtubeUrl}
                      </a>
                    </div>
                  )}
                  {resume.portfolioUrl && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">Portfolio:</span>
                      <a 
                        href={resume.portfolioUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                        data-testid="link-portfolio"
                      >
                        {resume.portfolioUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <Button
              variant="outline"
              asChild
              data-testid="button-edit"
              className="hover-elevate active-elevate-2"
            >
              <a href="/">Edit Resume</a>
            </Button>
            <Button
              onClick={() => downloadMutation.mutate()}
              disabled={downloadMutation.isPending}
              data-testid="button-download"
              className="hover-elevate active-elevate-2"
            >
              <Download className="mr-2 h-4 w-4" />
              {downloadMutation.isPending ? "Downloading..." : "Download PDF"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
