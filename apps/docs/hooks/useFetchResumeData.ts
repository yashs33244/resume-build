import { useState, useEffect } from 'react';
import { ResumeProps } from '../types/ResumeProps';

interface FetchResumeDataResponse {
  data: ResumeProps | null;
  loading: boolean;
  error: string | null;
}

export const useFetchResumeData = (resumeId: string): FetchResumeDataResponse => {
  const [data, setData] = useState<ResumeProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId) {
        setError('No resume ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/resume/getResume?resumeId=${resumeId}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const resumeData: ResumeProps = await response.json();
        setData(resumeData);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching the resume');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  return { data, loading, error };
};
