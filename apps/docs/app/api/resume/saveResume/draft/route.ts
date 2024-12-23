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

    // Enhanced sectionUpdateMap with more comprehensive handling and error checking
    const sectionUpdateMap = {
      personalInfo: {
        model: db.personalInfo,
        updateMethod: 'upsert',
        updateData: (data: any) => ({
          where: { resumeId },
          create: { 
            resumeId, 
            name: data?.name || '',
            title: data?.title || '',
            email: data?.email || '',
            phone: data?.phone || '',
            location: data?.location || '',
            website: data?.website || '',
            linkedin: data?.linkedin || '',
            bio: data?.bio || ''
          },
          update: {
            name: data?.name || '',
            title: data?.title || '',
            email: data?.email || '',
            phone: data?.phone || '',
            location: data?.location || '',
            website: data?.website || '',
            linkedin: data?.linkedin || '',
            bio: data?.bio || ''
          }
        })
      },
      education: {
        model: db.education,
        updateMethod: 'deleteMany-createMany',
        deleteFilter: { resumeId },
        mapData: (edu: any) => ({
          resumeId,
          institution: edu?.institution || '',
          major: edu?.major || '',
          start: edu?.start || '',
          end: edu?.end || '',
          degree: edu?.degree || '',
          score: edu?.score || '',
        })
      },
      experience: {
        model: db.experience,
        updateMethod: 'deleteMany-createMany',
        deleteFilter: { resumeId },
        mapData: (exp: any) => ({
          resumeId,
          company: exp?.company || '',
          role: exp?.role || '',
          start: exp?.start || '',
          end: exp?.end || '',
          responsibilities: Array.isArray(exp?.responsibilities) ? exp.responsibilities : [],
          current: exp?.current || false,
        })
      },
      skills: {
        model: db.skill,
        updateMethod: 'deleteMany-createMany',
        deleteFilter: { resumeId },
        mapData: (skill: any) => ({ 
          resumeId, 
          name: skill || '' 
        })
      },
      coreSkills: {
        model: db.coreSkill,
        updateMethod: 'deleteMany-createMany',
        deleteFilter: { resumeId },
        mapData: (skill: any) => ({ 
          resumeId, 
          name: skill || '' 
        })
      },
      languages: {
        model: db.language,
        updateMethod: 'deleteMany-createMany',
        deleteFilter: { resumeId },
        mapData: (lang: any) => ({ 
          resumeId, 
          name: lang || '' 
        })
      },
      projects: {
        model: db.project,
        updateMethod: 'deleteMany-createMany',
        deleteFilter: { resumeId },
        mapData: (proj: any) => ({
          resumeId,
          name: proj?.name || '',
          link: proj?.link || '',
          start: proj?.start || '',
          end: proj?.end || '',
          responsibilities: Array.isArray(proj?.responsibilities) ? proj.responsibilities : [],
        })
      },
      certificates: {
        model: db.certificate,
        updateMethod: 'deleteMany-createMany',
        deleteFilter: { resumeId },
        mapData: (cert: any) => ({
          resumeId,
          name: cert?.name || '',
          issuer: cert?.issuer || '',
          issuedOn: cert?.issuedOn || '',
        })
      },
      achievements: {
        model: db.achievement,
        updateMethod: 'deleteMany-createMany',
        deleteFilter: { resumeId },
        mapData: (ach: any) => ({
          resumeId,
          title: ach?.title || '',
          description: ach?.description || '',
        })
      }
    };

    // Perform updates for each section with enhanced error handling
    await Promise.all(
      Object.entries(sectionUpdateMap).map(async ([key, section]) => {
        try {
          const sectionContent = content[key];
          
          // Skip if section is undefined
          if (sectionContent === undefined) return Promise.resolve();

          // Ensure arrays are properly handled
          const sanitizedContent = Array.isArray(sectionContent) 
            ? sectionContent.filter(item => item !== null && item !== undefined)
            : (sectionContent ? [sectionContent] : []);

          if (section.updateMethod === 'upsert') {
            if ('updateData' in section) {
              return (section.model.upsert as any)(section.updateData(sanitizedContent[0] || {}));
            }
          } else if (section.updateMethod === 'deleteMany-createMany') {
            // Always perform delete operation
            await (section.model as any).deleteMany({ 
              where: 'deleteFilter' in section ? section.deleteFilter : { resumeId } 
            });

            // Only create if there are valid items
            if (sanitizedContent.length > 0 && 'mapData' in section) {
              return (section.model as any).createMany({
                data: sanitizedContent.map((item: any) => section.mapData(item)),
              });
            }
          }
        } catch (error) {
          console.error(`Error updating ${key}:`, error);
          throw error; // Re-throw to be caught by the main try-catch
        }
      })
    );

    // Fetch the complete updated resume
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