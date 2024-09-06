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
    {
      institution: "Liceria University",
      start: "2009",
      end: "2012",
      degree: "Bachelor of Computer Technology"
    },
    {
      institution: "Oxford University",
      start: "2012",
      end: "2015",
      degree: "Master of Computer Science - Software Engineering"
    }
  ],
  experience: [
    {
      company: "Facebook",
      role: "Lead UI/UX Designer",
      start: "SEP 2022",
      end: "PRESENT",
      responsibilities: [
        "Led the design direction and created custom UI assets...",
        "Managed numerous cross-discipline workshops..."
      ]
    }
  ],
  skills: [], // Added the required 'skills' field as an empty array
  coreSkills: [
    "User Research", "Wireframing", "Prototyping"
  ],
  techSkills: [
    "JavaScript", "TypeScript", "React"
  ],
  achievement: {
    title: "Bestfolios, 2022",
    description: "Editor's Pick for Best Design Portfolio"
  },
  languages: [], // Optional: You can populate this later
  certificate: [] // Optional: You can populate this later
};
