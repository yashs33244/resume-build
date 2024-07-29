// types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      jwtToken?: string | null;
    };
  }

  interface User {
    id: string;
    jwtToken?: string | null;
  }
}
