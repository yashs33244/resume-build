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

    const existingResume = await db.resume.findFirst({
      where: { userId: user.id },
      include: { personalInfo: true , 
        education:true,
        experience:true,
        skills:true,
        coreSkills:true,
        techSkills:true,
        languages:true,
        achievement:true,
        projects:true,
        certificates:true,
      },
    });

    let resume;
    if (existingResume) {
      // Update existing resume
      resume = await db.resume.update({
        where: { id: existingResume.id },
        data: {
          state: ResumeState.DOWNLOAD_SUCCESS,
          templateId: template,
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
        },
      });

      // Update or create personalInfo
      if (existingResume.personalInfo) {
        await db.personalInfo.update({
          where: { resumeId: existingResume.id },
          data: resumeData.personalInfo,
        });
      } else {
        await db.personalInfo.create({
          data: {
            ...resumeData.personalInfo,
            resumeId: existingResume.id,
          },
        });
      }

      // Update or create achievement
      if (resumeData.achievement) {
        if (existingResume.achievement) {
          await db.achievement.update({
            where: { resumeId: existingResume.id },
            data: resumeData.achievement,
          });
        } else {
          await db.achievement.create({
            data: {
              ...resumeData.achievement,
              resumeId: existingResume.id,
            },
          });
        }
      }
    } else {
      // Create new resume
      resume = await db.resume.create({
        data: {
          userId: user.id,
          state: ResumeState.DOWNLOAD_SUCCESS,
          templateId: template,
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
          techSkills: {
            create: (resumeData.techSkills ?? []).map((skill: string) => ({ name: skill })),
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
          achievement: resumeData.achievement ? {
            create: resumeData.achievement,
          } : undefined,
        },
      });
    }

    return NextResponse.json({ message: 'Resume saved successfully', resumeId: resume.id }, { status: 200 });
  } catch (error) {
    console.error('Error saving resume:', error);
    return NextResponse.json({ message: 'Error saving resume', error }, { status: 500 });
  }
}