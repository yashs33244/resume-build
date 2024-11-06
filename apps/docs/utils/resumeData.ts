import { ResumeProps } from '../types/ResumeProps';

export const initialResumeData: ResumeProps = {
  
  templateId: "", // Add the required 'templateId' field
  resumeId: "string",
  userId: "string", 
  personalInfo: {
    name: "",
    title: "",
    website: "",
    email: "",
    phone: "",
    linkedin: "",
    bio: "",
  },
  education: [
  ],
  experience: [
    
  ],
  skills: [], // Added the required 'skills' field as an empty array
  coreSkills: [
    
  ],
  achievement: {
    title: "",
    description: ""
  },
  projects: [
    
  ],
  //@ts-ignore
  state: "", // Add the required 'state' field
  languages: [], // Optional: You can populate this later
  certificates: [] // Optional: You can populate this later
};
