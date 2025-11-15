import { Request, Response } from 'express';
import { resumeService } from '../services/resume.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { insertResumeSchema, updateResumeSchema } from '@shared/schema';
import { generateResumePDF } from '../pdf-generator';

export class ResumeController {
  async getCurrentResume(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      
      const resume = await resumeService.getCurrentResume(userId);
      
      if (!resume) {
        res.status(404).json({ message: 'No resume found' });
        return;
      }
      
      res.json(resume);
    } catch (error) {
      console.error('Error fetching current resume:', error);
      res.status(500).json({ message: 'Failed to fetch resume' });
    }
  }

  async getAllResumes(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      
      const resumes = await resumeService.getResumesByUserId(userId);
      
      res.json(resumes);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      res.status(500).json({ message: 'Failed to fetch resumes' });
    }
  }

  async getResumeById(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      const { id } = req.params;
      
      const resume = await resumeService.getResumeById(id, userId);
      
      if (!resume) {
        res.status(404).json({ message: 'Resume not found' });
        return;
      }
      
      res.json(resume);
    } catch (error) {
      console.error('Error fetching resume:', error);
      res.status(500).json({ message: 'Failed to fetch resume' });
    }
  }

  async createResume(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      
      const validatedData = insertResumeSchema.parse({
        ...req.body,
        userId,
      });
      
      const resume = await resumeService.createResume(validatedData);
      
      res.status(201).json(resume);
    } catch (error: any) {
      console.error('Error creating resume:', error);
      
      if (error.name === 'ZodError') {
        res.status(400).json({ message: 'Invalid resume data', errors: error.errors });
        return;
      }
      
      res.status(500).json({ message: 'Failed to create resume' });
    }
  }

  async updateResume(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      const { id } = req.params;
      
      const validatedData = updateResumeSchema.parse(req.body);
      
      const resume = await resumeService.updateResume(id, userId, validatedData);
      
      if (!resume) {
        res.status(404).json({ message: 'Resume not found or access denied' });
        return;
      }
      
      res.json(resume);
    } catch (error: any) {
      console.error('Error updating resume:', error);
      
      if (error.name === 'ZodError') {
        res.status(400).json({ message: 'Invalid resume data', errors: error.errors });
        return;
      }
      
      res.status(500).json({ message: 'Failed to update resume' });
    }
  }

  async deleteResume(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      const { id } = req.params;
      
      const deleted = await resumeService.deleteResume(id, userId);
      
      if (!deleted) {
        res.status(404).json({ message: 'Resume not found or access denied' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting resume:', error);
      res.status(500).json({ message: 'Failed to delete resume' });
    }
  }

  async downloadResume(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      const { resumeId } = req.body;
      
      const resume = await resumeService.getResumeById(resumeId, userId);
      
      if (!resume) {
        res.status(404).json({ message: 'Resume not found' });
        return;
      }
      
      const pdfBuffer = await generateResumePDF(resume);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${resume.fullName || 'resume'}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error downloading resume:', error);
      res.status(500).json({ message: 'Failed to download resume' });
    }
  }
}

export const resumeController = new ResumeController();
