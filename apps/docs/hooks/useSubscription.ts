import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseSubscriptionProps {
  userId: string;
}

export const  useSubscription = ({ userId }: UseSubscriptionProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscription = async (selectedPack: '30' | '90') => {
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

      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubscription,
    loading,
    error,
  };
};