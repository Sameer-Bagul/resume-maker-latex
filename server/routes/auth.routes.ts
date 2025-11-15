import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { isAuthenticated } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', (req, res) => authController.register(req, res));

router.post('/login', (req, res) => authController.login(req, res));

router.get('/user', isAuthenticated, (req, res) => authController.getCurrentUser(req, res));

router.post('/logout', (req, res) => authController.logout(req, res));

export default router;
