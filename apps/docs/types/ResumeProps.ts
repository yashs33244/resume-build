export interface ResumeProps {
  userId: string;
  personalInfo?: {
    name: string;
    title: string;
    website?: string;
    email?: string;
    phone?: string;
    bio?: string;
    linkedin?: string;
    location?: string;
  } | null; // Optional based on the Prisma schema
  education: Array<{
    institution: string;
    start: string;
    end: string;
    degree: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    start: string;
    end: string;
    responsibilities: string[]; // Array of strings
  }>;
  skills: string[]; // General skills list
  coreSkills?: string[]; // Optional core skills
  techSkills?: string[]; // Optional technical skills
  languages?: string[]; // Optional languages
  achievement?: {
    title: string;
    description: string;
  } | null; // Nullable achievement
  projects?: Array<{
    name: string;
    link: string;
    start: string;
    end: string;
    responsibilities: string[]; // Array of strings
  }>;
  certificates?: Array<{
    name: string;
    issuer: string;
    issuedOn: string;
  }>;
  state: ResumeState; // Matches the ResumeState enum
  templateId: string; // Template identifier
}

export enum ResumeState {
  NOT_STARTED = "NOT_STARTED",
  EDITING = "EDITING",
  COMPLETED = "COMPLETED",
  DOWNLOADING = "DOWNLOADING",
  DOWNLOAD_SUCCESS = "DOWNLOAD_SUCCESS",
  DOWNLOAD_FAILED = "DOWNLOAD_FAILED",
}
