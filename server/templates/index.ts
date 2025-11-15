import { modernTemplate } from './modern';
import { professionalTemplate } from './professional';
import type { LatexTemplate } from './template-base';

export const templates: Record<string, LatexTemplate> = {
  [modernTemplate.id]: modernTemplate,
  [professionalTemplate.id]: professionalTemplate,
};

export function getTemplate(templateId: string): LatexTemplate {
  return templates[templateId] || modernTemplate;
}

export { type LatexTemplate } from './template-base';
