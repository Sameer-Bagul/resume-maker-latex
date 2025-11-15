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
import { Plus, Trash2 } from "lucide-react";
import type { Resume, Education } from "@shared/schema";
import { generateId } from "@/lib/utils";

const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field of study is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string(),
  current: z.boolean().default(false),
  gpa: z.string().optional(),
  description: z.string().optional(),
});

type EducationFormData = z.infer<typeof educationSchema>;

interface EducationFormProps {
  resume: Partial<Resume>;
  onSave: (data: Partial<Resume>) => void;
  isSaving: boolean;
}

export function EducationForm({ resume, onSave, isSaving }: EducationFormProps) {
  const [educationList, setEducationList] = useState<Education[]>(resume.education || []);
  const [includeEducation, setIncludeEducation] = useState(resume.includeEducation ?? true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: "",
      description: "",
    },
  });

  const onSubmit = (data: EducationFormData) => {
    const newEducation: Education = {
      ...data,
      id: editingIndex !== null ? educationList[editingIndex].id : generateId(),
    };

    if (editingIndex !== null) {
      const updated = [...educationList];
      updated[editingIndex] = newEducation;
      setEducationList(updated);
      setEditingIndex(null);
    } else {
      setEducationList([...educationList, newEducation]);
    }

    form.reset();
  };

  const handleEdit = (index: number) => {
    const edu = educationList[index];
    form.reset(edu);
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    setEducationList(educationList.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      form.reset();
    }
  };

  const handleSave = () => {
    onSave({
      education: educationList,
      includeEducation,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">Education</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your educational background
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Include in resume</label>
          <Switch
            checked={includeEducation}
            onCheckedChange={setIncludeEducation}
            data-testid="switch-include-education"
          />
        </div>
      </div>

      {/* Education List */}
      {educationList.length > 0 && (
        <div className="space-y-3">
          {educationList.map((edu, index) => (
            <Card key={edu.id} className="p-4 hover-elevate" data-testid={`card-education-${index}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(index)}
                    data-testid={`button-edit-education-${index}`}
                    className="hover-elevate active-elevate-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(index)}
                    data-testid={`button-delete-education-${index}`}
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
          {editingIndex !== null ? "Edit Education" : "Add Education"}
        </h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input placeholder="University Name" {...field} data-testid="input-institution" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="Bachelor's, Master's, PhD" {...field} data-testid="input-degree" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="field"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study</FormLabel>
                    <FormControl>
                      <Input placeholder="Computer Science" {...field} data-testid="input-field" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gpa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GPA (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="3.8/4.0" {...field} data-testid="input-gpa" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input placeholder="Aug 2018" {...field} data-testid="input-start-date" />
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
                        placeholder="May 2022" 
                        {...field} 
                        disabled={form.watch("current")}
                        data-testid="input-end-date"
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
                      data-testid="checkbox-current-education"
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Currently studying here</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Relevant coursework, achievements, or activities..."
                      className="resize-none"
                      {...field}
                      data-testid="textarea-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="hover-elevate active-elevate-2"
              data-testid="button-add-education"
            >
              <Plus className="mr-2 h-4 w-4" />
              {editingIndex !== null ? "Update Education" : "Add Education"}
            </Button>
          </form>
        </Form>
      </Card>

      <Button
        onClick={handleSave}
        disabled={isSaving}
        data-testid="button-save-education"
        className="hover-elevate active-elevate-2"
      >
        {isSaving ? "Saving..." : "Save Education"}
      </Button>
    </div>
  );
}
