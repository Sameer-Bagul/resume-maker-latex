import type { Resume } from "@shared/schema";
import { escapeLatex, escapeUrl, type LatexTemplate } from "./template-base";

function generateModernLatex(resume: Resume): string {
  const sections: string[] = [];

  sections.push(String.raw`\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{geometry}
\usepackage{xcolor}
\usepackage{titlesec}
\usepackage{enumitem}
\usepackage{hyperref}
\usepackage{parskip}

\geometry{margin=0.75in}
\definecolor{accentcolor}{HTML}{BFFF0B}
\definecolor{darkgray}{HTML}{333333}
\definecolor{mediumgray}{HTML}{666666}
\definecolor{lightgray}{HTML}{999999}

\titleformat{\section}{\Large\bfseries\color{darkgray}}{}{0em}{}[\color{accentcolor}\titlerule]
\setlist[itemize]{leftmargin=*,label=\textbullet}

\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    urlcolor=blue}

\pagestyle{empty}

\begin{document}
`);

  if (resume.includePersonalDetails) {
    sections.push(`{\\Huge\\bfseries\\color{darkgray} ${escapeLatex(resume.fullName || 'Your Name')}}\\\\[0.3em]`);
    
    if (resume.jobTitle) {
      sections.push(`{\\large\\color{mediumgray} ${escapeLatex(resume.jobTitle)}}\\\\[0.5em]`);
    }

    const contactInfo: string[] = [];
    if (resume.email) contactInfo.push(escapeLatex(resume.email));
    if (resume.phone) contactInfo.push(escapeLatex(resume.phone));
    if (resume.location) contactInfo.push(escapeLatex(resume.location));
    
    if (contactInfo.length > 0) {
      sections.push(`{\\color{mediumgray} ${contactInfo.join(' | ')}}\\\\[0.5em]`);
    }

    if (resume.summary) {
      sections.push(`\\vspace{0.5em}\n${escapeLatex(resume.summary)}\\\\[1em]`);
    }
  }

  if (resume.includeSkills && resume.skills && resume.skills.length > 0) {
    sections.push(`\\section*{SKILLS}`);
    
    const skillsByCategory = resume.skills.reduce((acc, skill) => {
      const category = skill.category || 'General';
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill.name);
      return acc;
    }, {} as Record<string, string[]>);

    if (Object.keys(skillsByCategory).length > 1) {
      Object.entries(skillsByCategory).forEach(([category, skills]) => {
        sections.push(`{\\bfseries ${escapeLatex(category)}:} ${skills.map(escapeLatex).join(' $\\bullet$ ')}\\\\`);
      });
    } else {
      const skillNames = resume.skills.map(s => escapeLatex(s.name)).join(' $\\bullet$ ');
      sections.push(skillNames + '\\\\[0.5em]');
    }
  }

  if (resume.includeExperience && resume.experience && resume.experience.length > 0) {
    sections.push(`\\section*{WORK EXPERIENCE}`);
    
    resume.experience.forEach((exp) => {
      sections.push(`\\textbf{${escapeLatex(exp.position)} -- ${escapeLatex(exp.company)}}\\hfill ${escapeLatex(exp.startDate)} -- ${exp.current ? 'Present' : escapeLatex(exp.endDate)}\\\\`);
      
      if (exp.location) {
        sections.push(`{\\color{lightgray} ${escapeLatex(exp.location)}}\\\\[0.3em]`);
      }
      
      if (exp.responsibilities.length > 0) {
        sections.push('\\begin{itemize}[noitemsep]');
        exp.responsibilities.forEach(resp => {
          sections.push(`  \\item ${escapeLatex(resp)}`);
        });
        sections.push('\\end{itemize}');
      }
      sections.push('\\vspace{0.5em}');
    });
  }

  if (resume.includeEducation && resume.education && resume.education.length > 0) {
    sections.push(`\\section*{EDUCATION}`);
    
    resume.education.forEach((edu) => {
      sections.push(`\\textbf{${escapeLatex(edu.degree)} in ${escapeLatex(edu.field)}}\\hfill ${escapeLatex(edu.startDate)} -- ${edu.current ? 'Present' : escapeLatex(edu.endDate)}\\\\`);
      sections.push(`{\\color{mediumgray} ${escapeLatex(edu.institution)}}\\\\`);
      
      if (edu.gpa) {
        sections.push(`{\\color{lightgray} GPA: ${escapeLatex(edu.gpa)}}\\\\`);
      }
      
      if (edu.description) {
        sections.push(`{\\small ${escapeLatex(edu.description)}}\\\\`);
      }
      
      sections.push('\\vspace{0.5em}');
    });
  }

  if (resume.includeProjects && resume.projects && resume.projects.length > 0) {
    sections.push(`\\section*{PROJECTS}`);
    
    resume.projects.forEach((project) => {
      sections.push(`\\textbf{${escapeLatex(project.title)}}\\\\`);
      sections.push(`${escapeLatex(project.description)}\\\\`);
      
      if (project.techStack && project.techStack.length > 0) {
        sections.push(`{\\small\\color{mediumgray} Technologies: ${project.techStack.map(escapeLatex).join(', ')}}\\\\`);
      }
      
      const links: string[] = [];
      if (project.url) links.push(`URL: \\\\url{${escapeUrl(project.url)}}`);
      if (project.githubUrl) links.push(`GitHub: \\\\url{${escapeUrl(project.githubUrl)}}`);
      
      if (links.length > 0) {
        sections.push(`{\\\\small\\\\color{blue} ${links.join(' | ')}}\\\\\\\\`);
      }
      
      sections.push('\\vspace{0.5em}');
    });
  }

  if (resume.includeAchievements && resume.achievements && resume.achievements.length > 0) {
    sections.push(`\\section*{ACHIEVEMENTS}`);
    sections.push('\\begin{itemize}[noitemsep]');
    resume.achievements.forEach((achievement) => {
      sections.push(`  \\item ${escapeLatex(achievement)}`);
    });
    sections.push('\\end{itemize}');
    sections.push('\\vspace{0.5em}');
  }

  if (resume.includeSocialLinks && (resume.githubUrl || resume.linkedinUrl || resume.youtubeUrl || resume.portfolioUrl)) {
    sections.push(`\\section*{LINKS}`);
    
    if (resume.githubUrl) {
      sections.push(`\\\\textbf{GitHub:} \\\\url{${escapeUrl(resume.githubUrl)}}\\\\\\\\`);
    }
    if (resume.linkedinUrl) {
      sections.push(`\\\\textbf{LinkedIn:} \\\\url{${escapeUrl(resume.linkedinUrl)}}\\\\\\\\`);
    }
    if (resume.youtubeUrl) {
      sections.push(`\\\\textbf{YouTube:} \\\\url{${escapeUrl(resume.youtubeUrl)}}\\\\\\\\`);
    }
    if (resume.portfolioUrl) {
      sections.push(`\\\\textbf{Portfolio:} \\\\url{${escapeUrl(resume.portfolioUrl)}}\\\\\\\\`);
    }
  }

  sections.push('\\end{document}');
  
  return sections.join('\n');
}

export const modernTemplate: LatexTemplate = {
  name: 'Modern',
  id: 'modern',
  generate: generateModernLatex
};