import { ResumeProps } from '../types/ResumeProps';

export const initialResumeData: ResumeProps = {
  userId: "string", 
  personalInfo:{
    name: "jebni",
    title: "kjsnef",
    website: "ksjenfks",
    email: "string",
    phone: "string",
    bio: "string",
  },
  education: [
    {
      institution: "Liceria University",
      years: "2009 - 2012",
      degree: "Bachelor of Computer Technology"
    },
    {
      institution: "Oxford University",
      years: "2012 - 2015",
      degree: "Master of Computer Science - Software Engineering"
    }
  ],
  experience: [
    {
      company: "Facebook",
      role: "Lead UI/UX Designer",
      duration: "SEP 2022 - PRESENT",
      responsibilities: [
        "Led the design direction and created custom UI assets...",
        "Managed numerous cross-discipline workshops..."
      ]
    }
  ],
  skills: [
    "User Research", "Wireframing", "Prototyping",
    "Development","JavaScript", "TypeScript", "React"
    ],
  achievement: {
    title: "Bestfolios, 2022",
    description: "Editor's Pick for Best Design Portfolio"
  }
};