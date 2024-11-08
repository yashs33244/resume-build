import { useEffect, useRef, useState } from 'react';
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

const CACHE_DURATION = 60 * 1000; // 1 minute

export const useUserStatus = (): UseUserStatusReturn => {
  const { data: session, status: sessionStatus } = useSession();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<{
    data: UserDetails | null;
    timestamp: number | null;
  }>({ data: null, timestamp: null });

  const fetchUserDetails = async () => {
    try {
      if (sessionStatus === 'loading') return;
      if (!session?.user?.email) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Check cache first
      if (
        cacheRef.current.data &&
        cacheRef.current.timestamp &&
        Date.now() - cacheRef.current.timestamp < CACHE_DURATION
      ) {
        setUser(cacheRef.current.data);
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData: UserDetails = await response.json();
      setUser(userData);

      // Update cache
      cacheRef.current = { data: userData, timestamp: Date.now() };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sessionStatus !== 'loading') {
      fetchUserDetails();
    }
  }, [session]);

  return {
    user,
    isLoading: isLoading || sessionStatus === 'loading',
    error,
    isPaid: user?.status === 'PAID',
    refetchUser: fetchUserDetails,
  };
};