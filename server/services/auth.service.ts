import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import { env } from '../config/env';

export interface RegisterUserDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

export class AuthService {
  async register(userData: RegisterUserDto): Promise<{ user: UserResponse; token: string }> {
    const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
    
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = new User({
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
    });

    await user.save();

    const token = this.generateToken(user._id.toString());

    return {
      user: this.mapToUserResponse(user),
      token,
    };
  }

  async login(credentials: LoginDto): Promise<{ user: UserResponse; token: string }> {
    const user = await User.findOne({ email: credentials.email.toLowerCase() });

    if (!user || !user.password) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(credentials.password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user._id.toString());

    return {
      user: this.mapToUserResponse(user),
      token,
    };
  }

  async getUserById(id: string): Promise<UserResponse | null> {
    const user = await User.findById(id);
    
    if (!user) {
      return null;
    }

    return this.mapToUserResponse(user);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email: email.toLowerCase() });
  }

  async validateToken(token: string): Promise<{ userId: string } | null> {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
      return decoded;
    } catch (error) {
      return null;
    }
  }

  generateToken(userId: string): string {
    return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '7d' });
  }

  private mapToUserResponse(user: IUser): UserResponse {
    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
    };
  }
}

export const authService = new AuthService();
