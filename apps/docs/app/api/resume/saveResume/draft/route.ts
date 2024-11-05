import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { db } from "../../../../db";
import { ResumeProps } from "../../../../../types/ResumeProps";
import { ResumeState } from "@prisma/client";

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

    // Update resume and all related data in a transaction
    const updatedResume = await db.$transaction(async (tx) => {
      // 1. Update or create the main resume record
      const resume = await tx.resume.upsert({
        where: { id: resumeId },
        create: {
          id: resumeId,
          userId: session.user.id,
          state: ResumeState.EDITING,
          templateId: templateId,
        },
        update: {
          state: ResumeState.EDITING,
          templateId: templateId,
          updatedAt: new Date(),
        },
      });

      // 2. Update personal info
      if (content.personalInfo) {
        await tx.personalInfo.upsert({
          where: { resumeId },
          create: {
            resumeId,
            ...content.personalInfo,
          },
          update: content.personalInfo,
        });
      }

      // 3. Update education records
      if (content.education?.length > 0) {
        // Delete existing education records
        await tx.education.deleteMany({ where: { resumeId } });
        // Create new education records
        await tx.education.createMany({
          data: content.education.map((edu:any) => ({
            resumeId,
            institution: edu.institution,
            major: edu.major,
            start: edu.start,
            end: edu.end,
            degree: edu.degree,
            score: parseFloat(edu.score)// to float,
          })),
        });
      }

      // 4. Update experience records
      if (content.experience?.length > 0) {
        await tx.experience.deleteMany({ where: { resumeId } });
        await tx.experience.createMany({
          data: content.experience.map((exp:any) => ({
            resumeId,
            company: exp.company,
            role: exp.role,
            start: exp.start,
            end: exp.end,
            responsibilities: exp.responsibilities,
            current: exp.current,
          })),
        });
      }

      // 5. Update skills
      if (content.skills?.length > 0) {
        await tx.skill.deleteMany({ where: { resumeId } });
        await tx.skill.createMany({
          data: content.skills.map((skill:any) => ({
            resumeId,
            name: skill,
          })),
        });
      }

      // 6. Update core skills
      if (content.coreSkills?.length > 0) {
        await tx.coreSkill.deleteMany({ where: { resumeId } });
        await tx.coreSkill.createMany({
          data: content.coreSkills.map((skill:any) => ({
            resumeId,
            name: skill,
          })),
        });
      }

      // 7. Update languages
      if (content.languages?.length > 0) {
        await tx.language.deleteMany({ where: { resumeId } });
        await tx.language.createMany({
          data: content.languages.map((lang:any) => ({
            resumeId,
            name: lang,
          })),
        });
      }

      // 8. Update projects
      if (content.projects?.length > 0) {
        await tx.project.deleteMany({ where: { resumeId } });
        await tx.project.createMany({
          data: content.projects.map((proj:any) => ({
            resumeId,
            name: proj.name,
            link: proj.link,
            start: proj.start,
            end: proj.end,
            responsibilities: proj.responsibilities,
          })),
        });
      }

      // 9. Update certificates
      if (content.certificates?.length > 0) {
        await tx.certificate.deleteMany({ where: { resumeId } });
        await tx.certificate.createMany({
          data: content.certificates.map((cert:any) => ({
            resumeId,
            name: cert.name,
            issuer: cert.issuer,
            issuedOn: cert.issuedOn,
          })),
        });
      }

      // Fetch the updated resume with all relations
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
    });

    return NextResponse.json({
      success: true,
      draft: {
        content: updatedResume,
        updatedAt: updatedResume?.updatedAt,
      },
      message: "Resume saved successfully",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}