import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../lib/auth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    console.log("API route hit");
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    console.log("User ID:", userId);

    const { resumeData } = await req.json();
    console.log("Received data:", JSON.stringify(resumeData, null, 2));

    // Check if user exists, if not create a new user
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: resumeData.personalInfo.email,
          name: resumeData.personalInfo.name,
          password: 'temporary-password', // You should implement proper password handling
        },
      });
      console.log("New user created:", user);
    }

    console.log("Upserting resume");
    // Find existing resume for the user
    const existingResume = await prisma.resume.findFirst({
      where: { userId }
    });

    // Create or update resume
    const resume = await prisma.resume.upsert({
      where: { id: existingResume?.id ?? 'new-resume-id' },
      update: {
        personalInfo: {
          upsert: {
            create: {
              name: resumeData.personalInfo.name,
              title: resumeData.personalInfo.title,
              website: resumeData.personalInfo.website,
              email: resumeData.personalInfo.email,
              phone: resumeData.personalInfo.phone,
            },
            update: {
              name: resumeData.personalInfo.name,
              title: resumeData.personalInfo.title,
              website: resumeData.personalInfo.website,
              email: resumeData.personalInfo.email,
              phone: resumeData.personalInfo.phone,
            },
          },
        },
        education: {
          deleteMany: {},
          create: resumeData.education,
        },
        experience: {
          deleteMany: {},
          create: resumeData.experience.map((exp: any) => ({
            ...exp,
            responsibilities: exp.responsibilities,
          })),
        },
        skills: {
          deleteMany: {},
          create: Object.entries(resumeData.skills).map(([name, skills]) => ({
            name,
            skills: skills as string[],
          })),
        },
        achievements: {
          deleteMany: {},
          create: resumeData.achievement ? [resumeData.achievement] : [],
        },
      },
      create: {
        userId,
        personalInfo: { 
          create: {
            name: resumeData.personalInfo.name,
            title: resumeData.personalInfo.title,
            website: resumeData.personalInfo.website,
            email: resumeData.personalInfo.email,
            phone: resumeData.personalInfo.phone,
          }
        },
        education: { create: resumeData.education },
        experience: { 
          create: resumeData.experience.map((exp: any) => ({
            ...exp,
            responsibilities: exp.responsibilities,
          })),
        },
        skills: { 
          create: Object.entries(resumeData.skills).map(([name, skills]) => ({
            name,
            skills: skills as string[],
          })),
        },
        achievements: { 
          create: resumeData.achievement ? [resumeData.achievement] : [],
        },
      },
    });

    console.log("Resume upserted successfully");
    return NextResponse.json({ message: 'Resume saved successfully', resume });
  } catch (error: any) {
    console.error("Error in saveResume API:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json({ message: 'Error saving resume', error: error.message, stack: error.stack }, { status: 500 });
  }
}