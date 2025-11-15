import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { Resume } from "@shared/schema";

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().optional(),
  summary: z.string().optional(),
  includePersonalDetails: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

interface PersonalDetailsFormProps {
  resume: Partial<Resume>;
  onSave: (data: Partial<Resume>) => void;
  isSaving: boolean;
}

export function PersonalDetailsForm({ resume, onSave, isSaving }: PersonalDetailsFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: resume.fullName || "",
      jobTitle: resume.jobTitle || "",
      email: resume.email || "",
      phone: resume.phone || "",
      location: resume.location || "",
      summary: resume.summary || "",
      includePersonalDetails: resume.includePersonalDetails ?? true,
    },
  });

  const onSubmit = (data: FormData) => {
    onSave(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">Personal Details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell us about yourself and your career goals
          </p>
        </div>
        <FormField
          control={form.control}
          name="includePersonalDetails"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormLabel className="text-sm">Include in resume</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  data-testid="switch-include-personal"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="John Doe" 
                      {...field} 
                      data-testid="input-full-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Software Engineer" 
                      {...field} 
                      data-testid="input-job-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="john@example.com" 
                      {...field} 
                      data-testid="input-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="+1 (555) 123-4567" 
                      {...field} 
                      data-testid="input-phone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="San Francisco, CA" 
                      {...field} 
                      data-testid="input-location"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Summary (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief overview of your professional background and career objectives..."
                    className="min-h-32 resize-none"
                    {...field}
                    data-testid="textarea-summary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={isSaving}
            data-testid="button-save-personal"
            className="hover-elevate active-elevate-2"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
