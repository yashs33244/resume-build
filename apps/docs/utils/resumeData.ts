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
  achievement: {
    title: "",
    description: ""
  },
  languages: [], // Optional: You can populate this later
  certificates: [], // Optional: You can populate this later
  //@ts-ignore
  state: "", // Added the missing 'state' field
  templateId: "" // Added the missing 'templateId' field
};
