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
  const lastSavedDataRef = useRef('');
  const saveAttempts = useRef(0);
  const maxRetries = 3;

  const saveDraft = async (data: ResumeProps): Promise<boolean> => {
    if (!resumeId) return false;

    try {
      const payload = {
        resumeId,
        content: data
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
        lastSavedDataRef.current = JSON.stringify(result.draft.content);
        saveAttempts.current = 0;
      }

      return true;
    } catch (error) {
      console.error('Error saving draft:', error);
      return false;
    }
  };

  // Debounced save function with retry logic
  const saveDraftDebounced = useRef(
    debounce(async (data: ResumeProps) => {
      const currentDataString = JSON.stringify(data);
      if (currentDataString === lastSavedDataRef.current) {
        return;
      }

      setSaveStatus('saving');
      
      const success = await saveDraft(data);
      
      if (success) {
        setSaveStatus('saved');
      } else if (saveAttempts.current < maxRetries) {
        saveAttempts.current++;
        // Retry after a delay
        setTimeout(() => {
          saveDraftDebounced(data);
        }, 1000 * saveAttempts.current); // Exponential backoff
      } else {
        setSaveStatus('error');
        saveAttempts.current = 0;
      }
    }, 2000) // Reduced debounce time
  ).current;

  // Fetch initial draft with retry logic
  const fetchDraft = useCallback(async () => {
    if (!resumeId) return;

    let attempts = 0;
    const fetchWithRetry = async (): Promise<void> => {
      try {
        setSaveStatus('saving');
        const response = await fetch(`/api/resume/saveResume/draft?resumeId=${resumeId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch draft');
        }

        const result: SaveDraftResponse = await response.json();
        
        if (result.draft?.content) {
          setResumeData(result.draft.content);
          lastSavedDataRef.current = JSON.stringify(result.draft.content);
        }
        
        setSaveStatus('saved');
      } catch (error) {
        console.error('Error fetching draft:', error);
        if (attempts < maxRetries) {
          attempts++;
          setTimeout(() => {
            fetchWithRetry();
          }, 1000 * attempts);
        } else {
          setSaveStatus('error');
        }
      }
    };

    await fetchWithRetry();
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
    fetchDraft,
    retry: () => {
      if (resumeId && data) {
        saveAttempts.current = 0;
        saveDraftDebounced(data);
      }
    }
  };
};