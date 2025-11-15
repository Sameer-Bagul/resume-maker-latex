import type { Resume } from "@shared/schema";

export function generateLatexSource(resume: Resume): string {
  const template = resume.templateId || 'modern';
  
  switch (template) {
    case 'modern':
      return generateModernLatex(resume);
    case 'classic':
      return generateClassicLatex(resume);
    case 'minimal':
      return generateMinimalLatex(resume);
    case 'executive':
      return generateExecutiveLatex(resume);
    default:
      return generateModernLatex(resume);
  }
}

function escapeLatex(text: string): string {
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

function escapeUrl(url: string): string {
  if (!url) return '';
  return url.replace(/#/g, '\\#').replace(/%/g, '\\%').replace(/&/g, '\\&');
}

function generateModernLatex(resume: Resume): string {
  const sections: string[] = [];

  sections.push(`\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{geometry}
\\usepackage{xcolor}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{parskip}

\\geometry{margin=0.75in}
\\definecolor{accentcolor}{HTML}{BFFF0B}
\\definecolor{darkgray}{HTML}{333333}
\\definecolor{mediumgray}{HTML}{666666}
\\definecolor{lightgray}{HTML}{999999}

\\titleformat{\\section}{\\Large\\bfseries\\color{darkgray}}{}{0em}{}[\\color{accentcolor}\\titlerule]
\\setlist[itemize]{leftmargin=*,label=\\textbullet}

\\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    urlcolor=blue
}

\\pagestyle{empty}

\\begin{document}
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
    const skillNames = resume.skills.map(s => escapeLatex(s.name)).join(' $\\bullet$ ');
    sections.push(skillNames + '\\\\[0.5em]');
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
      
      if (project.url) {
        sections.push(`{\\small\\color{blue} \\url{${escapeUrl(project.url)}}}\\\\`);
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
      sections.push(`\\textbf{GitHub:} \\url{${escapeUrl(resume.githubUrl)}}\\\\`);
    }
    if (resume.linkedinUrl) {
      sections.push(`\\textbf{LinkedIn:} \\url{${escapeUrl(resume.linkedinUrl)}}\\\\`);
    }
    if (resume.youtubeUrl) {
      sections.push(`\\textbf{YouTube:} \\url{${escapeUrl(resume.youtubeUrl)}}\\\\`);
    }
    if (resume.portfolioUrl) {
      sections.push(`\\textbf{Portfolio:} \\url{${escapeUrl(resume.portfolioUrl)}}\\\\`);
    }
  }

  sections.push('\\end{document}');
  
  return sections.join('\n');
}

function generateClassicLatex(resume: Resume): string {
  const sections: string[] = [];

  sections.push(`\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{geometry}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{hyperref}

\\geometry{margin=1in}
\\titleformat{\\section}{\\Large\\bfseries}{}{0em}{}[\\titlerule]
\\setlist[itemize]{leftmargin=*,label=\\textbullet}

\\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    urlcolor=blue
}

\\pagestyle{empty}

\\begin{document}
`);

  if (resume.includePersonalDetails) {
    sections.push(`\\begin{center}`);
    sections.push(`{\\Huge\\bfseries ${escapeLatex(resume.fullName || 'Your Name')}}\\\\[0.3em]`);
    
    if (resume.jobTitle) {
      sections.push(`{\\large\\itshape ${escapeLatex(resume.jobTitle)}}\\\\[0.5em]`);
    }

    const contactInfo: string[] = [];
    if (resume.email) contactInfo.push(escapeLatex(resume.email));
    if (resume.phone) contactInfo.push(escapeLatex(resume.phone));
    if (resume.location) contactInfo.push(escapeLatex(resume.location));
    
    if (contactInfo.length > 0) {
      sections.push(`${contactInfo.join(' | ')}\\\\[0.5em]`);
    }
    sections.push(`\\end{center}`);

    if (resume.summary) {
      sections.push(`\\vspace{0.5em}\n${escapeLatex(resume.summary)}\\\\[1em]`);
    }
  }

  if (resume.includeSkills && resume.skills && resume.skills.length > 0) {
    sections.push(`\\section*{Skills}`);
    const skillNames = resume.skills.map(s => escapeLatex(s.name)).join(', ');
    sections.push(skillNames + '\\\\[0.5em]');
  }

  if (resume.includeExperience && resume.experience && resume.experience.length > 0) {
    sections.push(`\\section*{Professional Experience}`);
    
    resume.experience.forEach((exp) => {
      sections.push(`\\textbf{${escapeLatex(exp.position)}}\\\\`);
      sections.push(`\\textit{${escapeLatex(exp.company)}} | ${escapeLatex(exp.startDate)} -- ${exp.current ? 'Present' : escapeLatex(exp.endDate)}\\\\[0.3em]`);
      
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
    sections.push(`\\section*{Education}`);
    
    resume.education.forEach((edu) => {
      sections.push(`\\textbf{${escapeLatex(edu.degree)} in ${escapeLatex(edu.field)}}\\\\`);
      sections.push(`\\textit{${escapeLatex(edu.institution)}} | ${escapeLatex(edu.startDate)} -- ${edu.current ? 'Present' : escapeLatex(edu.endDate)}\\\\`);
      
      if (edu.gpa) {
        sections.push(`GPA: ${escapeLatex(edu.gpa)}\\\\`);
      }
      sections.push('\\vspace{0.5em}');
    });
  }

  if (resume.includeProjects && resume.projects && resume.projects.length > 0) {
    sections.push(`\\section*{Projects}`);
    
    resume.projects.forEach((project) => {
      sections.push(`\\textbf{${escapeLatex(project.title)}}\\\\`);
      sections.push(`${escapeLatex(project.description)}\\\\[0.3em]`);
      sections.push('\\vspace{0.5em}');
    });
  }

  if (resume.includeAchievements && resume.achievements && resume.achievements.length > 0) {
    sections.push(`\\section*{Achievements}`);
    sections.push('\\begin{itemize}[noitemsep]');
    resume.achievements.forEach((achievement) => {
      sections.push(`  \\item ${escapeLatex(achievement)}`);
    });
    sections.push('\\end{itemize}');
  }

  sections.push('\\end{document}');
  
  return sections.join('\n');
}

function generateMinimalLatex(resume: Resume): string {
  const sections: string[] = [];

  sections.push(`\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{geometry}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{hyperref}

\\geometry{margin=0.75in}
\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}
\\setlist[itemize]{leftmargin=*,label=\\textbullet}

\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    urlcolor=black
}

\\pagestyle{empty}
\\setlength{\\parindent}{0pt}

\\begin{document}
`);

  if (resume.includePersonalDetails) {
    sections.push(`{\\LARGE\\bfseries ${escapeLatex(resume.fullName || 'Your Name')}}\\\\[0.2em]`);
    
    if (resume.jobTitle) {
      sections.push(`${escapeLatex(resume.jobTitle)}\\\\[0.3em]`);
    }

    const contactInfo: string[] = [];
    if (resume.email) contactInfo.push(escapeLatex(resume.email));
    if (resume.phone) contactInfo.push(escapeLatex(resume.phone));
    
    if (contactInfo.length > 0) {
      sections.push(`{\\small ${contactInfo.join(' $\\bullet$ ')}}\\\\[0.5em]`);
    }

    if (resume.summary) {
      sections.push(`\\vspace{0.3em}\n{\\small ${escapeLatex(resume.summary)}}\\\\[1em]`);
    }
  }

  if (resume.includeSkills && resume.skills && resume.skills.length > 0) {
    sections.push(`\\section*{SKILLS}`);
    const skillNames = resume.skills.map(s => escapeLatex(s.name)).join(' $\\bullet$ ');
    sections.push(`{\\small ${skillNames}}\\\\[0.5em]`);
  }

  if (resume.includeExperience && resume.experience && resume.experience.length > 0) {
    sections.push(`\\section*{EXPERIENCE}`);
    
    resume.experience.forEach((exp) => {
      sections.push(`\\textbf{${escapeLatex(exp.position)}}\\\\`);
      sections.push(`{\\small ${escapeLatex(exp.company)} | ${escapeLatex(exp.startDate)} -- ${exp.current ? 'Present' : escapeLatex(exp.endDate)}}\\\\[0.2em]`);
      
      if (exp.responsibilities.length > 0) {
        sections.push('\\begin{itemize}[noitemsep]');
        exp.responsibilities.forEach(resp => {
          sections.push(`  \\item {\\small ${escapeLatex(resp)}}`);
        });
        sections.push('\\end{itemize}');
      }
      sections.push('\\vspace{0.3em}');
    });
  }

  if (resume.includeEducation && resume.education && resume.education.length > 0) {
    sections.push(`\\section*{EDUCATION}`);
    
    resume.education.forEach((edu) => {
      sections.push(`\\textbf{${escapeLatex(edu.degree)} in ${escapeLatex(edu.field)}}\\\\`);
      sections.push(`{\\small ${escapeLatex(edu.institution)} | ${escapeLatex(edu.startDate)} -- ${edu.current ? 'Present' : escapeLatex(edu.endDate)}}\\\\[0.5em]`);
    });
  }

  sections.push('\\end{document}');
  
  return sections.join('\n');
}

function generateExecutiveLatex(resume: Resume): string {
  const sections: string[] = [];

  sections.push(`\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{geometry}
\\usepackage{xcolor}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{tikz}

\\geometry{margin=0.75in}
\\definecolor{navy}{HTML}{1a2332}
\\definecolor{gold}{HTML}{d4af37}

\\titleformat{\\section}{\\large\\bfseries\\color{navy}}{}{0em}{}[{\\color{gold}\\titlerule[2pt]}]
\\setlist[itemize]{leftmargin=*,label=\\textbullet}

\\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    urlcolor=blue
}

