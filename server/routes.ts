// API Routes with JWT Authentication
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, type AuthRequest } from "./auth";
import { insertResumeSchema, updateResumeSchema } from "@shared/schema";
import { generateResumePDF } from "./pdf-generator";
import { generateLatexSource } from "./latex-generator";
import latex from "node-latex";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup JWT authentication routes
  setupAuth(app);

  // Resume routes - all protected with authentication
  
  // Get current resume (most recently updated)
  app.get("/api/resumes/current", isAuthenticated, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
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
  app.get("/api/resumes", isAuthenticated, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      const resumeList = await storage.getResumesByUserId(userId);
      res.json(resumeList);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ message: "Failed to fetch resumes" });
    }
  });

  // Get specific resume
  app.get("/api/resumes/:id", isAuthenticated, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
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
  app.post("/api/resumes", isAuthenticated, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
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
  app.patch("/api/resumes/:id", isAuthenticated, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
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
  app.delete("/api/resumes/:id", isAuthenticated, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      const { id } = req.params;
      
      await storage.deleteResume(id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting resume:", error);
      res.status(500).json({ message: "Failed to delete resume" });
    }
  });

  // Download resume as PDF (using PDFKit)
  app.post("/api/resumes/download", isAuthenticated, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      const { resumeId } = req.body;
      
      console.log('Download PDF request:', { userId, resumeId, body: req.body });
      
      if (!resumeId) {
        console.error('No resumeId provided');
        return res.status(400).json({ message: "Resume ID is required" });
      }
      
      const resume = await storage.getResume(resumeId);
      
      console.log('Resume fetched:', resume ? 'Found' : 'Not found');
      
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      // Verify ownership
      if (resume.userId !== userId) {
        console.error('Ownership mismatch:', { resumeUserId: resume.userId, requestUserId: userId });
        return res.status(403).json({ message: "Forbidden" });
      }
      
      console.log('Generating PDF...');
      const pdfBuffer = await generateResumePDF(resume);
      console.log('PDF generated, size:', pdfBuffer.length);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${resume.fullName || 'Resume'}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: "Failed to generate PDF", error: String(error) });
    }
  });

  // Download resume as PDF (using LaTeX)
  app.post("/api/resumes/download-latex", isAuthenticated, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      const { resumeId } = req.body;
      
      console.log('Download LaTeX PDF request:', { userId, resumeId });
      
      if (!resumeId) {
        return res.status(400).json({ message: "Resume ID is required" });
      }
      
      const resume = await storage.getResume(resumeId);
      
      console.log('Resume fetched for LaTeX:', resume ? 'Found' : 'Not found');
      
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      // Verify ownership
      if (resume.userId !== userId) {
        console.error('LaTeX ownership mismatch:', { resumeUserId: resume.userId, requestUserId: userId });
        return res.status(403).json({ message: "Forbidden" });
      }
      
      console.log('Generating LaTeX source...');
      const latexSource = generateLatexSource(resume);
      console.log('LaTeX source generated, length:', latexSource.length);
      
      // Generate PDF from LaTeX
      const pdfStream = latex(latexSource, {
        inputs: process.cwd(),
        cmd: 'pdflatex',
        passes: 2
      });
      
      const chunks: Buffer[] = [];
      let streamEnded = false;
      
      pdfStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });
      
      pdfStream.once('end', () => {
        if (!streamEnded) {
          streamEnded = true;
          const pdfBuffer = Buffer.concat(chunks);
          console.log('LaTeX PDF generated, size:', pdfBuffer.length);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename="${resume.fullName || 'Resume'}_latex.pdf"`);
          res.send(pdfBuffer);
        }
      });
      
      pdfStream.once('error', (err: Error) => {
        if (!streamEnded) {
          streamEnded = true;
          console.error("LaTeX PDF generation error:", err);
          if (!res.headersSent) {
            res.status(500).json({ message: "Failed to generate PDF from LaTeX. Please ensure LaTeX is installed on the server.", error: String(err) });
          }
        }
        pdfStream.destroy();
      });
      
    } catch (error) {
      console.error("Error generating LaTeX PDF:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Failed to generate PDF", error: String(error) });
      }
    }
  });

  // Download LaTeX source code
  app.post("/api/resumes/download-latex-source", isAuthenticated, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.id;
      const { resumeId } = req.body;
      
      if (!resumeId) {
        return res.status(400).json({ message: "Resume ID is required" });
      }
      
      const resume = await storage.getResume(resumeId);
      
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      // Verify ownership
      if (resume.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const latexSource = generateLatexSource(resume);
      
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${resume.fullName || 'Resume'}.tex"`);
      res.send(latexSource);
    } catch (error) {
      console.error("Error generating LaTeX source:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Failed to generate LaTeX source" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
