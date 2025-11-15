// Reference: Replit Auth integration
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertResumeSchema, updateResumeSchema } from "@shared/schema";
import { generateResumePDF } from "./pdf-generator";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware (Reference: Replit Auth integration)
  await setupAuth(app);

  // Auth routes (Reference: Replit Auth integration)
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Resume routes - all protected with authentication
  
  // Get current resume (most recently updated)
  app.get("/api/resumes/current", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getCurrentResume(userId);
      
      if (!resume) {
        return res.status(404).json({ message: "No resume found" });
      }
      
      res.json(resume);
    } catch (error) {
      console.error("Error fetching current resume:", error);
      res.status(500).json({ message: "Failed to fetch resume" });
    }
  });

  // Get all resumes for user
  app.get("/api/resumes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resumeList = await storage.getResumesByUserId(userId);
      res.json(resumeList);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ message: "Failed to fetch resumes" });
    }
  });

  // Get specific resume
  app.get("/api/resumes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const resume = await storage.getResume(id);
      
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      // Verify ownership
      if (resume.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(resume);
    } catch (error) {
      console.error("Error fetching resume:", error);
      res.status(500).json({ message: "Failed to fetch resume" });
    }
  });

  // Create new resume
  app.post("/api/resumes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertResumeSchema.parse({
        ...req.body,
        userId,
      });
      
      const resume = await storage.createResume(validatedData);
      res.status(201).json(resume);
    } catch (error: any) {
      console.error("Error creating resume:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid resume data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create resume" });
    }
  });

  // Update resume
  app.patch("/api/resumes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      const validatedData = updateResumeSchema.parse(req.body);
      
      const resume = await storage.updateResume(id, userId, validatedData);
      
      if (!resume) {
        return res.status(404).json({ message: "Resume not found or access denied" });
      }
      
      res.json(resume);
    } catch (error: any) {
      console.error("Error updating resume:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid resume data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update resume" });
    }
  });

  // Delete resume
  app.delete("/api/resumes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      await storage.deleteResume(id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting resume:", error);
      res.status(500).json({ message: "Failed to delete resume" });
    }
  });

  // Download resume as PDF
  app.post("/api/resumes/download", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { resumeId } = req.body;
      
      const resume = await storage.getResume(resumeId);
      
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      // Verify ownership
      if (resume.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const pdfBuffer = await generateResumePDF(resume);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${resume.fullName || 'Resume'}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
