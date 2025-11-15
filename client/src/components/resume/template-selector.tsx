import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import type { Resume } from "@shared/schema";

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean and contemporary design with clear section separation",
    atsScore: 98,
    preview: "bg-gradient-to-br from-primary/10 to-transparent",
  },
  {
    id: "classic",
    name: "Classic ATS",
    description: "Traditional format optimized for Applicant Tracking Systems",
    atsScore: 100,
    preview: "bg-gradient-to-br from-blue-500/10 to-transparent",
  },
  {
    id: "minimal",
    name: "Minimal Elegant",
    description: "Simple and elegant with focus on content",
    atsScore: 95,
    preview: "bg-gradient-to-br from-purple-500/10 to-transparent",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Professional template for senior positions",
    atsScore: 97,
    preview: "bg-gradient-to-br from-green-500/10 to-transparent",
  },
];

interface TemplateSelectorProps {
  resume: Partial<Resume>;
  onSave: (data: Partial<Resume>) => void;
  isSaving: boolean;
}

export function TemplateSelector({ resume, onSave, isSaving }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(resume.templateId || "modern");

  const handleSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleSave = () => {
    onSave({ templateId: selectedTemplate });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold">Choose Template</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a professional template optimized for ATS systems
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {TEMPLATES.map((template) => (
          <Card
            key={template.id}
            className={`relative cursor-pointer overflow-hidden p-6 transition-all hover-elevate ${
              selectedTemplate === template.id
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : ""
            }`}
            onClick={() => handleSelect(template.id)}
            data-testid={`card-template-${template.id}`}
          >
            {selectedTemplate === template.id && (
              <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            
            {/* Template Preview */}
            <div className={`mb-4 aspect-[3/4] rounded-md border border-border ${template.preview}`}>
              <div className="flex h-full flex-col items-center justify-center p-4">
                <div className="w-full space-y-2">
                  <div className="h-3 w-3/4 rounded bg-foreground/20" />
                  <div className="h-2 w-1/2 rounded bg-foreground/10" />
                  <div className="mt-4 space-y-1.5">
                    <div className="h-2 w-full rounded bg-foreground/10" />
                    <div className="h-2 w-5/6 rounded bg-foreground/10" />
                    <div className="h-2 w-4/6 rounded bg-foreground/10" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold">{template.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  ATS {template.atsScore}%
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
        <div>
          <p className="font-semibold">Selected: {TEMPLATES.find(t => t.id === selectedTemplate)?.name}</p>
          <p className="text-sm text-muted-foreground">
            ATS Score: {TEMPLATES.find(t => t.id === selectedTemplate)?.atsScore}%
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          data-testid="button-save-template"
          className="hover-elevate active-elevate-2"
        >
          {isSaving ? "Saving..." : "Save Template"}
        </Button>
      </div>
    </div>
  );
}
