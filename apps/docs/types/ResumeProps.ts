export interface ResumeProps {
  userId: string;
  personalInfo: {
    name: string;
    title: string;
    website?: string;
    email?: string;
    phone?: string;
    bio?: string;
    location?: string;
  };
  education: Array<{
    institution: string;
    years: string;
    degree: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    responsibilities: string[];
  }>;
  skills: {
    [category: string]: string[];
  };
  achievement?: {
    title: string;
    description: string;
  } | null;
  projects?: Array<{
    name: string;
    duration: string;
    description: string[];
  }>;
}
