import { useCallback, useEffect, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import { ResumeProps } from '../types/ResumeProps';

interface SaveDraftResponse {
  success: boolean;
  message?: string;
  draft?: {
    content: ResumeProps;
    updatedAt: string;
  };
}

export const useResumeDraft = (
  resumeId: string | undefined,
  data: ResumeProps,
  setResumeData: (data: ResumeProps) => void
) => {
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const isInitialMount = useRef(true);
  const lastSavedData = useRef('');

  // Debounced save function
  const saveDraftDebounced = useRef(
    debounce(async (data: ResumeProps) => {
      if (!resumeId) return;

      const currentDataString = JSON.stringify(data);
      if (currentDataString === lastSavedData.current) {
        return;
      }

      try {
        setSaveStatus('saving');
        const payload = {
          resumeId,
          content: data  // templateId is already part of the content
        };

        const response = await fetch('/api/resume/saveResume/draft', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to save draft');
        }

        const result: SaveDraftResponse = await response.json();
        
        if (result.draft?.content) {
          setResumeData(result.draft.content);
          lastSavedData.current = JSON.stringify(result.draft.content);
        }

        setSaveStatus('saved');
      } catch (error) {
        console.error('Error saving draft:', error);
        setSaveStatus('error');
      }
    }, 5000)
  ).current;

  // Fetch initial draft
  const fetchDraft = useCallback(async () => {
    if (!resumeId) return;

    try {
      setSaveStatus('saving');
      const response = await fetch(`/api/resume/saveResume/draft?resumeId=${resumeId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch draft');
      }

      const result: SaveDraftResponse = await response.json();
      
      if (result.draft?.content) {
        setResumeData(result.draft.content);
        lastSavedData.current = JSON.stringify(result.draft.content);
      }
      
      setSaveStatus('saved');
    } catch (error) {
      console.error('Error fetching draft:', error);
      setSaveStatus('error');
    }
  }, [resumeId, setResumeData]);

  // Effect for saving drafts
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (resumeId && data) {
      saveDraftDebounced(data);
    }

    return () => {
      saveDraftDebounced.cancel();
    };
  }, [data, saveDraftDebounced, resumeId]);

  return {
    saveStatus,
    fetchDraft
  };
};