// Schema for Resume Maker Application
// Reference: Replit Auth integration (users, sessions tables are mandatory)

import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (MANDATORY for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (MANDATORY for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Resume storage table
export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull().default("My Resume"),
  
  // Personal Details
  fullName: text("full_name"),
  jobTitle: text("job_title"),
  email: text("email"),
  phone: text("phone"),
  location: text("location"),
  summary: text("summary"),
  photoUrl: text("photo_url"),
  
  // Section visibility toggles
  includePersonalDetails: boolean("include_personal_details").default(true),
  includeSkills: boolean("include_skills").default(true),
  includeEducation: boolean("include_education").default(true),
  includeProjects: boolean("include_projects").default(true),
  includeExperience: boolean("include_experience").default(true),
  includeAchievements: boolean("include_achievements").default(true),
  includeSocialLinks: boolean("include_social_links").default(true),
  
  // Skills (array of skill objects)
  skills: jsonb("skills").$type<Array<{
    name: string;
    category?: string;
    level?: string;
  }>>().default([]),
  
  // Education (array of education entries)
  education: jsonb("education").$type<Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    current: boolean;
    gpa?: string;
    description?: string;
  }>>().default([]),
  
  // Projects (array of project entries)
  projects: jsonb("projects").$type<Array<{
    id: string;
    title: string;
    description: string;
    techStack: string[];
    startDate: string;
    endDate: string;
    current: boolean;
    url?: string;
    githubUrl?: string;
  }>>().default([]),
  
  // Experience (array of experience entries)
  experience: jsonb("experience").$type<Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    location?: string;
    responsibilities: string[];
  }>>().default([]),
  
  // Achievements (array of strings)
  achievements: jsonb("achievements").$type<string[]>().default([]),
  
  // Social Links
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  youtubeUrl: text("youtube_url"),
  portfolioUrl: text("portfolio_url"),
  
  // Template selection
  templateId: text("template_id").default("modern"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  resumes: many(resumes),
}));

export const resumesRelations = relations(resumes, ({ one }) => ({
  user: one(users, {
    fields: [resumes.userId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateResumeSchema = insertResumeSchema.partial();

// Skill schema
export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.string().optional(),
  level: z.string().optional(),
});

// Education schema
export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field of study is required"),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean().default(false),
  gpa: z.string().optional(),
  description: z.string().optional(),
});

// Project schema
export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Description is required"),
  techStack: z.array(z.string()),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean().default(false),
  url: z.string().optional(),
  githubUrl: z.string().optional(),
});

// Experience schema
export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean().default(false),
  location: z.string().optional(),
  responsibilities: z.array(z.string()),
});

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type UpdateResume = z.infer<typeof updateResumeSchema>;
export type Resume = typeof resumes.$inferSelect;
export type Skill = z.infer<typeof skillSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Experience = z.infer<typeof experienceSchema>;