\\pagestyle{empty}

\\begin{document}

\\noindent\\begin{tikzpicture}[remember picture,overlay]
\\fill[navy] (current page.north west) rectangle ([yshift=-2cm]current page.north east);
\\end{tikzpicture}

\\vspace{0.5cm}
`);

  if (resume.includePersonalDetails) {
    sections.push(`{\\Huge\\bfseries\\color{white} ${escapeLatex(resume.fullName || 'Your Name')}}\\\\[0.3em]`);
    
    if (resume.jobTitle) {
      sections.push(`{\\large\\color{gold} ${escapeLatex(resume.jobTitle)}}\\\\[0.5em]`);
    }

    sections.push(`\\vspace{1cm}\n`);

    const contactInfo: string[] = [];
    if (resume.email) contactInfo.push(escapeLatex(resume.email));
    if (resume.phone) contactInfo.push(escapeLatex(resume.phone));
    
    if (contactInfo.length > 0) {
      sections.push(`{\\color{navy} ${contactInfo.join(' | ')}}\\\\[0.5em]`);
    }

    if (resume.summary) {
      sections.push(`\\vspace{0.5em}\n${escapeLatex(resume.summary)}\\\\[1em]`);
    }
  }

  if (resume.includeSkills && resume.skills && resume.skills.length > 0) {
    sections.push(`\\section*{CORE COMPETENCIES}`);
    const skillNames = resume.skills.map(s => escapeLatex(s.name)).join(' $\\bullet$ ');
    sections.push(skillNames + '\\\\[0.5em]');
  }

  if (resume.includeExperience && resume.experience && resume.experience.length > 0) {
    sections.push(`\\section*{PROFESSIONAL EXPERIENCE}`);
    
    resume.experience.forEach((exp) => {
      sections.push(`{\\large\\bfseries\\color{navy} ${escapeLatex(exp.position)}}\\\\`);
      sections.push(`{\\bfseries ${escapeLatex(exp.company)}}\\\\`);
      sections.push(`{\\small ${escapeLatex(exp.startDate)} -- ${exp.current ? 'Present' : escapeLatex(exp.endDate)}}\\\\[0.3em]`);
      
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
      sections.push(`{\\bfseries\\color{navy} ${escapeLatex(edu.degree)} in ${escapeLatex(edu.field)}}\\\\`);
      sections.push(`{\\bfseries ${escapeLatex(edu.institution)}}\\\\[0.5em]`);
    });
  }

  sections.push('\\end{document}');
  
  return sections.join('\n');
}