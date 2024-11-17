import { useEffect } from 'react';
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

  const fetchUserDetails = async () => {
    try {
      if (sessionStatus === 'loading') return;
      if (!session?.user?.email) {
        setUserStatus((prev) => ({ ...prev, user: null, isLoading: false }));
        return;
      }

      // Avoid duplicate requests by reusing activeRequest
      if (!activeRequest) {
        activeRequest = fetch('/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch user details');
          }
          return response.json();
        });

        activeRequest.finally(() => {
          activeRequest = null;
        });
      }

      setUserStatus((prev) => ({ ...prev, isLoading: true }));

      const userData = await activeRequest;

      // Always update with fresh data
      setUserStatus({
        user: userData,
        isLoading: false,
        error: null,
        lastFetched: null, // Remove caching mechanism
      });
    } catch (err) {
      setUserStatus((prev) => ({
        ...prev,
        error: err instanceof Error ? err : new Error('Unknown error occurred'),
        isLoading: false,
      }));
    }
  };

  useEffect(() => {
    if (sessionStatus !== 'loading') {
      fetchUserDetails(); // Fetch fresh data every time
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
