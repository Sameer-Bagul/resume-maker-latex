import type { Resume } from "@shared/schema";
import PDFDocument from "pdfkit";
import { Readable } from "stream";

export async function generateResumePDF(resume: Resume): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    const template = resume.templateId || 'modern';
    
    switch (template) {
      case 'modern':
        generateModernTemplate(doc, resume);
        break;
      case 'classic':
        generateClassicTemplate(doc, resume);
        break;
      case 'minimal':
        generateMinimalTemplate(doc, resume);
        break;
      case 'executive':
        generateExecutiveTemplate(doc, resume);
        break;
      default:
        generateModernTemplate(doc, resume);
    }

    doc.end();
  });
}

function generateModernTemplate(doc: PDFKit.PDFDocument, resume: Resume) {
  const accentColor = '#BFFF0B';
  const darkGray = '#333333';
  const mediumGray = '#666666';
  const lightGray = '#999999';
  
  let yPosition = doc.y;

  if (resume.includePersonalDetails) {
    doc.fontSize(24)
       .fillColor(darkGray)
       .font('Helvetica-Bold')
       .text(resume.fullName || '', { align: 'left' });
    
    yPosition = doc.y + 5;
    
    if (resume.jobTitle) {
      doc.fontSize(14)
         .fillColor(mediumGray)
         .font('Helvetica')
         .text(resume.jobTitle, { align: 'left' });
      yPosition = doc.y + 10;
    }

    const contactInfo: string[] = [];
    if (resume.email) contactInfo.push(resume.email);
    if (resume.phone) contactInfo.push(resume.phone);
    if (resume.location) contactInfo.push(resume.location);
    
    if (contactInfo.length > 0) {
      doc.fontSize(10)
         .fillColor(mediumGray)
         .text(contactInfo.join(' | '), { align: 'left' });
      yPosition = doc.y + 10;
    }

    if (resume.summary) {
      doc.fontSize(10)
         .fillColor(darkGray)
         .text(resume.summary, { align: 'left', lineGap: 2 });
      yPosition = doc.y + 20;
    } else {
      yPosition += 10;
    }
  }

  function addSectionHeader(title: string) {
    if (yPosition > 700) {
      doc.addPage();
      yPosition = 50;
    }
    
    doc.fontSize(14)
       .fillColor(darkGray)
       .font('Helvetica-Bold')
       .text(title, 50, yPosition);
    
    doc.moveTo(50, yPosition + 18)
       .lineTo(562, yPosition + 18)
       .strokeColor(accentColor)
       .lineWidth(2)
       .stroke();
    
    yPosition = doc.y + 10;
  }

  if (resume.includeSkills && resume.skills && resume.skills.length > 0) {
    addSectionHeader('SKILLS');
    
    const skillNames = resume.skills.map(s => s.name).join(' • ');
    doc.fontSize(10)
       .fillColor(darkGray)
       .font('Helvetica')
       .text(skillNames, { lineGap: 2 });
    
    yPosition = doc.y + 15;
  }

  if (resume.includeExperience && resume.experience && resume.experience.length > 0) {
    addSectionHeader('WORK EXPERIENCE');
    
    resume.experience.forEach((exp, index) => {
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }
      
      doc.fontSize(12)
         .fillColor(darkGray)
         .font('Helvetica-Bold')
         .text(`${exp.position} - ${exp.company}`, 50, yPosition);
      
      const dateRange = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
      doc.fontSize(10)
         .fillColor(mediumGray)
         .font('Helvetica')
         .text(dateRange, 450, yPosition, { width: 112, align: 'right' });
      
      yPosition = doc.y + 5;
      
      if (exp.location) {
        doc.fontSize(10)
           .fillColor(lightGray)
           .text(exp.location, 50, yPosition);
        yPosition = doc.y + 5;
      }
      
      exp.responsibilities.forEach(resp => {
        doc.fontSize(10)
           .fillColor(darkGray)
           .font('Helvetica')
           .text('• ' + resp, 60, yPosition, { width: 502, lineGap: 2 });
        yPosition = doc.y + 3;
      });
      
      yPosition += 10;
    });
    
    yPosition += 5;
  }

  if (resume.includeEducation && resume.education && resume.education.length > 0) {
    addSectionHeader('EDUCATION');
    
    resume.education.forEach((edu) => {
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }
      
      doc.fontSize(12)
         .fillColor(darkGray)
         .font('Helvetica-Bold')
         .text(`${edu.degree} in ${edu.field}`, 50, yPosition);
      
      const dateRange = `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`;
      doc.fontSize(10)
         .fillColor(mediumGray)
         .font('Helvetica')
         .text(dateRange, 450, yPosition, { width: 112, align: 'right' });
      
      yPosition = doc.y + 5;
      
      doc.fontSize(10)
         .fillColor(mediumGray)
         .text(edu.institution, 50, yPosition);
      yPosition = doc.y + 3;
      
      if (edu.gpa) {
        doc.fontSize(10)
           .fillColor(lightGray)
           .text(`GPA: ${edu.gpa}`, 50, yPosition);
        yPosition = doc.y + 3;
      }
      
      yPosition += 10;
    });
    
    yPosition += 5;
  }

  if (resume.includeProjects && resume.projects && resume.projects.length > 0) {
    addSectionHeader('PROJECTS');
    
    resume.projects.forEach((project) => {
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }
      
      doc.fontSize(12)
         .fillColor(darkGray)
         .font('Helvetica-Bold')
         .text(project.title, 50, yPosition);
      yPosition = doc.y + 5;
      
      doc.fontSize(10)
         .fillColor(darkGray)
         .font('Helvetica')
         .text(project.description, { lineGap: 2 });
      yPosition = doc.y + 3;
      
      if (project.techStack && project.techStack.length > 0) {
        doc.fontSize(9)
           .fillColor(mediumGray)
           .text(`Technologies: ${project.techStack.join(', ')}`, { lineGap: 2 });
        yPosition = doc.y + 3;
      }
      
      if (project.url) {
        doc.fontSize(9)
           .fillColor('#0066CC')
           .text(project.url, { link: project.url });
        yPosition = doc.y + 3;
      }
      
      yPosition += 10;
    });
    
    yPosition += 5;
  }

  if (resume.includeAchievements && resume.achievements && resume.achievements.length > 0) {
    addSectionHeader('ACHIEVEMENTS');
    
    resume.achievements.forEach((achievement) => {
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }
      
      doc.fontSize(10)
         .fillColor(darkGray)
         .font('Helvetica')
         .text('• ' + achievement, 60, yPosition, { width: 502, lineGap: 2 });
      yPosition = doc.y + 3;
    });
    
    yPosition += 15;
  }

  if (resume.includeSocialLinks && (resume.githubUrl || resume.linkedinUrl || resume.youtubeUrl || resume.portfolioUrl)) {
    addSectionHeader('LINKS');
    
    const links: Array<{label: string, url: string}> = [];
    if (resume.githubUrl) links.push({ label: 'GitHub', url: resume.githubUrl });
    if (resume.linkedinUrl) links.push({ label: 'LinkedIn', url: resume.linkedinUrl });
    if (resume.youtubeUrl) links.push({ label: 'YouTube', url: resume.youtubeUrl });
    if (resume.portfolioUrl) links.push({ label: 'Portfolio', url: resume.portfolioUrl });
    
    links.forEach(link => {
      doc.fontSize(10)
         .fillColor(darkGray)
         .font('Helvetica-Bold')
         .text(`${link.label}: `, 50, yPosition, { continued: true })
         .fillColor('#0066CC')
         .font('Helvetica')
         .text(link.url, { link: link.url });
      yPosition = doc.y + 5;
    });
  }
}

