import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, X } from "lucide-react";
import type { Resume, Experience } from "@shared/schema";
import { generateId } from "@/lib/utils";

const experienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string(),
  current: z.boolean().default(false),
  location: z.string().optional(),
  responsibilities: z.string(),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  resume: Partial<Resume>;
  onSave: (data: Partial<Resume>) => void;
  isSaving: boolean;
}

export function ExperienceForm({ resume, onSave, isSaving }: ExperienceFormProps) {
  const [experienceList, setExperienceList] = useState<Experience[]>(resume.experience || []);
  const [includeExperience, setIncludeExperience] = useState(resume.includeExperience ?? true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      location: "",
      responsibilities: "",
    },
  });

  const onSubmit = (data: ExperienceFormData) => {
    const responsibilitiesArray = data.responsibilities
      .split("\n")
      .map(r => r.trim())
      .filter(Boolean);
    
    const newExperience: Experience = {
      ...data,
      id: editingIndex !== null ? experienceList[editingIndex].id : generateId(),
      responsibilities: responsibilitiesArray,
    };

    if (editingIndex !== null) {
      const updated = [...experienceList];
      updated[editingIndex] = newExperience;
      setExperienceList(updated);
      setEditingIndex(null);
    } else {
      setExperienceList([...experienceList, newExperience]);
    }

    form.reset();
  };

  const handleEdit = (index: number) => {
    const exp = experienceList[index];
    form.reset({
      ...exp,
      responsibilities: exp.responsibilities.join("\n"),
    });
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    setExperienceList(experienceList.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      form.reset();
    }
  };

  const handleSave = () => {
    onSave({
      experience: experienceList,
      includeExperience,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">Work Experience</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your professional work history
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Include in resume</label>
          <Switch
            checked={includeExperience}
            onCheckedChange={setIncludeExperience}
            data-testid="switch-include-experience"
          />
        </div>
      </div>

      {/* Experience List */}
      {experienceList.length > 0 && (
        <div className="space-y-3">
          {experienceList.map((exp, index) => (
            <Card key={exp.id} className="p-4 hover-elevate" data-testid={`card-experience-${index}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{exp.position}</h3>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  {exp.location && (
                    <p className="text-xs text-muted-foreground">{exp.location}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {exp.responsibilities.slice(0, 2).map((resp, i) => (
                      <li key={i} className="text-xs text-muted-foreground line-clamp-1">
                        • {resp}
                      </li>
                    ))}
                    {exp.responsibilities.length > 2 && (
                      <li className="text-xs text-muted-foreground">
                        ... and {exp.responsibilities.length - 2} more
                      </li>
                    )}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(index)}
                    data-testid={`button-edit-experience-${index}`}
                    className="hover-elevate active-elevate-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(index)}
                    data-testid={`button-delete-experience-${index}`}
                    className="hover-elevate active-elevate-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      <Card className="p-6 bg-muted/30">
        <h3 className="font-semibold mb-4">
          {editingIndex !== null ? "Edit Experience" : "Add Experience"}
        </h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Company Name" {...field} data-testid="input-company" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Engineer" {...field} data-testid="input-position" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="San Francisco, CA" {...field} data-testid="input-exp-location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input placeholder="Jan 2022" {...field} data-testid="input-exp-start" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Dec 2023" 
                        {...field} 
                        disabled={form.watch("current")}
                        data-testid="input-exp-end"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="current"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="checkbox-current-experience"
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Currently working here</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="responsibilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsibilities (one per line)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Led a team of 5 developers&#10;Implemented microservices architecture&#10;Reduced response time by 40%"
                      className="resize-none min-h-32"
                      {...field}
                      data-testid="textarea-responsibilities"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="hover-elevate active-elevate-2"
              data-testid="button-add-experience"
            >
              <Plus className="mr-2 h-4 w-4" />
              {editingIndex !== null ? "Update Experience" : "Add Experience"}
            </Button>
          </form>
        </Form>
      </Card>

      <Button
        onClick={handleSave}
        disabled={isSaving}
        data-testid="button-save-experience"
        className="hover-elevate active-elevate-2"
      >
        {isSaving ? "Saving..." : "Save Experience"}
      </Button>
    </div>
  );
}
