import { Express } from 'express';
import authRoutes from './auth.routes';
import resumeRoutes from './resume.routes';

export function registerRoutes(app: Express): void {
  app.use('/api/auth', authRoutes);
  
  app.use('/api/resumes', resumeRoutes);
}

export default registerRoutes;
