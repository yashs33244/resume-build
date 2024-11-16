// atoms/userStatusAtom.ts
import { atom, selector } from 'recoil';
import { UserDetails } from '../hooks/useUserStatus'; // adjust path as needed

export const userStatusAtom = atom<{
  user: UserDetails | null;
  isLoading: boolean;
  error: Error | null;
  lastFetched: number | null;
}>({
  key: 'userStatusAtom',
  default: {
    user: null,
    isLoading: true,
    error: null,
    lastFetched: null,
  },
});

export const isPaidSelector = selector({
  key: 'isPaidSelector',
  get: ({get}) => {
    const userStatus = get(userStatusAtom);
    return userStatus.user?.status === 'PAID';
  },
});