import { useEffect, useState } from 'react';
import { ResumeProps } from '../types/ResumeProps';

export const useResumeState = () => {
  const [resumes, setResumes] = useState<ResumeProps[]>([]);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await fetch(`/api/resume/resumestatus`);
        if (!res.ok) {
          throw new Error('Failed to fetch resume status');
        }

        const data = await res.json();
        console.log('Resumes:', data);

        const processedResumes = data.map((resume: ResumeProps) => ({
          resumeState: resume.state,
          daysLeft: calculateDaysLeft(resume),
          createDate: new Date(resume.createdAt),
          updateDate: new Date(resume.updatedAt),
          resumeData: {
            resumeId: resume.resumeId,
            personalInfo: resume.personalInfo,
            education: resume.education,
            experience: resume.experience,
            skills: resume.skills,
            coreSkills: resume.coreSkills,
            languages: resume.languages,
            achievement: resume.achievement,
            projects: resume.projects,
            certificates: resume.certificates,
            templateId: resume.templateId,
          },
          template: resume.templateId,
        }));

        setResumes(processedResumes);
      } catch (error) {
        console.error('Error fetching resumes:', error);
        alert('Failed to load resumes. Please try again later.');
      }
    };

    fetchResumes();
  }, []);

  const calculateDaysLeft = (resume: ResumeProps) => {
    if (resume.state === 'DOWNLOAD_SUCCESS') {
      const createdAt = new Date(resume.createdAt);
      const updatedAt = new Date(resume.updatedAt);
      const now = new Date();

      const mostRecentDate = updatedAt > createdAt ? updatedAt : createdAt;
      return Math.max(
        30 - Math.floor((now.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24)),
        0
      );
    }
    return null;
  };

  return resumes;
};
