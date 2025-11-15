// Mongoose Schema for Resume Maker Application
import mongoose, { Schema, Model, Document } from 'mongoose';
import { z } from 'zod';

// ==================== User Schema ====================
export interface IUser extends Document {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  profileImageUrl: { type: String },
}, {
  timestamps: true,
});

// Prevent password from being returned in queries by default
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  }
});

export const User = mongoose.model<IUser>('User', userSchema);

export type UserType = IUser;

// ==================== Resume Schema ====================

// Skill sub-schema
export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.string().optional(),
  level: z.string().optional(),
});

export type Skill = z.infer<typeof skillSchema>;

// Education sub-schema
export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field of study is required"),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean().default(false),
  gpa: z.string().optional(),
  description: z.string().optional(),
});

export type Education = z.infer<typeof educationSchema>;

// Project sub-schema
export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Description is required"),
  techStack: z.array(z.string()),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean().default(false),
  url: z.string().optional(),
  githubUrl: z.string().optional(),
});

export type Project = z.infer<typeof projectSchema>;

// Experience sub-schema
export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean().default(false),
  location: z.string().optional(),
  responsibilities: z.array(z.string()),
});

export type Experience = z.infer<typeof experienceSchema>;

// Resume interface
export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  
  // Personal Details
  fullName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  photoUrl?: string;
  
  // Section visibility toggles
  includePersonalDetails: boolean;
  includeSkills: boolean;
  includeEducation: boolean;
  includeProjects: boolean;
  includeExperience: boolean;
  includeAchievements: boolean;
  includeSocialLinks: boolean;
  
  // Resume sections
  skills: Skill[];
  education: Education[];
  projects: Project[];
  experience: Experience[];
  achievements: string[];
  
  // Social Links
  githubUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  portfolioUrl?: string;
  
  // Template
  templateId: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, default: 'My Resume' },
  
  // Personal Details
  fullName: { type: String },
  jobTitle: { type: String },
  email: { type: String },
  phone: { type: String },
  location: { type: String },
  summary: { type: String },
  photoUrl: { type: String },
  
  // Section visibility
  includePersonalDetails: { type: Boolean, default: true },
  includeSkills: { type: Boolean, default: true },
  includeEducation: { type: Boolean, default: true },
  includeProjects: { type: Boolean, default: true },
  includeExperience: { type: Boolean, default: true },
  includeAchievements: { type: Boolean, default: true },
  includeSocialLinks: { type: Boolean, default: true },
  
  // Resume sections (as arrays of embedded documents)
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
  
  // Social Links
  githubUrl: String,
  linkedinUrl: String,
  youtubeUrl: String,
  portfolioUrl: String,
  
  // Template
  templateId: { type: String, default: 'modern' },
}, {
  timestamps: true,
});

// Create indexes for better query performance
resumeSchema.index({ userId: 1, createdAt: -1 });
resumeSchema.index({ userId: 1, updatedAt: -1 });

export const Resume = mongoose.model<IResume>('Resume', resumeSchema);

export type ResumeType = IResume;
export type Resume = IResume; // Add this type alias for component imports

// Zod validation schemas for API requests
export const insertResumeSchema = z.object({
  userId: z.string(),
  title: z.string().default('My Resume'),
  fullName: z.string().optional(),
  jobTitle: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().optional(),
  photoUrl: z.string().optional(),
  includePersonalDetails: z.boolean().default(true),
  includeSkills: z.boolean().default(true),
  includeEducation: z.boolean().default(true),
  includeProjects: z.boolean().default(true),
  includeExperience: z.boolean().default(true),
  includeAchievements: z.boolean().default(true),
  includeSocialLinks: z.boolean().default(true),
  skills: z.array(skillSchema).default([]),
  education: z.array(educationSchema).default([]),
  projects: z.array(projectSchema).default([]),
  experience: z.array(experienceSchema).default([]),
  achievements: z.array(z.string()).default([]),
  githubUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),
  templateId: z.string().default('modern'),
});

export const updateResumeSchema = insertResumeSchema.partial().omit({ userId: true });

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type UpdateResume = z.infer<typeof updateResumeSchema>;
