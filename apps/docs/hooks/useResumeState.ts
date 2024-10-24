import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResumeProps } from '../types/ResumeProps';

interface UseResumeStateReturn {
  resumes: ResumeProps[];
  isLoading: boolean;
  error: string | null;
}

export const useResumeState = (): UseResumeStateReturn => {
  const [resumes, setResumes] = useState<ResumeProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await fetch(`/api/resume/resumestatus`);
        if (!res.ok) {
          throw new Error('Failed to fetch resume status');
        }

        const data = await res.json();
        console.log('Fetched Resumes:', data);

        // Check if data is empty or null
        if (!data || data.length === 0) {
          console.log('No resumes found, redirecting to create-preference');
          router.push('/create-preference');
          setResumes([]);
          return;
        }

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
        setError(error instanceof Error ? error.message : 'Failed to load resumes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumes();
  }, [router]);

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

  return { resumes, isLoading, error };
};