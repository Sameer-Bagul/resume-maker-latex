import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileText, Zap, Download, CheckCircle, Sparkles, Eye } from "lucide-react";

export default function Landing() {
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
              <Button 
                variant="outline" 
                asChild
                data-testid="button-login"
                className="hover-elevate active-elevate-2"
              >
                <a href="/api/login">Log In</a>
              </Button>
              <Button 
                asChild
                data-testid="button-get-started"
                className="hover-elevate active-elevate-2"
              >
                <a href="/api/login">Get Started</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="container relative mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge 
              variant="outline" 
              className="mb-6 border-primary/20 bg-primary/10 text-sm font-medium hover-elevate"
              data-testid="badge-new"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              ATS-Optimized Resume Builder
            </Badge>
            <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Create Your{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Perfect Resume
              </span>
              {" "}in Minutes
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Build professional, ATS-optimized resumes with our LaTeX-powered engine. 
              Choose from multiple templates, get real-time preview, and download instantly.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                asChild
                data-testid="button-hero-start"
                className="h-12 px-8 text-base font-semibold hover-elevate active-elevate-2"
              >
                <a href="/api/login">Start Building Free</a>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                data-testid="button-hero-learn"
                className="h-12 px-8 text-base font-semibold hover-elevate active-elevate-2"
              >
                <Eye className="mr-2 h-5 w-5" />
                See Examples
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required · Free forever · Export to PDF
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-border py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              Everything You Need to Stand Out
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Professional tools designed to help you land your dream job
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Create a professional resume in under 10 minutes with our intuitive multi-step form.",
              },
              {
                icon: CheckCircle,
                title: "ATS-Optimized",
                description: "All templates are designed to pass Applicant Tracking Systems with high scores.",
              },
              {
                icon: FileText,
                title: "LaTeX Powered",
                description: "Professional typesetting using LaTeX ensures pixel-perfect, publication-quality output.",
              },
              {
                icon: Eye,
                title: "Real-time Preview",
                description: "See your resume update instantly as you type, no waiting or rendering delays.",
              },
              {
                icon: Download,
                title: "Instant Download",
                description: "Export your resume to PDF format with a single click, ready to send.",
              },
              {
                icon: Sparkles,
                title: "Multiple Templates",
                description: "Choose from professionally designed templates, each optimized for different industries.",
              },
            ].map((feature, idx) => (
              <Card 
                key={idx} 
                className="p-6 hover-elevate transition-all"
                data-testid={`card-feature-${idx}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-heading text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow Section */}
      <section className="border-b border-border py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              Simple 4-Step Process
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From start to finish in minutes
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "01", title: "Fill Details", description: "Enter your personal information, skills, experience, and education" },
              { step: "02", title: "Choose Template", description: "Select from professional, ATS-optimized templates" },
              { step: "03", title: "Preview", description: "See your resume in real-time as you make changes" },
              { step: "04", title: "Download", description: "Export to PDF and start applying immediately" },
            ].map((item, idx) => (
              <div key={idx} className="relative" data-testid={`step-${idx}`}>
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 font-heading text-2xl font-bold text-primary">
                    {item.step}
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
                {idx < 3 && (
                  <div className="absolute right-0 top-8 hidden h-0.5 w-full bg-gradient-to-r from-primary/50 to-transparent lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-3xl font-bold sm:text-4xl">
                Ready to Build Your Resume?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of job seekers who have created professional resumes with ResumeCraft
              </p>
              <div className="mt-8">
                <Button 
                  size="lg" 
                  asChild
                  data-testid="button-cta-start"
                  className="h-12 px-8 text-base font-semibold hover-elevate active-elevate-2"
                >
                  <a href="/api/login">Start Building Now</a>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-bold">ResumeCraft</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 ResumeCraft. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
