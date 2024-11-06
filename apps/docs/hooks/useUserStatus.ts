// hooks/useUserStatus.ts
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export type UserDetails = {
  id: string;
  email: string;
  name: string | null;
  status: 'FREE' | 'PAID';
  profilePhoto: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type UseUserStatusReturn = {
  user: UserDetails | null;
  isLoading: boolean;
  error: Error | null;
  isPaid: boolean;
  refetchUser: () => Promise<void>;
};

export const useUserStatus = (): UseUserStatusReturn => {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!session?.user?.email) {
        setUser(null);
        return;
      }

      const response = await fetch('/api/user');
      
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData: UserDetails = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [session?.user?.email]);

  return {
    user,
    isLoading,
    error,
    isPaid: user?.status === 'PAID',
    refetchUser: fetchUserDetails
  };
};