

import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
  }
  const url = new URL(req.url);
  const resumeId = url.searchParams.get('resumeId');

  if (!resumeId) {
    return NextResponse.json({ message: 'Resume ID is required' }, { status: 400 });
  }

  try {

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User does not exist' }, { status: 404 });
    }

    const resumes = await db.resume.findUnique({
      where: { 
        id: resumeId
      },
      select: {
        state: true,
        id: true, 
        createdAt: true,
        updatedAt: true,
        templateId: true,
        personalInfo: true,
        education: true,
        experience: true,
        skills: {
          select: {
            name: true,
          },
        },
        coreSkills: {
          select: {
            name: true,
          },
        },
        languages: {
          select: {
            name: true,
          },
        },
        achievement: true,
        projects: true,
        certificates: true,
      },
    });

    if (!resumes) {
      return NextResponse.json({ message: 'No resume found' }, { status: 404 });
    }

    console.log(`Found resume for user ${user.id}`);

    const formattedResume = {
      state: resumes.state,
      resumeId: resumes.id,
      createdAt: resumes.createdAt,
      updatedAt: resumes.updatedAt,
      personalInfo: resumes.personalInfo,
      education: resumes.education,
      experience: resumes.experience,
      skills: resumes.skills.map((skill:any) => skill.name),
      coreSkills: resumes.coreSkills.map((skill:any) => skill.name),
      languages: resumes.languages.map((language:any) => language.name),
      achievement: resumes.achievement,
      projects: resumes.projects,
      certificates: resumes.certificates,
      templateId: resumes.templateId,
    };

    console.log(`Returning formatted resume for user ${user.id}`);

    return NextResponse.json(formattedResume, { status: 200 });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json({ message: 'Error fetching resumes', error }, { status: 500 });
  }
}