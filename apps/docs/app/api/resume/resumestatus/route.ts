import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { ResumeProps, ResumeState } from '../../../../types/ResumeProps';

// Define the database resume structure based on the Prisma schema
interface DatabaseResume {
  state: ResumeState;
  id: string;
  userId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  templateId: string;
  personalInfo: {
    name: string;
    title: string;
    website?: string;
    email?: string;
    phone?: string;
    bio?: string;
    linkedin?: string;
    location?: string;
  } | null;
  education: Array<{
    institution: string;
    major: string;
    start: string;
    end: string;
    degree: string;
    score: number;
  }>;
  experience: Array<{
    company: string;
    role: string;
    start: string;
    end: string;
    responsibilities: string[];
    current: boolean;
  }>;
  skills: {
    name: string;
  }[];
  coreSkills: {
    name: string;
  }[];
  languages: {
    name: string;
  }[];
  achievement: {
    title: string;
    description: string;
  } | null;
  projects: Array<{
    name: string;
    link: string;
    start: string;
    end: string;
    responsibilities: string[];
  }>;
  certificates: Array<{
    name: string;
    issuer: string;
    issuedOn: string;
  }>;
}

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
        userId: true,
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
    }) as DatabaseResume[];

    console.log(`Found ${resumes.length} resumes for user ${user.id}`);

    const formattedResumes: ResumeProps[] = resumes.map((resume: DatabaseResume): ResumeProps => ({
      personalInfo: resume.personalInfo,
      resumeId: resume.id,
      userId: resume.userId,
      createdAt: resume.createdAt?.toISOString() ?? new Date().toISOString(), // Provide default value if null
      updatedAt: resume.updatedAt?.toISOString() ?? new Date().toISOString(), // Provide default value if null
      education: resume.education ?? [],
      experience: resume.experience ?? [],
      skills: resume.skills?.map(skill => skill.name) ?? [],
      coreSkills: resume.coreSkills?.map(skill => skill.name),
      languages: resume.languages?.map(lang => lang.name),
      achievement: resume.achievement,
      projects: resume.projects ?? [],
      certificates: resume.certificates ?? [],
      state: resume.state,
      templateId: resume.templateId,
    }));

    console.log(`Returning ${formattedResumes.length} formatted resumes`);

    return NextResponse.json(formattedResumes, { status: 200 });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json({ message: 'Error fetching resumes', error }, { status: 500 });
  }
}