function generateClassicTemplate(doc: PDFKit.PDFDocument, resume: Resume) {
  const darkGray = '#333333';
  const mediumGray = '#666666';
  
  let yPosition = doc.y;

  if (resume.includePersonalDetails) {
    doc.fontSize(22)
       .fillColor(darkGray)
       .font('Times-Bold')
       .text(resume.fullName || '', { align: 'center' });
    
    if (resume.jobTitle) {
      doc.fontSize(12)
         .fillColor(mediumGray)
         .font('Times-Italic')
         .text(resume.jobTitle, { align: 'center' });
    }

    const contactInfo: string[] = [];
    if (resume.email) contactInfo.push(resume.email);
    if (resume.phone) contactInfo.push(resume.phone);
    if (resume.location) contactInfo.push(resume.location);
    
    if (contactInfo.length > 0) {
      doc.fontSize(10)
         .fillColor(mediumGray)
         .font('Times-Roman')
         .text(contactInfo.join(' | '), { align: 'center' });
    }

    if (resume.summary) {
      doc.moveDown(0.5);
      doc.fontSize(10)
         .fillColor(darkGray)
         .font('Times-Roman')
         .text(resume.summary, { align: 'justify', lineGap: 2 });
    }
    
    yPosition = doc.y + 20;
  }

  function addSectionHeader(title: string) {
    if (yPosition > 700) {
      doc.addPage();
      yPosition = 50;
    }
    
    doc.fontSize(14)
       .fillColor(darkGray)
       .font('Times-Bold')
       .text(title.toUpperCase(), 50, yPosition);
    
    doc.moveTo(50, yPosition + 18)
       .lineTo(562, yPosition + 18)
       .strokeColor('#000000')
       .lineWidth(1)
       .stroke();
    
    yPosition = doc.y + 10;
  }

  if (resume.includeSkills && resume.skills && resume.skills.length > 0) {
    addSectionHeader('Skills');
    const skillNames = resume.skills.map(s => s.name).join(', ');
    doc.fontSize(10)
       .fillColor(darkGray)
       .font('Times-Roman')
       .text(skillNames);
    yPosition = doc.y + 15;
  }

  if (resume.includeExperience && resume.experience && resume.experience.length > 0) {
    addSectionHeader('Professional Experience');
    
    resume.experience.forEach((exp) => {
      if (yPosition > 700) { doc.addPage(); yPosition = 50; }
      
      doc.fontSize(11)
         .fillColor(darkGray)
         .font('Times-Bold')
         .text(`${exp.position}`, 50, yPosition);
      
      doc.fontSize(10)
         .font('Times-Italic')
         .text(`${exp.company}`, { continued: true })
         .font('Times-Roman')
         .text(` | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`);
      
      yPosition = doc.y + 5;
      
      exp.responsibilities.forEach(resp => {
        doc.fontSize(10)
           .font('Times-Roman')
           .text('• ' + resp, 60, yPosition, { width: 502 });
        yPosition = doc.y + 3;
      });
      
      yPosition += 10;
    });
  }

  if (resume.includeEducation && resume.education && resume.education.length > 0) {
    addSectionHeader('Education');
    
    resume.education.forEach((edu) => {
      if (yPosition > 700) { doc.addPage(); yPosition = 50; }
      
      doc.fontSize(11)
         .fillColor(darkGray)
         .font('Times-Bold')
         .text(`${edu.degree} in ${edu.field}`, 50, yPosition);
      
      doc.fontSize(10)
         .font('Times-Italic')
         .text(edu.institution, { continued: true })
         .font('Times-Roman')
         .text(` | ${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`);
      
      if (edu.gpa) {
        doc.text(`GPA: ${edu.gpa}`);
      }
      
      yPosition = doc.y + 10;
    });
  }

  if (resume.includeProjects && resume.projects && resume.projects.length > 0) {
    addSectionHeader('Projects');
    
    resume.projects.forEach((project) => {
      if (yPosition > 700) { doc.addPage(); yPosition = 50; }
      
      doc.fontSize(11)
         .font('Times-Bold')
         .text(project.title, 50, yPosition);
      
      yPosition = doc.y + 3;
      
      doc.fontSize(10)
         .font('Times-Roman')
         .text(project.description);
      
      yPosition = doc.y + 10;
    });
  }

  if (resume.includeAchievements && resume.achievements && resume.achievements.length > 0) {
    addSectionHeader('Achievements');
    
    resume.achievements.forEach((achievement) => {
      doc.fontSize(10)
         .font('Times-Roman')
         .text('• ' + achievement, 60, yPosition, { width: 502 });
      yPosition = doc.y + 3;
    });
  }
}

