import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized - No token provided' });
      return;
    }

    const token = authHeader.substring(7);

    const decoded = await authService.validateToken(token);

    if (!decoded) {
      res.status(401).json({ message: 'Unauthorized - Invalid token' });
      return;
    }

    (req as AuthRequest).user = { id: decoded.userId };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
}
