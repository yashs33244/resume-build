// hooks/useUserStatus.ts
import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isPaidSelector, userStatusAtom } from '../store/userStatusAtom';


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


// Global request tracking
let activeRequest: Promise<UserDetails> | null = null;

export const useUserStatus = (): UseUserStatusReturn => {
  const { data: session, status: sessionStatus } = useSession();
  const [userStatus, setUserStatus] = useRecoilState(userStatusAtom);
  const isPaid = useRecoilValue(isPaidSelector);
  const lastFetchRef = useRef<number>(0);

  const fetchUserDetails = async () => {
    try {
      if (sessionStatus === 'loading') return;
      if (!session?.user?.email) {
        setUserStatus(prev => ({ ...prev, user: null, isLoading: false }));
        return;
      }

      const CACHE_DURATION = 60 * 1000; // 1 minute
      // Check cache first
      const now = Date.now();
      if (
        userStatus.user &&
        userStatus.lastFetched &&
        now - userStatus.lastFetched < CACHE_DURATION
      ) {
        return;
      }
      

      // If there's already an active request, use it instead of making a new one
      if (!activeRequest) {
        activeRequest = fetch('/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch user details');
          }
          return response.json();
        });

        // Clear the active request after it completes
        activeRequest.finally(() => {
          activeRequest = null;
        });
      }

      setUserStatus(prev => ({ ...prev, isLoading: true }));
      
      const userData = await activeRequest;

      setUserStatus({
        user: userData,
        isLoading: false,
        error: null,
        lastFetched: now,
      });

    } catch (err) {
      setUserStatus(prev => ({
        ...prev,
        error: err instanceof Error ? err : new Error('Unknown error occurred'),
        isLoading: false,
      }));
    }
  };

  useEffect(() => {
    if (sessionStatus !== 'loading' && !userStatus.user) {
      fetchUserDetails();
    }
  }, [sessionStatus, session?.user?.email]);

  return {
    user: userStatus.user,
    isLoading: userStatus.isLoading || sessionStatus === 'loading',
    error: userStatus.error,
    isPaid,
    refetchUser: fetchUserDetails,
  };
};