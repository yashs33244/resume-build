import { useMemo } from "react";
import { ResumeProps } from "../types/ResumeProps";
import { ResumeState as PrismaResumeState } from "@prisma/client";
import { ResumeState } from "../types/ResumeProps";
export const useTransformResumeData = (resumeData: any): ResumeProps | null => {
    return useMemo(() => {
      if (!resumeData || resumeData.length === 0) return null;
  
      const data = resumeData[0]; // Assuming the data comes as an array
  
      return {
        userId: data.resumeId, // Assuming resumeId as userId
        personalInfo: data.personalInfo || null,
        education: data.education,
        experience: data.experience.map(exp => ({
          company: exp.company,
          role: exp.role,
          start: exp.start,
          end: exp.end,
          responsibilities: exp.responsibilities, // assuming already an array of strings
          current: exp.current,
        })),
        skills: data.skills || [],
        coreSkills: data.coreSkills || [],
        techSkills: data.techSkills || [],
        languages: data.languages || [],
        achievement: data.achievement || null,
        projects: data.projects || [],
        state: data.state as PrismaResumeState as ResumeState, // Ensure it's cast to ResumeState
        templateId: data.templateId,
      };
    }, [resumeData]);
  };