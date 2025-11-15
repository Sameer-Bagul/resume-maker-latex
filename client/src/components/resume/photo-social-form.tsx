import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Linkedin, Youtube, Globe, Upload } from "lucide-react";
import type { Resume } from "@shared/schema";

const formSchema = z.object({
  photoUrl: z.string().optional(),
  githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedinUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  youtubeUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  portfolioUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  includeSocialLinks: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

interface PhotoSocialFormProps {
  resume: Partial<Resume>;
  onSave: (data: Partial<Resume>) => void;
  isSaving: boolean;
}

export function PhotoSocialForm({ resume, onSave, isSaving }: PhotoSocialFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photoUrl: resume.photoUrl || "",
      githubUrl: resume.githubUrl || "",
      linkedinUrl: resume.linkedinUrl || "",
      youtubeUrl: resume.youtubeUrl || "",
      portfolioUrl: resume.portfolioUrl || "",
      includeSocialLinks: resume.includeSocialLinks ?? true,
    },
  });

  const onSubmit = (data: FormData) => {
    onSave(data);
  };

  const photoUrl = form.watch("photoUrl");

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold">Photo & Social Links</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your photo and professional social media profiles
            </p>
          </div>
          <FormField
            control={form.control}
            name="includeSocialLinks"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <label className="text-sm">Include in resume</label>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  data-testid="switch-include-social"
                />
              </div>
            )}
          />
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Photo Section */}
          <Card className="p-6 bg-muted/30">
            <h3 className="font-semibold mb-4">Professional Photo</h3>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <Avatar className="h-32 w-32 border-4 border-border">
                <AvatarImage src={photoUrl} alt="Profile" />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                  {resume.fullName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo URL</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            placeholder="https://example.com/photo.jpg"
                            {...field}
                            data-testid="input-photo-url"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="flex-shrink-0 hover-elevate active-elevate-2"
                            data-testid="button-upload-photo"
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Paste a URL to your professional photo or headshot
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Card>

          {/* Social Links Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Social & Professional Links</h3>
            
            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/username"
                      {...field}
                      data-testid="input-github"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/username"
                      {...field}
                      data-testid="input-linkedin"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="youtubeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Youtube className="h-4 w-4" />
                    YouTube
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://youtube.com/@username"
                      {...field}
                      data-testid="input-youtube"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="portfolioUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Portfolio / Website
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://yourportfolio.com"
                      {...field}
                      data-testid="input-portfolio"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            data-testid="button-save-photo-social"
            className="hover-elevate active-elevate-2"
          >
            {isSaving ? "Saving..." : "Save Photo & Links"}
          </Button>
        </form>
      </div>
    </Form>
  );
}
