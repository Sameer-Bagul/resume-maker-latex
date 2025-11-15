import type { Resume } from "@shared/schema";
import { getTemplate } from "./templates";

export function generateLatexSource(resume: Resume): string {
  const templateId = resume.templateId || 'modern';
  const template = getTemplate(templateId);
  
  return template.generate(resume);
}
