import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { db } from "../../../../db";
import { ResumeState } from "../../../../../types/ResumeProps";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { resumeId, content } = body;
    console.log("Received Data:", { resumeId, content });

    if (!resumeId || !content) {
      return NextResponse.json(
        {
          error: "Resume ID and content are required",
          receivedData: { resumeId, content },
        },
        { status: 400 }
      );
    }

    const templateId = content.templateId;

    // Prepare all the data operations
    const prepareEducation = (resumeId: string, education: any[]) =>
      education?.map((edu) => ({
        resumeId,
        institution: edu.institution,
        major: edu.major,
        start: edu.start,
        end: edu.end,
        degree: edu.degree,
        score: typeof edu.score === 'string' ? parseFloat(edu.score) : edu.score,
      })) || [];

    const prepareExperience = (resumeId: string, experience: any[]) =>
      experience?.map((exp) => ({
        resumeId,
        company: exp.company,
        role: exp.role,
        start: exp.start,
        end: exp.end,
        responsibilities: exp.responsibilities,
        current: exp.current,
      })) || [];

    // Split transaction into smaller chunks
    const updatedResume = await db.$transaction(async (tx) => {
      // 1. Main resume record
      const resume = await tx.resume.upsert({
        where: { id: resumeId },
        create: {
          id: resumeId,
          userId: session.user.id,
          state: ResumeState.EDITING,
          templateId,
        },
        update: {
          state: ResumeState.EDITING,
          templateId,
          updatedAt: new Date(),
        },
      });

      // 2. Personal Info
      if (content.personalInfo) {
        await tx.personalInfo.upsert({
          where: { resumeId },
          create: { resumeId, ...content.personalInfo },
          update: content.personalInfo,
        });
      }

      // 3. Education & Experience (Batch operations)
      if (content.education?.length) {
        await tx.education.deleteMany({ where: { resumeId } });
        await tx.education.createMany({
          data: prepareEducation(resumeId, content.education),
        });
      }

      if (content.experience?.length) {
        await tx.experience.deleteMany({ where: { resumeId } });
        await tx.experience.createMany({
          data: prepareExperience(resumeId, content.experience),
        });
      }

      // 4. Skills, Core Skills, Languages (Simple arrays)
      const simpleArrays = [
        { model: tx.skill, data: content.skills },
        { model: tx.coreSkill, data: content.coreSkills },
        { model: tx.language, data: content.languages },
      ];

      for (const { model, data } of simpleArrays) {
        if (data?.length) {
          if (model === tx.skill) {
            await (model as typeof tx.skill).deleteMany({ where: { resumeId } });
            await (model as typeof tx.skill).createMany({
              data: data.map((name: string) => ({ resumeId, name })),
            });
          } else if (model === tx.coreSkill) {
            await (model as typeof tx.coreSkill).deleteMany({ where: { resumeId } });
            await (model as typeof tx.coreSkill).createMany({
              data: data.map((name: string) => ({ resumeId, name })),
            });
          } else if (model === tx.language) {
            await (model as typeof tx.language).deleteMany({ where: { resumeId } });
            await (model as typeof tx.language).createMany({
              data: data.map((name: string) => ({ resumeId, name })),
            });
          }
        }
      }

      // 5. Projects
      if (content.projects?.length) {
        await tx.project.deleteMany({ where: { resumeId } });
        await tx.project.createMany({
          data: content.projects.map((proj: any) => ({
            resumeId,
            name: proj.name,
            link: proj.link,
            start: proj.start,
            end: proj.end,
            responsibilities: proj.responsibilities,
          })),
        });
      }

      // 6. Certificates
      if (content.certificates?.length) {
        await tx.certificate.deleteMany({ where: { resumeId } });
        await tx.certificate.createMany({
          data: content.certificates.map((cert: any) => ({
            resumeId,
            name: cert.name,
            issuer: cert.issuer,
            issuedOn: cert.issuedOn,
          })),
        });
      }

      // Fetch final result
      return tx.resume.findUnique({
        where: { id: resumeId },
        include: {
          personalInfo: true,
          education: true,
          experience: true,
          skills: true,
          coreSkills: true,
          languages: true,
          projects: true,
          certificates: true,
        },
      });
    }, {
      maxWait: 10000, // 10s maximum wait time
      timeout: 30000  // 30s timeout
    });

    if (!updatedResume) {
      throw new Error('Failed to update resume');
    }

    return NextResponse.json({
      success: true,
      draft: {
        content: updatedResume,
        updatedAt: updatedResume.updatedAt,
      },
      message: "Resume saved successfully",
    });
  } catch (error) {
    console.error("API Error:", error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2028') {
        return NextResponse.json({
          error: "Database transaction timeout",
          details: "Please try again",
        }, { status: 408 });
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}