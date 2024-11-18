import { useState, useCallback } from 'react';
import { ResumeProps, ResumeState } from '../types/ResumeProps';

export type ProgressPhase = 'upload' | 'parsing' | 'complete';

interface UseResumeUploadProps {
  onUploadSuccess: (resumeData: ResumeProps) => Promise<void>;
}

export const useResumeUpload = ({ onUploadSuccess }: UseResumeUploadProps) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progressPhase, setProgressPhase] = useState<ProgressPhase>('upload');
  const [progress, setProgress] = useState(0);

  const simulateProgress = useCallback((startFrom: number, endAt: number, duration: number) => {
    let start = startFrom;
    const increment = (endAt - startFrom) / (duration / 100);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= endAt) {
        clearInterval(timer);
        setProgress(endAt);
      } else {
        setProgress(Math.round(start));
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const processSkills = (skills: string[]) => {
    return Array.from(new Set(skills.filter((skill) => skill.trim())));
  };

  const formatBulletPoints = (points: string[]) => {
    return points.map((point) => {
      const trimmedPoint = point.trim();
      const withoutArticles = trimmedPoint.replace(/^(the|a|an)\s+/i, '');
      return withoutArticles.charAt(0).toUpperCase() + withoutArticles.slice(1);
    });
  };

  const handleFileUpload = async (file: File) => {
    if (file) {
      setIsLoading(true);
      setError('');
      setProgressPhase('upload');
      setProgress(0);

      try {
        const formData = new FormData();
        formData.append('resume', file);
        simulateProgress(0, 40, 1000);

        const response = await fetch('/api/resume/parseResume', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to process the resume. Server responded with status ${response.status}`);
        }

        const parsedData = await response.json();
        setProgressPhase('parsing');
        simulateProgress(40, 90, 1500);

        const resumeData: ResumeProps = {
          resumeId: parsedData.resumeId || 'resume-id',
          createdAt: parsedData.createdAt || new Date().toISOString(),
          updatedAt: parsedData.updatedAt || new Date().toISOString(),
          userId: parsedData.userId || 'user-id',
          personalInfo: {
            name: parsedData.personalInfo?.name || '',
            title: parsedData.personalInfo?.title || '',
            email: parsedData.personalInfo?.email || '',
            phone: parsedData.personalInfo?.phone || '',
            location: parsedData.personalInfo?.location || '',
            linkedin: parsedData.personalInfo?.linkedin || '',
            website: parsedData.personalInfo?.website || '',
            bio: parsedData.personalInfo?.bio || '',
          },
          education: parsedData.education?.map((edu: any) => ({
            institution: edu.institution || '',
            major: edu.major || '',
            start: edu.start || '',
            end: edu.end || '',
            degree: edu.degree || '',
            score: edu.score || null,
          })) || [],
          experience: parsedData.experience?.map((exp: any) => ({
            company: exp.company || '',
            role: exp.role || '',
            start: exp.start || '',
            end: exp.end || '',
            responsibilities: formatBulletPoints(exp.responsibilities || []),
            current: exp.current || false,
          })) || [],
          
          skills: processSkills(parsedData.skills || []),
          
          coreSkills: processSkills(parsedData.coreSkills || []),
          
          languages: processSkills(parsedData.languages || []),
          
          projects: parsedData.projects?.map((proj: any) => ({
            name: proj.name || '',
            link: proj.link || '',
            start: proj.start || '',
            end: proj.end || '',
            responsibilities: formatBulletPoints(proj.responsibilities || []),
          })) || [],
          certificates: parsedData.certificates?.map((cert: any) => ({
            name: cert.name || '',
            issuer: cert.issuer || '',
            issuedOn: cert.issuedOn || '',
          })) || [],
          state: ResumeState.EDITING,
          templateId: parsedData.templateId || 'default-template',
        };

        setProgressPhase('complete');
        simulateProgress(90, 100, 300);
        console.log('Resume data from parse:', resumeData);  

        localStorage.setItem('resumeDataa', JSON.stringify(resumeData));
        await onUploadSuccess(resumeData);
      } catch (error) {
        console.error('Error in file upload:', error);
        setError(error instanceof Error ? error.message : 'Failed to process the resume.');
      } finally {
        setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
          setProgressPhase('upload');
        }, 500);
      }
    }
  };

  return {
    error,
    isLoading,
    progress,
    progressPhase,
    handleFileUpload,
  };
};