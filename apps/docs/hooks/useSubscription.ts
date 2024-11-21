import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDownload } from './useDownload';
import { useUserStatus } from './useUserStatus';
import { ResumeProps } from '../types/ResumeProps';

interface UseSubscriptionProps {
  userId: string;
  resumeData: ResumeProps; 
}

export const useSubscription = ({ userId, resumeData }: UseSubscriptionProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isPaid } = useUserStatus();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Create the download handler using the useDownload hook outside of any async function
  const downloadHandler = useDownload({
    isPaid,
    setIsGeneratingPDF,
    resumeData: resumeData,
  });

  // Use useCallback to memoize the subscription handler
  const handleSubscription = useCallback(async (selectedPack: '30' | '90') => {
    try {
      setLoading(true);
      setError(null);

      // Map the selected pack to the plan ID
      const planId = selectedPack === '30' ? '30-day-plan' : '90-day-plan';

      // Call the API route to create subscription
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          planId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create subscription');
      }

      // Conditionally download if paid
      if (response.ok) {
        console.log('Downloading resume...'); 
        downloadHandler(resumeData.resumeId, resumeData.templateId);
      }
      
      router.push('/dashboard');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [userId, isPaid, resumeData, router, downloadHandler]);

  return {
    handleSubscription,
    loading,
    error,
  };
};