import { useState, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { Resume } from "@shared/schema";
import type { FormHandle } from "@/components/resume/personal-details-form";

interface AchievementsFormProps {
  resume: Partial<Resume>;
  onSave: (data: Partial<Resume>) => void;
  isSaving: boolean;
}

export const AchievementsForm = forwardRef(function AchievementsForm({ resume, onSave, isSaving }: AchievementsFormProps, ref: React.Ref<FormHandle>) {
  const [achievements, setAchievements] = useState<string[]>(resume.achievements || []);
  const [includeAchievements, setIncludeAchievements] = useState(resume.includeAchievements ?? true);
  const [currentAchievement, setCurrentAchievement] = useState("");

  const addAchievement = () => {
    if (currentAchievement.trim()) {
      setAchievements([...achievements, currentAchievement.trim()]);
      setCurrentAchievement("");
    }
  };

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({
      achievements,
      includeAchievements,
    });
  };

  useImperativeHandle(ref, () => ({
    getCurrentData: () => ({
      achievements,
      includeAchievements,
    }),
  }));

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addAchievement();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">Achievements</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add awards, certifications, and notable accomplishments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Include in resume</label>
          <Switch
            checked={includeAchievements}
            onCheckedChange={setIncludeAchievements}
            data-testid="switch-include-achievements"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="achievement-input">Add Achievement</Label>
            <Input
              id="achievement-input"
              placeholder="e.g., Won 1st place in National Hackathon 2024"
              value={currentAchievement}
              onChange={(e) => setCurrentAchievement(e.target.value)}
              onKeyPress={handleKeyPress}
              data-testid="input-achievement"
              className="mt-2"
            />
          </div>
          <Button
            onClick={addAchievement}
            className="mt-8 hover-elevate active-elevate-2"
            data-testid="button-add-achievement"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Achievements List */}
        {achievements.length > 0 && (
          <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="font-semibold">Your Achievements ({achievements.length})</h3>
            <div className="space-y-2">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between gap-3 rounded-lg bg-background p-3 hover-elevate"
                  data-testid={`item-achievement-${index}`}
                >
                  <div className="flex-1">
                    <p className="text-sm">{achievement}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAchievement(index)}
                    data-testid={`button-remove-achievement-${index}`}
                    className="hover-elevate active-elevate-2 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {achievements.length === 0 && (
          <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No achievements added yet. Start by adding your first one above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});