function generateMinimalTemplate(doc: PDFKit.PDFDocument, resume: Resume) {
  const black = '#000000';
  
  let yPosition = doc.y;

  if (resume.includePersonalDetails) {
    doc.fontSize(20)
       .fillColor(black)
       .font('Helvetica-Bold')
       .text(resume.fullName || '', { align: 'left' });
    
    if (resume.jobTitle) {
      doc.fontSize(11)
         .font('Helvetica')
         .text(resume.jobTitle);
    }

    const contactInfo: string[] = [];
    if (resume.email) contactInfo.push(resume.email);
    if (resume.phone) contactInfo.push(resume.phone);
    
    if (contactInfo.length > 0) {
      doc.fontSize(9)
         .text(contactInfo.join(' • '));
    }

    if (resume.summary) {
      doc.moveDown(0.5);
      doc.fontSize(9)
         .font('Helvetica')
         .text(resume.summary);
    }
    
    yPosition = doc.y + 20;
  }

  function addSectionHeader(title: string) {
    if (yPosition > 700) {
      doc.addPage();
      yPosition = 50;
    }
    
    doc.fontSize(11)
       .fillColor(black)
       .font('Helvetica-Bold')
       .text(title.toUpperCase(), 50, yPosition);
    
    yPosition = doc.y + 8;
  }

  if (resume.includeSkills && resume.skills && resume.skills.length > 0) {
    addSectionHeader('Skills');
    const skillNames = resume.skills.map(s => s.name).join(' • ');
    doc.fontSize(9)
       .font('Helvetica')
       .text(skillNames);
    yPosition = doc.y + 12;
  }

  if (resume.includeExperience && resume.experience && resume.experience.length > 0) {
    addSectionHeader('Experience');
    
    resume.experience.forEach((exp) => {
      if (yPosition > 700) { doc.addPage(); yPosition = 50; }
      
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text(exp.position, 50, yPosition);
      
      doc.fontSize(9)
         .font('Helvetica')
         .text(`${exp.company} | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`);
      
      yPosition = doc.y + 3;
      
      exp.responsibilities.forEach(resp => {
        doc.fontSize(9)
           .text('• ' + resp, 60, yPosition, { width: 502 });
        yPosition = doc.y + 2;
      });
      
      yPosition += 8;
    });
  }

  if (resume.includeEducation && resume.education && resume.education.length > 0) {
    addSectionHeader('Education');
    
    resume.education.forEach((edu) => {
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text(`${edu.degree} in ${edu.field}`, 50, yPosition);
      
      doc.fontSize(9)
         .font('Helvetica')
         .text(`${edu.institution} | ${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`);
      
      yPosition = doc.y + 8;
    });
  }
}

