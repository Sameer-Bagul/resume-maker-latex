import type { Resume } from "@shared/schema";
import { escapeLatex, escapeUrl, type LatexTemplate } from "./template-base";

function generateProfessionalLatex(resume: Resume): string {
  const sections: string[] = [];

  sections.push(String.raw`%-------------------------
% Professional Resume Template
% Based on template by Sameer Bagul
% License : MIT
%------------------------

\documentclass[letterpaper,11pt]{article}

% Packages
\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\\usepackage[hidelinks]{hyperref}
\\usepackage[english]{babel}
\usepackage{tabularx}
\\usepackage{multicol}
\usepackage{graphicx}
\RequirePackage{xcolo

% Color Scheme
\definecolor{cvblue}{HTML}{0E5484}
\definecolor{darkcolor}{HTML}{0F4539}
\definecolor{SlateGrey}{HTML}{2E2E2E}
\definecolor{LightGrey}{HTML}{666666}

\colorlet{name}{black}
\colorlet{heading}{darkcolor}
\colorlet{body}{LightGrey}

% Page layout
\usepackage[top=0.2in, bottom=0.2in, left=0.3in, right=0.3in]{geometry}
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}
\linespread{0.95}
\setlength{\parskip}{4pt}
\setlength{\parindent}{0pt}
\setlist[itemize]{itemsep=2.5pt, topsep=4pt, parsep=1pt, partopsep=0pt}

% Section formatting
\titleformat{\section}{\vspace{-2pt}\scshape\raggedright\large\bfseries}{}{0em}{}[\color{black}\titlerule \vspace{-4pt}]
\titlespacing*{\section}{0pt}{9pt}{6pt}

%-------------------------
% Custom Commands
\newcommand{\resumeItem}[1]{\item\normalsize{#1 \vspace{-1pt}}}
\newcommand{\resumeSubheading}[4]{
  \vspace{-1.5pt}\item
  \begin{tabular*}{1.0\textwidth}[t]{l@{\extracolsep{\fill}}r}
    \textbf{\large#1} & \textbf{\small #2} \\
    \textit{\large#3} & \textit{\small #4} \\
  \end{tabular*}\vspace{-5pt}
}
\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0in, label={}, itemsep=2.5pt, topsep=4pt]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}[leftmargin=0.1in, itemsep=2pt, topsep=3pt]}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-4pt}}
\renewcommand\labelitemi{$\vcenter{\hbox{\tiny$\bullet$}}$}

%-------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\begin{document}
`);

  if (resume.includePersonalDetails) {
    sections.push(`\\begin{center}`);
    sections.push(`{\\huge \\textbf{${escapeLatex(resume.fullName || 'Your Name')}}} \\\\[2pt]`);
    
    if (resume.jobTitle) {
      sections.push(`{\\large ${escapeLatex(resume.jobTitle)}} \\\\[2pt]`);
    }

    const contactInfo: string[] = [];
    if (resume.location) contactInfo.push(escapeLatex(resume.location));
    if (contactInfo.length > 0) {
      sections.push(`${contactInfo.join(' ')} \\\\`);
    }

    const links: string[] = [];
    if (resume.phone) links.push(escapeLatex(resume.phone));
    if (resume.email) links.push(`\\href{mailto:${escapeUrl(resume.email)}}{\\color{cvblue}{${escapeLatex(resume.email)}}}`);
    if (resume.portfolioUrl) links.push(`\\href{${escapeUrl(resume.portfolioUrl)}}{\\color{cvblue}{Portfolio}}`);
    if (resume.linkedinUrl) {
      const linkedinDisplay = resume.linkedinUrl.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '');
      links.push(`\\href{${escapeUrl(resume.linkedinUrl)}}{\\color{cvblue}{linkedin.com/in/${escapeLatex(linkedinDisplay)}}}`);
    }
    if (resume.githubUrl) {
      const githubDisplay = resume.githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//, '');
      links.push(`\\href{${escapeUrl(resume.githubUrl)}}{\\color{cvblue}{${escapeLatex(githubDisplay)}}}`);
    }
    
    if (links.length > 0) {
      sections.push(links.join(' ~ '));
    }

    sections.push(`\\vspace{-10pt}`);
    sections.push(`\\end{center}`);
  }

  if (resume.summary) {
    sections.push(`\\vspace{0.5em}`);
    sections.push(escapeLatex(resume.summary));
    sections.push(`\\vspace{0.5em}`);
  }

  if (resume.includeSkills && resume.skills && resume.skills.length > 0) {
    sections.push(`\\section{Technical Skills}`);
    sections.push(`\\begin{itemize}[leftmargin=0in, label={}]`);
    sections.push(`\\small{`);
    sections.push(`\\item{`);

    const skillsByCategory = resume.skills.reduce((acc, skill) => {
      const category = skill.category || 'General';
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill.name);
      return acc;
    }, {} as Record<string, string[]>);

    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      sections.push(`\\textbf{${escapeLatex(category)}:} ${skills.map(escapeLatex).join(', ')} \\\\`);
    });

    sections.push(`}}`);
    sections.push(`\\end{itemize}`);
  }

  if (resume.includeEducation && resume.education && resume.education.length > 0) {
    sections.push(`\\section{Education}`);
    sections.push(`\\resumeSubHeadingListStart`);
    
    resume.education.forEach((edu) => {
      const dateStr = `${escapeLatex(edu.startDate)} -- ${edu.current ? 'Present' : escapeLatex(edu.endDate)}`;
      const degreeField = `${escapeLatex(edu.degree)} - ${escapeLatex(edu.field)}${edu.gpa ? ` \\\\hfill \\\\textbf{GPA: ${escapeLatex(edu.gpa)}}` : ''}`;
      sections.push(`\\\\resumeSubheading`);
      sections.push(`{${escapeLatex(edu.institution)}}{}`);
      sections.push(`{${degreeField}}{\\\\textbf{${dateStr}}}`);
      
      if (edu.description) {
        sections.push(`\\\\resumeItemListStart`);
        sections.push(`\\\\resumeItem{${escapeLatex(edu.description)}}`);
        sections.push(`\\\\resumeItemListEnd`);
      }
    });
    
    sections.push(`\\resumeSubHeadingListEnd`);
  }

  if (resume.includeExperience && resume.experience && resume.experience.length > 0) {
    sections.push(`\\section{Experience}`);
    sections.push(`\\resumeSubHeadingListStart`);
    
    resume.experience.forEach((exp) => {
      const dateStr = `${escapeLatex(exp.startDate)} -- ${exp.current ? 'Present' : escapeLatex(exp.endDate)}`;
      sections.push(`\\resumeSubheading`);
      sections.push(`{${escapeLatex(exp.position)}}{${dateStr}}`);
      sections.push(`{${escapeLatex(exp.company)}}{${exp.location ? escapeLatex(exp.location) : ''}}`);
      
      if (exp.responsibilities.length > 0) {
        sections.push(`\\resumeItemListStart`);
        exp.responsibilities.forEach(resp => {
          sections.push(`\\resumeItem{${escapeLatex(resp)}}`);
        });
        sections.push(`\\resumeItemListEnd`);
      }
    });
    
    sections.push(`\\resumeSubHeadingListEnd`);
  }

  if (resume.includeProjects && resume.projects && resume.projects.length > 0) {
    sections.push(`\\section{Projects}`);
    sections.push(`\\resumeSubHeadingListStart`);
    
    resume.projects.forEach((project) => {
      const dateStr = project.startDate && project.endDate 
        ? `${escapeLatex(project.startDate)} -- ${project.current ? 'Present' : escapeLatex(project.endDate)}`
        : '';
      
      const links: string[] = [];
      if (project.githubUrl) links.push(`\\href{${escapeUrl(project.githubUrl)}}{GitHub}`);
      if (project.url) links.push(`\\href{${escapeUrl(project.url)}}{Preview}`);
      const linksStr = links.length > 0 ? links.join(' ~|~ ') : '';

      const techStack = project.techStack && project.techStack.length > 0 
        ? `Tech Stack: ${project.techStack.map(escapeLatex).join(', ')}`
        : '';

      sections.push(`\\resumeSubheading`);
      sections.push(`{${escapeLatex(project.title)}}{${linksStr}}`);
      sections.push(`{${techStack}}{${dateStr}}`);
      sections.push(`\\resumeItemListStart`);
      sections.push(`\\resumeItem{${escapeLatex(project.description)}}`);
      sections.push(`\\resumeItemListEnd`);
    });
    
    sections.push(`\\resumeSubHeadingListEnd`);
  }

  if (resume.includeAchievements && resume.achievements && resume.achievements.length > 0) {
    sections.push(`\\section{Achievements and Leadership}`);
    sections.push(`\\resumeItemListStart`);
    resume.achievements.forEach((achievement) => {
      sections.push(`\\resumeItem{${escapeLatex(achievement)}}`);
    });
    sections.push(`\\resumeItemListEnd`);
  }

  sections.push('\\end{document}');
  
  return sections.join('\n');
}

export const professionalTemplate: LatexTemplate = {
  name: 'Professional',
  id: 'professional',
  generate: generateProfessionalLatex
};