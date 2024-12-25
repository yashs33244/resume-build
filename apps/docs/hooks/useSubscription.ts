import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDownload } from './useDownload';
import { useUserStatus } from './useUserStatus';
import { ResumeProps } from '../types/ResumeProps';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface UseSubscriptionProps {
  userId: string;
  resumeData: ResumeProps;
}

export const useSubscription = ({ userId, resumeData }: UseSubscriptionProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create the download handler using the useDownload hook


  const handleSubscription = useCallback(async (selectedPack: '30' | '90') => {
    try {
      setLoading(true);
      setError(null);

      // Map the selected pack to the plan ID
      const planId = selectedPack === '30' ? '30-day-plan' : '90-day-plan';

      // Create order on the server
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Load Razorpay SDK
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);

      // Wait for the script to load
      await new Promise((resolve) => {
        script.onload = resolve;
      });

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'finalCV',
        description: `${selectedPack} Days Subscription`,
        order_id: data.orderId,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            // Verify payment on the server
            const verificationResponse = await fetch('/api/subscription/confirm', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId,
                paymentDetails: {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                },
                planId,
              }),
            });

            const verificationData = await verificationResponse.json();

            if (!verificationResponse.ok) {
              throw new Error(verificationData.error || 'Payment verification failed');
            }

            // Redirect to dashboard on success
            router.push('/dashboard');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Payment verification failed');
          }
        },
        prefill: {
          name: '', // Add user's name if available
          email: '', // Add user's email if available
          contact: '', // Add user's contact if available
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          },
        },
        theme: {
          color: '#F37254',
        },
      };

      // Initialize Razorpay
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  }, [userId, router]);

  return {
    handleSubscription,
    loading,
    error,
  };
};