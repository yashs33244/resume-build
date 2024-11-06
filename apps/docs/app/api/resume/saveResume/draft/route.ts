import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { ResumeProps, ResumeState } from '../../../../../types/ResumeProps';
import { PrismaClient , Prisma} from '@prisma/client';


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

    type ResumeUpdateInput = Prisma.ResumeUpdateInput;

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

        const updateData: ResumeUpdateInput = {
          state: data.state,
          //@ts-ignore
          personalInfo: data.personalInfo as Prisma.JsonValue,
          //@ts-ignore
          education: data.education as Prisma.JsonValue,
          //@ts-ignore
          experience: data.experience as Prisma.JsonValue,
          skills: {
            create: skillsData,
          },
          coreSkills: {
            create: coreSkillsData,
          },
          languages: {
            create: languagesData,
          },
          //@ts-ignore
          achievement: data.achievement as Prisma.JsonValue,
          //@ts-ignore
          projects: data.projects as Prisma.JsonValue,
          //@ts-ignore
          certificates: data.certificates as Prisma.JsonValue,
          templateId: data.templateId,
          updatedAt: new Date(),
        };

        // Update the resume with new data
        return prisma.resume.update({
          where: { id: data.resumeId },
          data: updateData,
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
    
    // Check if error is a Prisma error
    if (error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientUnknownRequestError ||
        error instanceof Prisma.PrismaClientRustPanicError ||
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json(
        { message: 'Database error', error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Error saving resume draft', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}