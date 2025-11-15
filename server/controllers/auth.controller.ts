import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }

      const result = await authService.register({
        email,
        password,
        firstName,
        lastName,
      });

      res.status(201).json(result);
    } catch (error: any) {
      console.error('Register error:', error);
      
      if (error.message.includes('already exists')) {
        res.status(409).json({ message: error.message });
        return;
      }
      
      res.status(500).json({ message: 'Failed to register user' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }

      const result = await authService.login({ email, password });

      res.json(result);
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.message.includes('Invalid email or password')) {
        res.status(401).json({ message: error.message });
        return;
      }
      
      res.status(500).json({ message: 'Failed to login' });
    }
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      
      if (!authReq.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const user = await authService.getUserById(authReq.user.id);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Failed to get user' });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    res.json({ message: 'Logged out successfully' });
  }
}

export const authController = new AuthController();
