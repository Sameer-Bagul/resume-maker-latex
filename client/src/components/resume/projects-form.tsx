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
import type { Resume, Project } from "@shared/schema";
import { generateId } from "@/lib/utils";

const projectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Description is required"),
  techStack: z.string(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string(),
  current: z.boolean().default(false),
  url: z.string().optional(),
  githubUrl: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectsFormProps {
  resume: Partial<Resume>;
  onSave: (data: Partial<Resume>) => void;
  isSaving: boolean;
}

export function ProjectsForm({ resume, onSave, isSaving }: ProjectsFormProps) {
  const [projectsList, setProjectsList] = useState<Project[]>(resume.projects || []);
  const [includeProjects, setIncludeProjects] = useState(resume.includeProjects ?? true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      techStack: "",
      startDate: "",
      endDate: "",
      current: false,
      url: "",
      githubUrl: "",
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    const techStackArray = data.techStack.split(",").map(t => t.trim()).filter(Boolean);
    
    const newProject: Project = {
      ...data,
      id: editingIndex !== null ? projectsList[editingIndex].id : generateId(),
      techStack: techStackArray,
    };

    if (editingIndex !== null) {
      const updated = [...projectsList];
      updated[editingIndex] = newProject;
      setProjectsList(updated);
      setEditingIndex(null);
    } else {
      setProjectsList([...projectsList, newProject]);
    }

    form.reset();
  };

  const handleEdit = (index: number) => {
    const project = projectsList[index];
    form.reset({
      ...project,
      techStack: project.techStack.join(", "),
    });
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    setProjectsList(projectsList.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      form.reset();
    }
  };

  const handleSave = () => {
    onSave({
      projects: projectsList,
      includeProjects,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">Projects</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Showcase your best work and achievements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Include in resume</label>
          <Switch
            checked={includeProjects}
            onCheckedChange={setIncludeProjects}
            data-testid="switch-include-projects"
          />
        </div>
      </div>

      {/* Projects List */}
      {projectsList.length > 0 && (
        <div className="space-y-3">
          {projectsList.map((project, index) => (
            <Card key={project.id} className="p-4 hover-elevate" data-testid={`card-project-${index}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.techStack.map((tech, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {project.startDate} - {project.current ? "Present" : project.endDate}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(index)}
                    data-testid={`button-edit-project-${index}`}
                    className="hover-elevate active-elevate-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(index)}
                    data-testid={`button-delete-project-${index}`}
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
          {editingIndex !== null ? "Edit Project" : "Add Project"}
        </h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E-commerce Platform" {...field} data-testid="input-project-title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you built and its impact..."
                      className="resize-none min-h-24"
                      {...field}
                      data-testid="textarea-project-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="techStack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tech Stack (comma-separated)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="React, Node.js, PostgreSQL, AWS" 
                      {...field} 
                      data-testid="input-tech-stack"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input placeholder="Jan 2024" {...field} data-testid="input-project-start" />
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
                        placeholder="Mar 2024" 
                        {...field} 
                        disabled={form.watch("current")}
                        data-testid="input-project-end"
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
                      data-testid="checkbox-current-project"
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Currently working on this</FormLabel>
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://project.com" {...field} data-testid="input-project-url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/user/repo" {...field} data-testid="input-github-url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="hover-elevate active-elevate-2"
              data-testid="button-add-project"
            >
              <Plus className="mr-2 h-4 w-4" />
              {editingIndex !== null ? "Update Project" : "Add Project"}
            </Button>
          </form>
        </Form>
      </Card>

      <Button
        onClick={handleSave}
        disabled={isSaving}
        data-testid="button-save-projects"
        className="hover-elevate active-elevate-2"
      >
        {isSaving ? "Saving..." : "Save Projects"}
      </Button>
    </div>
  );
}
