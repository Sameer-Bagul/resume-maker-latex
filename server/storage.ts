// Reference: Replit Auth integration and PostgreSQL database integration
import {
  users,
  resumes,
  type User,
  type UpsertUser,
  type Resume,
  type InsertResume,
  type UpdateResume,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (MANDATORY for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Resume operations
  getResume(id: string): Promise<Resume | undefined>;
  getResumesByUserId(userId: string): Promise<Resume[]>;
  getCurrentResume(userId: string): Promise<Resume | undefined>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: string, userId: string, data: UpdateResume): Promise<Resume | undefined>;
  deleteResume(id: string, userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations (MANDATORY for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Resume operations
  async getResume(id: string): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    return resume;
  }

  async getResumesByUserId(userId: string): Promise<Resume[]> {
    return await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId))
      .orderBy(desc(resumes.updatedAt));
  }

  async getCurrentResume(userId: string): Promise<Resume | undefined> {
    const [resume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId))
      .orderBy(desc(resumes.updatedAt))
      .limit(1);
    return resume;
  }

  async createResume(resumeData: InsertResume): Promise<Resume> {
    const [resume] = await db.insert(resumes).values(resumeData).returning();
    return resume;
  }

  async updateResume(
    id: string,
    userId: string,
    data: UpdateResume
  ): Promise<Resume | undefined> {
    const [resume] = await db
      .update(resumes)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)))
      .returning();
    return resume;
  }

  async deleteResume(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)));
    return true;
  }
}

export const storage = new DatabaseStorage();
