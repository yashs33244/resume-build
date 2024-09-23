import { NextResponse } from 'next/server';
import { db } from '../../../app/db';
import { ResumeState } from '@prisma/client';

export async function POST(request: Request) {
  const { userId, resumeData, template } = await request.json();

  if (!userId || !resumeData || !template) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  try {
    // Check if the user exists
    const userExists = await db.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json({ message: 'User does not exist' }, { status: 404 });
    }

    // Find an existing resume for the user
    const existingResume = await db.resume.findFirst({
      where: { userId },
    });

    // Create or update resume based on existence
    const resumeDataToSave = {
      state: ResumeState.EDITING,
      templateId: template,
      personalInfo: {
        upsert: {
          create: resumeData.personalInfo ?? { name: '', title: '' },
          update: resumeData.personalInfo ?? { name: '', title: '' },
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
      coreSkills: {
        deleteMany: {},
        create: (resumeData.coreSkills ?? []).map((skill: string) => ({ name: skill })),
      },
      techSkills: {
        deleteMany: {},
        create: (resumeData.techSkills ?? []).map((skill: string) => ({ name: skill })),
      },
      languages: {
        deleteMany: {},
        create: (resumeData.languages ?? []).map((language: string) => ({ name: language })),
      },
      projects: {
        deleteMany: {},
        create: resumeData.projects,
      },
      certificates: {
        deleteMany: {},
        create: resumeData.certificates,
      },
      achievement: resumeData.achievement
        ? {
            upsert: {
              create: resumeData.achievement,
              update: resumeData.achievement,
            },
          }
        : undefined,
      user: {
        connect: { id: userId },
      },
    };

    if (existingResume) {
      // Update existing resume
      await db.resume.update({
        where: { id: existingResume.id },
        data: resumeDataToSave,
      });
    } else {
      // Create a new resume
      await db.resume.create({
        data: {
          userId,
          ...resumeDataToSave,
        },
      });
    }

    return NextResponse.json({ message: 'Resume saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving resume:', error);
    return NextResponse.json({ message: 'Error saving resume', error }, { status: 500 });
  }
}
