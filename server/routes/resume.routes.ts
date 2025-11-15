import { Router } from 'express';
import { resumeController } from '../controllers/resume.controller';
import { isAuthenticated } from '../middleware/auth.middleware';

const router = Router();

router.use(isAuthenticated);

router.get('/current', (req, res) => resumeController.getCurrentResume(req, res));

router.get('/', (req, res) => resumeController.getAllResumes(req, res));

router.get('/:id', (req, res) => resumeController.getResumeById(req, res));

router.post('/', (req, res) => resumeController.createResume(req, res));

router.patch('/:id', (req, res) => resumeController.updateResume(req, res));

router.delete('/:id', (req, res) => resumeController.deleteResume(req, res));

router.post('/download', (req, res) => resumeController.downloadResume(req, res));

export default router;
