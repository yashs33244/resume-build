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
    session: null,
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

      // Call the API route to create a Razorpay order
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
        throw new Error(data.error || 'Failed to create Razorpay order');
      }

      // Extract the order ID from the response
      const { orderId, amount, currency } = data;

      // Trigger Razorpay payment modal
      const razorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Razorpay public key
        amount: amount, // Amount in paise (e.g., 499 INR = 49900 paise)
        currency: currency,
        order_id: orderId,
        name: 'Your Company Name',
        description: `Subscription Plan: ${selectedPack === "30" ? "30 Days" : "90 Days"}`,
        handler: async (response: any) => {
          // Call the API to confirm the payment and create the subscription
          await confirmPaymentAndCreateSubscription(response, selectedPack);
        },
        prefill: {
          name: '', // Prefill name from user if available
          email: '', // Prefill email from user if available
        },
        theme: {
          color: '#F37254',
        },
      };

      const razorpay = new (window as any).Razorpay(razorpayOptions);
      razorpay.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [userId, resumeData, router]);

  // Function to confirm payment and create subscription
  const confirmPaymentAndCreateSubscription = async (paymentResponse: any, selectedPack: '30' | '90') => {
    try {
      setLoading(true);
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = paymentResponse;

      // Send the payment details to the backend to verify the payment
      const confirmationResponse = await fetch('/api/subscription/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          paymentDetails: {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
          },
          planId: selectedPack === '30' ? '30-day-plan' : '90-day-plan',
        }),
      });

      const confirmationData = await confirmationResponse.json();

      if (!confirmationResponse.ok) {
        throw new Error(confirmationData.error || 'Failed to confirm payment');
      }

      // Payment successful, create the subscription
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during payment confirmation');
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
