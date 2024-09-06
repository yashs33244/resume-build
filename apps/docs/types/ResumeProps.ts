export interface ResumeProps {
  userId: string;
  personalInfo: {
    name: string;
    title: string;
    website?: string;
    email?: string;
    phone?: string;
    bio?: string;
    linkedin?: string;
    location?: string;
  };
  education: Array<{
    institution: string;
    start: string;  // Changed 'years' to 'start' and 'end' to match your logic
    end: string;
    degree: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    start: string;
    end: string;
    responsibilities: string[];
  }>;
  skills: string[];  // General skills list
  coreSkills?: string[];  // New for core skills
  techSkills?: string[];  // New for technical skills
  languages?: string[];  // New for languages
  achievement?: {
    title: string;
    description: string;
  } | null;
  projects?: Array<{
    name: string;
    link: string;
    start: string;
    end: string;
    responsibilities: string[];
  }>;
  certificate?: Array<{
    name: string;
    issuer: string;
    issuedOn: string;
  }>;
}
