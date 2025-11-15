import mongoose, { Schema, Document } from 'mongoose';

export interface Skill {
  name: string;
  category?: string;
  level?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  startDate: string;
  endDate: string;
  current: boolean;
  url?: string;
  githubUrl?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location?: string;
  responsibilities: string[];
}

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  
  fullName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  photoUrl?: string;
  
  includePersonalDetails: boolean;
  includeSkills: boolean;
  includeEducation: boolean;
  includeProjects: boolean;
  includeExperience: boolean;
  includeAchievements: boolean;
  includeSocialLinks: boolean;
  
  skills: Skill[];
  education: Education[];
  projects: Project[];
  experience: Experience[];
  achievements: string[];
  
  githubUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  portfolioUrl?: string;
  
  templateId: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, default: 'My Resume' },
  
  fullName: { type: String },
  jobTitle: { type: String },
  email: { type: String },
  phone: { type: String },
  location: { type: String },
  summary: { type: String },
  photoUrl: { type: String },
  
  includePersonalDetails: { type: Boolean, default: true },
  includeSkills: { type: Boolean, default: true },
  includeEducation: { type: Boolean, default: true },
  includeProjects: { type: Boolean, default: true },
  includeExperience: { type: Boolean, default: true },
  includeAchievements: { type: Boolean, default: true },
  includeSocialLinks: { type: Boolean, default: true },
  
  skills: [{
    name: { type: String, required: true },
    category: String,
    level: String,
  }],
  
  education: [{
    id: { type: String, required: true },
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String, required: true },
    startDate: String,
    endDate: String,
    current: { type: Boolean, default: false },
    gpa: String,
    description: String,
  }],
  
  projects: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [String],
    startDate: String,
    endDate: String,
    current: { type: Boolean, default: false },
    url: String,
    githubUrl: String,
  }],
  
  experience: [{
    id: { type: String, required: true },
    company: { type: String, required: true },
    position: { type: String, required: true },
    startDate: String,
    endDate: String,
    current: { type: Boolean, default: false },
    location: String,
    responsibilities: [String],
  }],
  
  achievements: [String],
  
  githubUrl: String,
  linkedinUrl: String,
  youtubeUrl: String,
  portfolioUrl: String,
  
  templateId: { type: String, default: 'modern' },
}, {
  timestamps: true,
});

resumeSchema.index({ userId: 1, createdAt: -1 });
resumeSchema.index({ userId: 1, updatedAt: -1 });

export const Resume = mongoose.model<IResume>('Resume', resumeSchema);

export default Resume;
