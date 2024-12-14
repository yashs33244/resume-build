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

    // Find or create resume
    let resume = await db.resume.findUnique({ where: { id: resumeId } });

    if (!resume) {
      resume = await db.resume.create({
        data: {
          id: resumeId,
          userId: session.user.id,
          state: ResumeState.EDITING,
          templateId: content.templateId,
          size: content.size || "M",
        },
      });
    } else {
      resume = await db.resume.update({
        where: { id: resumeId },  
        data: {
          state: resume.state === ResumeState.DOWNLOAD_SUCCESS 
            ? ResumeState.DOWNLOAD_SUCCESS 
            : ResumeState.EDITING,
          templateId: content.templateId || resume.templateId,
          size: content.size || resume.size,
          updatedAt: new Date(),
        },
      });
    }

    // Sections definition with update logic
    const sectionUpdateMap = {
      personalInfo: {
        model: db.personalInfo,
        updateMethod: 'upsert',
        updateData: (data: any): Parameters<typeof db.personalInfo.upsert>[0] => ({
          where: { resumeId },
          create: { resumeId, ...data },
          update: data
        })
      },
      education: {
        model: db.education,
        updateMethod: 'deleteMany-createMany',
        deleteFilter: { resumeId },
        mapData: (edu: any) => ({
          resumeId,
          institution: edu.institution,
          major: edu.major,
          start: edu.start,
          end: edu.end,
          degree: edu.degree,
          score: edu.score,
        })
      },
      experience: {
        model: db.experience,
        updateMethod: 'deleteMany-createMany',
        deleteFilter: { resumeId },
        mapData: (exp: any) => ({
          resumeId,
          company: exp.company,
          role: exp.role,
          start: exp.start,
          end: exp.end,
          responsibilities: exp.responsibilities,
          current: exp.current,
        })
      },
      skills: {
        model: db.skill,
        updateMethod: 'deleteMany-createMany',
        deleteFilter: { resumeId },
        mapData: (skill: any) => ({ resumeId, name: skill })
      },
      coreSkills: {
        model: db.coreSkill,
        updateMethod: 'deleteMany-createMany',
        deleteFilter: { resumeId },
        mapData: (skill: any) => ({ resumeId, name: skill })
      },
      languages: {
        model: db.language,
        updateMethod: 'deleteMany-createMany',
        deleteFilter: { resumeId },
        mapData: (lang: any) => ({ resumeId, name: lang })
      },
      projects: {
        model: db.project,
        updateMethod: 'deleteMany-createMany',
        deleteFilter: { resumeId },
        mapData: (proj: any) => ({
          resumeId,
          name: proj.name,
          link: proj.link,
          start: proj.start,
          end: proj.end,
          responsibilities: proj.responsibilities,
        })
      },
      certificates: {
        model: db.certificate,
        updateMethod: 'deleteMany-createMany',
        deleteFilter: { resumeId },
        mapData: (cert: any) => ({
          resumeId,
          name: cert.name,
          issuer: cert.issuer,
          issuedOn: cert.issuedOn,
        })
      },
      achievements: {
        model: db.achievement,
        updateMethod: 'deleteMany-createMany',
        deleteFilter: { resumeId },
        mapData: (ach: any) => ({
          resumeId,
          title: ach.title,
          description: ach.description,
        })
      }
    };

    // Perform updates for each section
    await Promise.all(
      Object.entries(sectionUpdateMap).map(([key, section]) => {
        const sectionContent = content[key];
        
        // Skip if no content for this section
        if (!sectionContent) return Promise.resolve();

        // Handle different update methods
        if (section.updateMethod === 'upsert') {
          if (section.updateMethod === 'upsert' && 'updateData' in section) {
            return (section.model.upsert as any)(section.updateData(sectionContent));
          }
          return Promise.resolve();
        }

        if (section.updateMethod === 'deleteMany-createMany') {
          // Delete existing records for the section
          return Promise.all([
            'deleteFilter' in section && section.deleteFilter ? (section.model as any).deleteMany({ where: section.deleteFilter }) : Promise.resolve(),
            // Only create if there are items
            sectionContent.length > 0 && 'mapData' in section
              ? (section.model as any).createMany({
                  data: sectionContent.map((item:any) => section.mapData(item)),
                })
              : Promise.resolve()
          ]);
        }

        return Promise.resolve();
      })
    );

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
        achievements: true,
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
      message: "Resume draft updated successfully",
    });
  } catch (error) {
    console.error("Draft Update API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}