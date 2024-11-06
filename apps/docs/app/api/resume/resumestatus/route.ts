import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User does not exist' }, { status: 404 });
    }

    const resumes = await db.resume.findMany({
      where: { userId: user.id },
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

    console.log(`Found ${resumes.length} resumes for user ${user.id}`);

    const formattedResumes = resumes.map((resume:any) => ({
      state: resume.state,
      resumeId: resume.id,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
      personalInfo: resume.personalInfo,
      education: resume.education,
      experience: resume.experience,
      skills: resume.skills.map((skill:any) => skill.name),
      coreSkills: resume.coreSkills.map((skill:any) => skill.name),
      languages: resume.languages.map((language:any) => language.name),
      achievement: resume.achievement,
      projects: resume.projects,
      certificates: resume.certificates,
      templateId: resume.templateId,
    }));

    console.log(`Returning ${formattedResumes.length} formatted resumes`);

    return NextResponse.json(formattedResumes, { status: 200 });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json({ message: 'Error fetching resumes', error }, { status: 500 });
  }
}