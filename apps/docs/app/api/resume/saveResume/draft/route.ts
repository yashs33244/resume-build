import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { ResumeProps, ResumeState } from '../../../../../types/ResumeProps';
import { PrismaClient, Prisma } from '@prisma/client';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
  }

  try {
    const data: ResumeProps = await req.json();

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Create arrays for the many-to-many relationships
    const skillsData = data.skills.map((skill) => ({ name: skill }));
    const coreSkillsData = data.coreSkills?.map((skill) => ({ name: skill })) ?? [];
    const languagesData = data.languages?.map((language) => ({ name: language })) ?? [];

    // Use transaction with correct Prisma typing
    const result = await db.$transaction(
      async (prisma: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => {
        // Delete existing relationships first
        await prisma.resume.update({
          where: { id: data.resumeId },
          data: {
            skills: { deleteMany: {} },
            coreSkills: { deleteMany: {} },
            languages: { deleteMany: {} },
          },
        });

        // Update the resume with new data
        return prisma.resume.update({
          where: { id: data.resumeId },
          data: {
            state: data.state as ResumeState,
            //@ts-ignore
            personalInfo: data.personalInfo,
            //@ts-ignore
            education: data.education,
            //@ts-ignore
            experience: data.experience,
            skills: {
              create: skillsData,
            },
            coreSkills: {
              create: coreSkillsData,
            },
            languages: {
              create: languagesData,
            },
            achievement: data.achievement ? { update: data.achievement } : undefined,
            //@ts-ignore
            projects: data.projects,
            //@ts-ignore
            certificates: data.certificates,
            templateId: data.templateId,
            updatedAt: new Date(),
          },
        });
      },
      {
        maxWait: 5000, // 5s maximum wait time
        timeout: 10000, // 10s timeout
      }
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error saving resume draft:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: 'Database error', error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Error saving resume draft', error },
      { status: 500 }
    );
  }
}