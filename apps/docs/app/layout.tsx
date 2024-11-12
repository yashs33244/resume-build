import { ReactNode } from "react";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@repo/ui/lib/utils";
import type { Metadata } from "next";
import "@repo/ui/globals.css";
import { Providers } from "./providers";
import ConditionalHeader from "../components/ConditionalHeader";
import ConditionalFooter from "../components/ConditionalFooter";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.finalcv.com/"), // Replace with your actual domain
  title: {
    default: "FinalCV - Professional Resume Builder | Create Your CV Online",
    template: "%s | FinalCV",
  },
  description:
    "Create professional resumes and CVs instantly with FinalCV. Free online resume builder with modern templates, AI-powered suggestions, and expert tips. Build your perfect CV today.",
  applicationName: "FinalCV - Resume Builder",
  authors: [
    {
      name: "Yash Singh",
      url: "https://twitter.com/yashs3324",
    },
    {
      name: "Prakhar Gupta",
    },
    {
      name: "Mehul Chaudhary",
    },
  ],
  generator: "Next.js",
  keywords: [
    "resume builder",
    "CV maker",
    "online resume creator",
    "professional CV generator",
    "free resume builder",
    "job application tools",
    "career development",
    "resume templates",
    "CV templates",
    "resume writing",
    "resume tips",
    "job search tools",
    "professional resume",
    "ATS-friendly resume",
    "resume formatting",
    "career advancement",
    "job application",
    "employment tools",
    "resume design",
    "CV design",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Favicon configuration
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/favicon.ico",
        color: "#1B2432",
      },
    ],
  },

  manifest: "/site.webmanifest",

  // Open Graph metadata
  openGraph: {
    type: "website",
    siteName: "FinalCV",
    title: "FinalCV - Create Professional Resumes Instantly",
    description:
      "Build your perfect resume with FinalCV. Professional templates, AI assistance, and expert tips to help you land your dream job.",
    url: "https://www.finalcv.com/",
    locale: "en_IN",
    images: [
      {
        url: "/favicon.png", // Add your OG image in public folder
        width: 1200,
        height: 630,
        alt: "FinalCV - Professional Resume Builder",
      },
    ],
  },

  // Twitter metadata
  twitter: {
    card: "summary_large_image",
    site: "@yashs3324",
    creator: "@yashs3324",
    title: "FinalCV - Create Professional Resumes Instantly",
    description:
      "Build your perfect resume with FinalCV. Professional templates, AI assistance, and expert tips to help you land your dream job.",
    images: ["/twitter-image.png"], // Add your Twitter card image in public folder
  },

  // Additional metadata
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    minimumScale: 1,
  },
  themeColor: "#1B2432",

  // // Verification for search consoles
  // verification: {
  //   google: "your-google-site-verification", // Add your Google verification code
  //   yandex: "your-yandex-verification",
  //   yahoo: "your-yahoo-verification",
  // },

  // Alternative languages
  alternates: {
    canonical: "https://www.finalcv.com/",
    languages: {
      "en-US": "https://www.finalcv.com/",
      "hi-IN": "https://www.finalcv.com/",
    },
  },

  // Additional structured data
  other: {
    "google-site-verification": "your-google-verification-code", // Replace with actual code
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* LinkedIn Profile Link */}
        <link
          rel="me"
          href="https://www.linkedin.com/in/yash-singh-2757aa1b4/"
        />
        {/* Twitter Profile Link */}
        <link rel="me" href="https://twitter.com/yashs3324" />
      </head>
      <body
        className={cn("min-h-screen font-sans antialiased", fontSans.variable)}
      >
        <Providers>
          <ConditionalHeader />
          <div style={{ background: "#1B2432" }}>{children}</div>
          <ConditionalFooter />
        </Providers>
      </body>
    </html>
  );
}
