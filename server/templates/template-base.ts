import type { Resume } from "@shared/schema";

export function escapeLatex(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

export function escapeUrl(url: string): string {
  if (!url) return '';
  return url.replace(/#/g, '\\#').replace(/%/g, '\\%').replace(/&/g, '\\&');
}

export interface LatexTemplate {
  name: string;
  id: string;
  generate: (resume: Resume) => string;
}
