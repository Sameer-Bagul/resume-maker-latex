import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import type { Resume, Skill } from "@shared/schema";

const formSchema = z.object({
  skillName: z.string(),
  skillCategory: z.string().optional(),
  includeSkills: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

interface SkillsFormProps {
  resume: Partial<Resume>;
  onSave: (data: Partial<Resume>) => void;
  isSaving: boolean;
}

export function SkillsForm({ resume, onSave, isSaving }: SkillsFormProps) {
  const [skills, setSkills] = useState<Skill[]>(resume.skills || []);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skillName: "",
      skillCategory: "",
      includeSkills: resume.includeSkills ?? true,
    },
  });

  const addSkill = () => {
    const skillName = form.getValues("skillName");
    const skillCategory = form.getValues("skillCategory");
    
    if (skillName.trim()) {
      const newSkill: Skill = {
        name: skillName.trim(),
        category: skillCategory?.trim(),
      };
      
      setSkills([...skills, newSkill]);
      form.setValue("skillName", "");
      form.setValue("skillCategory", "");
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({
      skills,
      includeSkills: form.getValues("includeSkills"),
    });
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold">Skills</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your technical and professional skills
            </p>
          </div>
          <FormField
            control={form.control}
            name="includeSkills"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormLabel className="text-sm">Include in resume</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    data-testid="switch-include-skills"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="skillName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Skill Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., React, TypeScript, Project Management"
                      {...field}
                      data-testid="input-skill-name"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skillCategory"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Category (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Frontend, Backend, Soft Skills"
                      {...field}
                      data-testid="input-skill-category"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              onClick={addSkill}
              className="mt-8 hover-elevate active-elevate-2"
              data-testid="button-add-skill"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Skills List */}
          {skills.length > 0 && (
            <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
              <h3 className="font-semibold">Your Skills ({skills.length})</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="gap-1.5 pr-1 hover-elevate"
                    data-testid={`badge-skill-${index}`}
                  >
                    <span className="font-medium">{skill.name}</span>
                    {skill.category && (
                      <span className="text-xs text-muted-foreground">({skill.category})</span>
                    )}
                    <button
                      onClick={() => removeSkill(index)}
                      className="ml-1 rounded-sm hover:bg-background/20"
                      data-testid={`button-remove-skill-${index}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            data-testid="button-save-skills"
            className="hover-elevate active-elevate-2"
          >
            {isSaving ? "Saving..." : "Save Skills"}
          </Button>
        </div>
      </div>
    </Form>
  );
}
