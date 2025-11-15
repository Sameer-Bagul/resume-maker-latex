// MongoDB Storage Layer using Mongoose
import {
  User,
  Resume,
  type UserType,
  type ResumeType,
  type InsertResume,
  type UpdateResume,
} from "@shared/schema";
import bcrypt from 'bcryptjs';

export interface IUser {
  _id?: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUpsertUser {
  id?: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

export interface IStorage {
  // User operations
  getUser(id: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  createUser(user: IUpsertUser): Promise<IUser>;
  upsertUser(user: IUpsertUser): Promise<IUser>;
  validatePassword(email: string, password: string): Promise<IUser | null>;
  
  // Resume operations
  getResume(id: string): Promise<any | null>;
  getResumesByUserId(userId: string): Promise<any[]>;
  getCurrentResume(userId: string): Promise<any | null>;
  createResume(resume: InsertResume): Promise<any>;
  updateResume(id: string, userId: string, data: UpdateResume): Promise<any | null>;
  deleteResume(id: string, userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // ==================== User Operations ====================
  
  async getUser(id: string): Promise<IUser | null> {
    try {
      const user = await User.findById(id).lean();
      if (!user) return null;
      
      return {
        _id: (user._id as any).toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email: email.toLowerCase() }).lean();
      if (!user) return null;
      
      return {
        _id: (user._id as any).toString(),
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  async createUser(userData: IUpsertUser): Promise<IUser> {
    try {
      // Hash password if provided
      let hashedPassword = userData.password;
      if (userData.password) {
        hashedPassword = await bcrypt.hash(userData.password, 10);
      }

      const user = new User({
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
      });

      await user.save();

      return {
        _id: (user._id as any).toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async upsertUser(userData: IUpsertUser): Promise<IUser> {
    try {
      const email = userData.email.toLowerCase();
      
      // Check if user exists
      let user = await User.findOne({ email });
      
      if (user) {
        // Update existing user
        if (userData.firstName) user.firstName = userData.firstName;
        if (userData.lastName) user.lastName = userData.lastName;
        if (userData.profileImageUrl) user.profileImageUrl = userData.profileImageUrl;
        if (userData.password) {
          user.password = await bcrypt.hash(userData.password, 10);
        }
        
        await user.save();
      } else {
        // Create new user
        let hashedPassword = userData.password;
        if (userData.password) {
          hashedPassword = await bcrypt.hash(userData.password, 10);
        }

        user = new User({
          email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
        });

        await user.save();
      }

      return {
        _id: (user._id as any).toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error upserting user:', error);
      throw error;
    }
  }

  async validatePassword(email: string, password: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user || !user.password) return null;

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return null;

      return {
        _id: (user._id as any).toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error validating password:', error);
      return null;
    }
  }

  // ==================== Resume Operations ====================
  
  async getResume(id: string): Promise<any | null> {
    try {
      const resume = await Resume.findById(id).lean();
      if (!resume) return null;
      
      return {
        ...resume,
        id: resume._id.toString(),
        userId: resume.userId.toString(),
        _id: undefined,
      };
    } catch (error) {
      console.error('Error getting resume:', error);
      return null;
    }
  }

  async getResumesByUserId(userId: string): Promise<any[]> {
    try {
      const resumes = await Resume.find({ userId })
        .sort({ updatedAt: -1 })
        .lean();
      
      return resumes.map(resume => ({
        ...resume,
        id: resume._id.toString(),
        userId: resume.userId.toString(),
        _id: undefined,
      }));
    } catch (error) {
      console.error('Error getting resumes by userId:', error);
      return [];
    }
  }

  async getCurrentResume(userId: string): Promise<any | null> {
    try {
      const resume = await Resume.findOne({ userId })
        .sort({ updatedAt: -1 })
        .lean();
      
      if (!resume) return null;
      
      return {
        ...resume,
        id: resume._id.toString(),
        userId: resume.userId.toString(),
        _id: undefined,
      };
    } catch (error) {
      console.error('Error getting current resume:', error);
      return null;
    }
  }

  async createResume(resumeData: InsertResume): Promise<any> {
    try {
      const resume = new Resume(resumeData);
      await resume.save();
      
      const resumeObj = resume.toObject();
      return {
        ...resumeObj,
        id: (resumeObj._id as any).toString(),
        userId: resumeObj.userId.toString(),
        _id: undefined,
      };
    } catch (error) {
      console.error('Error creating resume:', error);
      throw error;
    }
  }

  async updateResume(
    id: string,
    userId: string,
    data: UpdateResume
  ): Promise<any | null> {
    try {
      const resume = await Resume.findOneAndUpdate(
        { _id: id, userId },
        { $set: data },
        { new: true, runValidators: true }
      ).lean();
      
      if (!resume) return null;
      
      return {
        ...resume,
        id: resume._id.toString(),
        userId: resume.userId.toString(),
        _id: undefined,
      };
    } catch (error) {
      console.error('Error updating resume:', error);
      return null;
    }
  }

  async deleteResume(id: string, userId: string): Promise<boolean> {
    try {
      const result = await Resume.deleteOne({ _id: id, userId });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting resume:', error);
      return false;
    }
  }
}

export const storage = new DatabaseStorage();
