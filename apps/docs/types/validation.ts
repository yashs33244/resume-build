import { z } from "zod";

// Define the validation schema for personal information
export const personalInfoSchema = z.object({
  name: z.string()
    .min(1, "Full name is required")
    .max(100, "Name must be less than 100 characters"),
  
  title: z.string()
    .min(1, "Job title is required")
    .max(100, "Job title must be less than 100 characters"),
  
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^[+]?[\d\s-]+$/, "Invalid phone number format"),
  
  linkedin: z.string()
    .url("Invalid LinkedIn URL")
    .regex(/linkedin\.com/, "Must be a LinkedIn URL")
    .optional()
    .or(z.literal("")),
  
  website: z.string()
    .url("Invalid URL")
    .optional()
    .or(z.literal("")),
  
  bio: z.string()
    .max(2000, "Bio must be less than 2000 characters")
    .optional()
    .or(z.literal(""))
});

export type PersonalInfoSchema = z.infer<typeof personalInfoSchema>;

// Helper function to validate personal info data
export const validatePersonalInfo = (data: unknown) => {
  return personalInfoSchema.safeParse(data);
};