import { z } from "zod";
import { ResumeProps, ResumeState } from "./ResumeProps";

// Enum schema
export const ResumeStateSchema = z.enum([
  "NOT_STARTED",
  "EDITING",
  "COMPLETED",
  "DOWNLOADING",
  "DOWNLOAD_SUCCESS",
  "DOWNLOAD_FAILED",
]);

// Personal Info schema
const PersonalInfoSchema = z.object({
  name: z.string().min(3, "Name is required"),
  title: z.string().min(3, "Title is required"),
  website: z.string().url("Invalid URL").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().regex(/^\+?[\d\s-()]{8,}$/, "Invalid phone number").optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  linkedin: z.string().url("Invalid LinkedIn URL").optional(),
  location: z.string().optional(),
}).optional();

// Education schema
const EducationItemSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  major: z.string().min(1, "Major is required"),
  start: z.string().regex(/^\d{4}-\d{2}$/, "Date must be in YYYY-MM format"),
  end: z.string().regex(/^\d{4}-\d{2}$/, "Date must be in YYYY-MM format"),
  degree: z.string().min(1, "Degree is required"),
  score: z.number().min(0).max(10, "Score must be between 0 and 10"),
});

// Experience schema
const ExperienceItemSchema = z.object({
  company: z.string().min(3, "Company name is required"),
  role: z.string().min(3, "Role is required"),
  start: z.string().regex(/^\d{4}-\d{2}$/, "Date must be in YYYY-MM format"),
  end: z.string().regex(/^\d{4}-\d{2}$/, "Date must be in YYYY-MM format")
    .or(z.literal("Present")),
  responsibilities: z.array(z.string().min(1, "Responsibility cannot be empty")),
  current: z.boolean(),
});

// Project schema
const ProjectItemSchema = z.object({
  name: z.string().min(3, "Project name is required"),
  link: z.string().url("Invalid project URL"),
  start: z.string().regex(/^\d{4}-\d{2}$/, "Date must be in YYYY-MM format"),
  end: z.string().regex(/^\d{4}-\d{2}$/, "Date must be in YYYY-MM format"),
  responsibilities: z.array(z.string().min(1, "Responsibility cannot be empty")),
});

// Certificate schema
const CertificateItemSchema = z.object({
  name: z.string().min(1, "Certificate name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issuedOn: z.string().regex(/^\d{4}-\d{2}$/, "Date must be in YYYY-MM format"),
});

// Achievement schema
const AchievementSchema = z.object({
  title: z.string().min(1, "Achievement title is required"),
  description: z.string().min(1, "Achievement description is required"),
}).optional();

// Main Resume schema
export const ResumeSchema = z.object({
  resumeId: z.string().min(1),
  userId: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
  personalInfo: PersonalInfoSchema,
  education: z.array(EducationItemSchema),
  experience: z.array(ExperienceItemSchema),
  skills: z.array(z.string().min(1, "Skill cannot be empty")),
  coreSkills: z.array(z.string().min(1, "Core skill cannot be empty")).optional(),
  languages: z.array(z.string().min(1, "Language cannot be empty")).optional(),
  achievement: AchievementSchema,
  projects: z.array(ProjectItemSchema).optional(),
  certificates: z.array(CertificateItemSchema).optional(),
  state: ResumeStateSchema,
  templateId: z.string().min(1),
});

// Type inference
export type ResumeSchemaType = z.infer<typeof ResumeSchema>;

// Helper function to convert data to match ResumeProps interface
export const convertToResumeProps = (data: z.infer<typeof ResumeSchema>): ResumeProps => {
  return {
    ...data,
    education: data.education || [],
    experience: data.experience || [],
    personalInfo: data.personalInfo || undefined,
    achievement: data.achievement || undefined,
    projects: data.projects || [],
    certificates: data.certificates || [],
    coreSkills: data.coreSkills || [],
    languages: data.languages || [],
    skills: data.skills || [],
    state: data.state as ResumeState,
    templateId: data.templateId,
    
  };
};