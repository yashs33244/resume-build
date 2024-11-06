import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { ResumeState } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../lib/auth';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const { resumeData, template } = await request.json();

  if (!session?.user?.email || !resumeData || !template) {
    return NextResponse.json({ message: 'Invalid input or user not authenticated' }, { status: 400 });
  }

  try {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User does not exist' }, { status: 404 });
    }

    const now = new Date();

    // Check if achievement has title and description
    const achievementData = resumeData.achievement;
    let achievementCreateData = undefined;
    if (achievementData) {
      
      achievementCreateData = {
        title: achievementData.title || "" ,
        description: achievementData.description || "", // Optional
      };
    }

    // Create new resume
    const resume = await db.resume.create({
      data: {
        userId: user.id,
        state: ResumeState.EDITING,
        templateId: template,
        createdAt: now,
        updatedAt: null,
        education: {
          create: resumeData.education,
        },
        experience: {
          create: resumeData.experience,
        },
        skills: {
          create: resumeData.skills.map((skill: string) => ({ name: skill })),
        },
        coreSkills: {
          create: (resumeData.coreSkills ?? []).map((skill: string) => ({ name: skill })),
        },
        languages: {
          create: (resumeData.languages ?? []).map((language: string) => ({ name: language })),
        },
        projects: {
          create: resumeData.projects,
        },
        certificates: {
          create: resumeData.certificates,
        },
        personalInfo: {
          create: resumeData.personalInfo,
        },
        achievement: achievementCreateData ? {
          create: achievementCreateData,
        } : undefined,
      },
    });

    return NextResponse.json({ message: 'New resume saved successfully', resumeId: resume.id }, { status: 200 });
  } catch (error) {
    console.error('Error saving new resume:', error);
    return NextResponse.json({ message: 'Error saving new resume', error }, { status: 500 });
  }
}
