import { db } from "../db";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { JWTPayload, SignJWT, importJWK } from "jose";
import { Session as NextAuthSession } from "next-auth";

interface Token extends JWT {
  uid: string;
  jwtToken: string;
}

export interface CustomSession extends NextAuthSession {
  user: {
    id: string;
    jwtToken: string;
    email: string;
    name: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

const generateJWT = async (payload: JWTPayload) => {
  const secret = process.env.JWT_SECRET || "secret";

  const jwk = await importJWK({ k: secret, alg: "HS256", kty: "oct" });

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(jwk);

  return jwt;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "email", type: "text", placeholder: "" },
        password: { label: "password", type: "password", placeholder: "" },
      },
      async authorize(credentials: any) {
        console.log("Authorize function called with:", credentials.username);
      
        if (!credentials.username || !credentials.password) {
          console.log("Missing username or password");
          return null;
        }
      
        try {
          const userDb = await db.user.findFirst({
            where: {
              email: credentials.username,
            },
            select: {
              password: true,
              id: true,
              name: true,
            },
          });
      
          console.log("User found in DB:", userDb ? "Yes" : "No");
      
          if (userDb) {
            // Existing user - verify password
            const isValidPassword = await bcrypt.compare(credentials.password, userDb.password);
            console.log("Password valid:", isValidPassword);
      
            if (isValidPassword) {
              const jwt = await generateJWT({
                id: userDb.id,
              });
      
              return {
                id: userDb.id,
                name: userDb.name,
                email: credentials.username,
                token: jwt,
              };
            } else {
              console.log("Invalid password");
              return null;
            }
          } else {
            // New user - create account
            console.log("Creating new user");
            if (credentials.username.length < 3 || credentials.password.length < 3) {
              console.log("Username or password too short");
              return null;
            }
      
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            const user = await db.user.create({
              data: {
                email: credentials.username,
                name: credentials.username,
                password: hashedPassword,
              },
            });
      
            console.log("New user created:", user.id);
      
            const jwt = await generateJWT({
              id: user.id,
            });
      
            return {
              id: user.id,
              name: credentials.username,
              email: credentials.username,
              token: jwt,
            };
          }
        } catch (e) {
          console.error("Error in authorize function:", e);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
      authorization: {
        params: { scope: "yashs33244@gmail.com" },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),

  ],
  secret: process.env.NEXTAUTH_SECRET || "secr3t",
  callbacks: {
    session: async ({ session, token }) => {
      const newSession: CustomSession = session as CustomSession;
      if (newSession.user && token.uid) {
        newSession.user.id = token.uid as string;
        newSession.user.jwtToken = token.jwtToken as string;
      }
      return newSession!;
    },
    jwt: async ({ token, user }): Promise<JWT> => {
      const newToken = token as Token;

      if (user) {
        newToken.uid = user.id;
        newToken.jwtToken = (user as User).token;
      }
      return newToken;
    },
    //@ts-ignore
    async signIn({ user, account, profile, url}) {
      if (account?.provider === 'google') {
        // Check if the user already exists
        const userDb = await db.user.findUnique({
          where: { email: user.email as string },
        });

        if (!userDb) {
          // Create a new user if they don't exist
          const newUser = await db.user.create({
            data: {
              email: user.email as string,
              name: user.name as string,
              password: 'GOOGLE_AUTH_' + Math.random().toString(36).slice(-8),
              // You might want to handle Google-specific logic here
              // For simplicity, we're just creating a record without a password
            },
          });

          const jwt = await generateJWT({
            id: newUser.id,
          });

          return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            token: jwt,
          };
        }

        // User already exists, return the existing user
        const jwt = await generateJWT({
          id: userDb.id,
        });

        return {
          id: userDb.id,
          name: userDb.name,
          email: userDb.email,
          token: jwt,
        };
      }
      const callbackUrl = url.split("callbackUrl=")[1];
      return callbackUrl;

      return true; // Allow sign-in if not using Google provider
    },
    async redirect({ url, baseUrl }) {
      // Always log the incoming URL and baseUrl for debugging
      console.log("Redirect callback - URL:", url);
      console.log("Redirect callback - BaseUrl:", baseUrl);

      // If the URL starts with the base URL, allow it
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Handle callback URLs
      if (url.startsWith('/api/auth/callback')) {
        return `${baseUrl}/dashboard`;
      }

      // If there's a callback URL in the parameters
      if (url.includes('callbackUrl')) {
        const callbackUrl = new URL(url).searchParams.get('callbackUrl');
        if (callbackUrl?.startsWith(baseUrl)) {
          return callbackUrl;
        }
      }

      // Default to dashboard
      return `${baseUrl}/dashboard`;
    }
    
    
  },    
  pages: {
    signIn: '/signin',
    signOut: '/',
    error: '/auth/error',
  },
};
