import { Resume, IResume } from '../models/resume.model';
import mongoose from 'mongoose';

export interface CreateResumeDto {
  userId: string;
  title?: string;
  fullName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  photoUrl?: string;
  includePersonalDetails?: boolean;
  includeSkills?: boolean;
  includeEducation?: boolean;
  includeProjects?: boolean;
  includeExperience?: boolean;
  includeAchievements?: boolean;
  includeSocialLinks?: boolean;
  skills?: any[];
  education?: any[];
  projects?: any[];
  experience?: any[];
  achievements?: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  portfolioUrl?: string;
  templateId?: string;
}

export interface UpdateResumeDto {
  title?: string;
  fullName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  photoUrl?: string;
  includePersonalDetails?: boolean;
  includeSkills?: boolean;
  includeEducation?: boolean;
  includeProjects?: boolean;
  includeExperience?: boolean;
  includeAchievements?: boolean;
  includeSocialLinks?: boolean;
  skills?: any[];
  education?: any[];
  projects?: any[];
  experience?: any[];
  achievements?: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  portfolioUrl?: string;
  templateId?: string;
}

export class ResumeService {
  async createResume(data: CreateResumeDto): Promise<any> {
    const resume = new Resume({
      ...data,
      userId: new mongoose.Types.ObjectId(data.userId),
    });
    
    await resume.save();
    
    return this.mapToResumeResponse(resume);
  }

  async getResumeById(id: string, userId: string): Promise<any | null> {
    const resume = await Resume.findOne({ _id: id, userId }).lean();
    
    if (!resume) {
      return null;
    }
    
    return this.mapToResumeResponse(resume);
  }

  async getResumesByUserId(userId: string): Promise<any[]> {
    const resumes = await Resume.find({ userId })
      .sort({ updatedAt: -1 })
      .lean();
    
    return resumes.map(resume => this.mapToResumeResponse(resume));
  }

  async getCurrentResume(userId: string): Promise<any | null> {
    const resume = await Resume.findOne({ userId })
      .sort({ updatedAt: -1 })
      .lean();
    
    if (!resume) {
      return null;
    }
    
    return this.mapToResumeResponse(resume);
  }

  async updateResume(id: string, userId: string, data: UpdateResumeDto): Promise<any | null> {
    const resume = await Resume.findOneAndUpdate(
      { _id: id, userId },
      { $set: data },
      { new: true, runValidators: true }
    ).lean();
    
    if (!resume) {
      return null;
    }
    
    return this.mapToResumeResponse(resume);
  }

  async deleteResume(id: string, userId: string): Promise<boolean> {
    const result = await Resume.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }

  async verifyResumeOwnership(resumeId: string, userId: string): Promise<boolean> {
    const resume = await Resume.findOne({ _id: resumeId, userId });
    return !!resume;
  }

  private mapToResumeResponse(resume: any): any {
    return {
      ...resume,
      id: resume._id.toString(),
      userId: resume.userId.toString(),
      _id: undefined,
    };
  }
}

export const resumeService = new ResumeService();
