// hooks/useResumeDraft.ts
import { useCallback, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
import { ResumeProps } from '../types/ResumeProps';

export const useResumeDraft = (
  resumeId: string,
  resumeData: ResumeProps,
  setResumeData: (data: ResumeProps) => void
) => {
  const saveDraftDebounced = useRef(
    debounce(async (data: ResumeProps) => {
      try {
        await fetch('/api/resume/draft', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resumeId,
            content: data,
          }),
        });
      } catch (error) {
        console.error('Error saving draft:', error);
      }
    }, 1000) // 1 second delay
  ).current;

  const fetchDraft = useCallback(async () => {
    try {
      const response = await fetch(`/api/resume/draft?resumeId=${resumeId}`);
      const { draft } = await response.json();
      
      if (draft?.content) {
        setResumeData(draft.content);
      }
    } catch (error) {
      console.error('Error fetching draft:', error);
    }
  }, [resumeId, setResumeData]);

  useEffect(() => {
    fetchDraft();
  }, [fetchDraft]);

  useEffect(() => {
    if (resumeData) {
      saveDraftDebounced(resumeData);
    }

    return () => {
      saveDraftDebounced.cancel();
    };
  }, [resumeData, saveDraftDebounced]);

  return { fetchDraft };
};