import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../lib/auth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    console.log("API route hit");
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { resumeData } = await req.json();
    console.log("Received data:", JSON.stringify(resumeData, null, 2));

    const email = session.user.email || resumeData.personalInfo.email;

    // Find or create user
    let user = await prisma.user.upsert({
      where: { email: email },
      update: {
        name: session.user.name || resumeData.personalInfo.name,
      },
      create: {
        id: session.user.id,
        email: email,
        name: session.user.name || resumeData.personalInfo.name,
        password: 'temporary-password', // Note: Implement proper password handling
      },
    });

    console.log("User upserted:", user);

    console.log("Upserting resume");
    // Find existing resume for the user
    const existingResume = await prisma.resume.findFirst({
      where: { userId: user.id }
    });

    // Create or update resume
    const resume = await prisma.resume.upsert({
      where: { id: existingResume?.id},
      // when the user is created for the first time, resume should have some id 
      update: {
        personalInfo: {
          upsert: {
            create: resumeData.personalInfo,
            update: resumeData.personalInfo,
          },
        },
        education: {
          deleteMany: {},
          create: resumeData.education,
        },
        experience: {
          deleteMany: {},
          create: resumeData.experience,
        },
        skills: {
          deleteMany: {},
          create: resumeData.skills.map((skill: string) => ({ name: skill })),
        },
        achievements: resumeData.achievement ? {
          upsert: {
            create: resumeData.achievement,
            update: resumeData.achievement,
          },
        } : undefined,
        projects: {
          deleteMany: {},
          create: resumeData.projects || [],
        },
        state: 'NOT_DONE_YET',
      },
      create: {
        userId: user.id,
        personalInfo: { create: resumeData.personalInfo },
        education: { create: resumeData.education },
        experience: { create: resumeData.experience },
        skills: { create: resumeData.skills.map((skill: string) => ({ name: skill })) },
        achievements: resumeData.achievement ? { create: resumeData.achievement } : undefined,
        projects: { create: resumeData.projects || [] },
        state: 'NOT_DONE_YET',
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