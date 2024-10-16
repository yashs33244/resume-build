import { ResumeProps } from '../types/ResumeProps';

export const initialResumeData: ResumeProps = {
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
  techSkills: [
    
  ],
  achievement: {
    title: "",
    description: ""
  },
  languages: [], // Optional: You can populate this later
  certificates: [] // Optional: You can populate this later
};
