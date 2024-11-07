import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { db } from "../../../../db";
import { ResumeState } from "../../../../../types/ResumeProps";


export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { resumeId, content } = body;

    if (!resumeId || !content) {
      return NextResponse.json(
        { error: "Resume ID and content are required" },
        { status: 400 }
      );
    }

    // Split the transaction into smaller chunks to prevent timeout
    const resume = await db.resume.upsert({
      where: { id: resumeId },
      create: {
        id: resumeId,
        userId: session.user.id,
        state: ResumeState.EDITING,
        templateId: content.templateId,
      },
      update: {
        state: ResumeState.EDITING,
        templateId: content.templateId,
        updatedAt: new Date(),
      },
    });

    // Handle personal info
    if (content.personalInfo) {
      await db.personalInfo.upsert({
        where: { resumeId },
        create: {
          resumeId,
          ...content.personalInfo,
        },
        update: content.personalInfo,
      });
    }

    // Handle arrays in parallel for better performance
    await Promise.all([
      // Education
      content.education?.length > 0
        ? (async () => {
            await db.education.deleteMany({ where: { resumeId } });
            await db.education.createMany({
              data: content.education.map((edu: any) => ({
                resumeId,
                institution: edu.institution,
                major: edu.major,
                start: edu.start,
                end: edu.end,
                degree: edu.degree,
                score: parseFloat(edu.score),
              })),
            });
          })()
        : Promise.resolve(),

      // Experience
      content.experience?.length > 0
        ? (async () => {
            await db.experience.deleteMany({ where: { resumeId } });
            await db.experience.createMany({
              data: content.experience.map((exp: any) => ({
                resumeId,
                company: exp.company,
                role: exp.role,
                start: exp.start,
                end: exp.end,
                responsibilities: exp.responsibilities,
                current: exp.current,
              })),
            });
          })()
        : Promise.resolve(),

      // Skills
      content.skills?.length > 0
        ? (async () => {
            await db.skill.deleteMany({ where: { resumeId } });
            await db.skill.createMany({
              data: content.skills.map((skill: any) => ({
                resumeId,
                name: skill,
              })),
            });
          })()
        : Promise.resolve(),

      // Core Skills
      content.coreSkills?.length > 0
        ? (async () => {
            await db.coreSkill.deleteMany({ where: { resumeId } });
            await db.coreSkill.createMany({
              data: content.coreSkills.map((skill: any) => ({
                resumeId,
                name: skill,
              })),
            });
          })()
        : Promise.resolve(),

      // Languages
      content.languages?.length > 0
        ? (async () => {
            await db.language.deleteMany({ where: { resumeId } });
            await db.language.createMany({
              data: content.languages.map((lang: any) => ({
                resumeId,
                name: lang,
              })),
            });
          })()
        : Promise.resolve(),

      // Projects
      content.projects?.length > 0
        ? (async () => {
            await db.project.deleteMany({ where: { resumeId } });
            await db.project.createMany({
              data: content.projects.map((proj: any) => ({
                resumeId,
                name: proj.name,
                link: proj.link,
                start: proj.start,
                end: proj.end,
                responsibilities: proj.responsibilities,
              })),
            });
          })()
        : Promise.resolve(),

      // Certificates
      content.certificates?.length > 0
        ? (async () => {
            await db.certificate.deleteMany({ where: { resumeId } });
            await db.certificate.createMany({
              data: content.certificates.map((cert: any) => ({
                resumeId,
                name: cert.name,
                issuer: cert.issuer,
                issuedOn: cert.issuedOn,
              })),
            });
          })()
        : Promise.resolve(),
    ]);

    // Fetch the updated resume with all relations
    const updatedResume = await db.resume.findUnique({
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

    if (!updatedResume) {
      throw new Error("Failed to fetch updated resume");
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
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}