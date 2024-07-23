// interfaces/ResumeProps.ts
export interface ResumeProps {
    name?: string;
    title?: string;
    contact?: {
      website?: string;
      email?: string;
      phone?: string;
    };
    bio?: string;
    education?: {
      institution: string;
      years: string;
      degree: string;
    }[];
    experience?: {
      company: string;
      role: string;
      duration: string;
      responsibilities?: string[];
    }[];
    skills?: {
      [category: string]: string[];
    };
    achievement?: {
      title: string;
      description: string;
    };
  }
  