function generateExecutiveTemplate(doc: PDFKit.PDFDocument, resume: Resume) {
  const navy = '#1a2332';
  const gold = '#d4af37';
  
  let yPosition = 80;

  doc.rect(0, 0, 612, 70).fill(navy);

  if (resume.includePersonalDetails) {
    doc.fontSize(26)
       .fillColor('#FFFFFF')
       .font('Helvetica-Bold')
       .text(resume.fullName || '', 50, 20, { align: 'left' });
    
    if (resume.jobTitle) {
      doc.fontSize(13)
         .fillColor(gold)
         .font('Helvetica')
         .text(resume.jobTitle, 50, 48);
    }

    yPosition = 90;

    const contactInfo: string[] = [];
    if (resume.email) contactInfo.push(resume.email);
    if (resume.phone) contactInfo.push(resume.phone);
    
    if (contactInfo.length > 0) {
      doc.fontSize(10)
         .fillColor(navy)
         .text(contactInfo.join(' | '), 50, yPosition);
      yPosition += 20;
    }

    if (resume.summary) {
      doc.fontSize(10)
         .fillColor('#333333')
         .font('Helvetica')
         .text(resume.summary, { lineGap: 2 });
      yPosition = doc.y + 20;
    }
  }

  function addSectionHeader(title: string) {
    if (yPosition > 700) {
      doc.addPage();
      yPosition = 50;
    }
    
    doc.fontSize(13)
       .fillColor(navy)
       .font('Helvetica-Bold')
       .text(title.toUpperCase(), 50, yPosition);
    
    doc.moveTo(50, yPosition + 18)
       .lineTo(200, yPosition + 18)
       .strokeColor(gold)
       .lineWidth(2)
       .stroke();
    
    yPosition = doc.y + 12;
  }

  if (resume.includeSkills && resume.skills && resume.skills.length > 0) {
    addSectionHeader('Core Competencies');
    const skillNames = resume.skills.map(s => s.name).join(' • ');
    doc.fontSize(10)
       .fillColor('#333333')
       .font('Helvetica')
       .text(skillNames);
    yPosition = doc.y + 18;
  }

  if (resume.includeExperience && resume.experience && resume.experience.length > 0) {
    addSectionHeader('Professional Experience');
    
    resume.experience.forEach((exp) => {
      if (yPosition > 700) { doc.addPage(); yPosition = 50; }
      
      doc.fontSize(12)
         .fillColor(navy)
         .font('Helvetica-Bold')
         .text(exp.position, 50, yPosition);
      
      doc.fontSize(11)
         .fillColor('#666666')
         .font('Helvetica-Bold')
         .text(exp.company);
      
      doc.fontSize(9)
         .fillColor('#999999')
         .font('Helvetica')
         .text(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`);
      
      yPosition = doc.y + 5;
      
      exp.responsibilities.forEach(resp => {
        doc.fontSize(10)
           .fillColor('#333333')
           .text('• ' + resp, 60, yPosition, { width: 502 });
        yPosition = doc.y + 3;
      });
      
      yPosition += 12;
    });
  }

  if (resume.includeEducation && resume.education && resume.education.length > 0) {
    addSectionHeader('Education');
    
    resume.education.forEach((edu) => {
      doc.fontSize(11)
         .fillColor(navy)
         .font('Helvetica-Bold')
         .text(`${edu.degree} in ${edu.field}`, 50, yPosition);
      
      doc.fontSize(10)
         .fillColor('#666666')
         .font('Helvetica')
         .text(edu.institution);
      
      yPosition = doc.y + 10;
    });
  }
}
