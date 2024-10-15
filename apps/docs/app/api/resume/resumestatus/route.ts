import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { ResumeProps } from '../../../../types/ResumeProps';

// Modify the handler to accept a dynamic `resumeId`
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
  }

  const url = new URL(req.url);
  const resumeId = url.searchParams.get('resumeId'); // Get the `resumeId` from query parameters

  try {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User does not exist' }, { status: 404 });
    }

    // Query logic depending on whether resumeId is provided or not
    const resumeQuery = {
      where: resumeId
        ? { id: parseInt(resumeId, 10), userId: user.id } // Fetch by specific resumeId
        : { userId: user.id }, // Fetch all resumes for the user
      select: {
        state: true,
        id: true, 
        createdAt: true,
        updatedAt: true,
        templateId: true,
        personalInfo: {
          select: {
            name: true,
            title: true,
            website: true,
            email: true,
            phone: true,
            bio: true,
            linkedin: true,
            location: true,
          },
        },
        education: {
          select: {
            institution: true,
            major: true,
            start: true,
            end: true,
            degree: true,
          },
        },
        experience: {
          select: {
            company: true,
            role: true,
            start: true,
            end: true,
            responsibilities: true,
            current: true,
          },
        },
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
        techSkills: {
          select: {
            name: true,
          },
        },
        languages: {
          select: {
            name: true,
          },
        },
        achievement: {
          select: {
            title: true,
            description: true,
          },
        },
        projects: {
          select: {
            name: true,
            link: true,
            start: true,
            end: true,
            responsibilities: true,
          },
        },
        certificates: {
          select: {
            name: true,
            issuer: true,
            issuedOn: true,
          },
        },
      },
    };

    // Fetch resume(s) based on whether `resumeId` is provided or not
    const resumes = resumeId
      ? await db.resume.findUnique(resumeQuery) // Single resume for provided resumeId
      : await db.resume.findMany(resumeQuery); // All resumes for the user

    // Handle if no resume is found
    if (!resumes || (Array.isArray(resumes) && resumes.length === 0)) {
      return NextResponse.json({ message: 'No resumes found' }, { status: 404 });
    }

    // Normalize resume(s) to be returned
    const formatResumeData = (resume:ResumeProps) => ({
      state: resume.state,
      resumeId: resume.id,  
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
      personalInfo: resume.personalInfo,
      education: resume.education,
      experience: resume.experience,
      skills: resume.skills.map(skill => skill.name),
      coreSkills: resume.coreSkills.map(skill => skill.name),
      techSkills: resume.techSkills.map(skill => skill.name),
      languages: resume.languages.map(language => language.name),
      achievement: resume.achievement ? {
        title: resume.achievement.title,
        description: resume.achievement.description,
      } : null,
      projects: resume.projects.map(project => ({
        name: project.name,
        link: project.link,
        start: project.start,
        end: project.end,
        responsibilities: project.responsibilities,
      })),
      certificates: resume.certificates.map(certificate => ({
        name: certificate.name,
        issuer: certificate.issuer,
        issuedOn: certificate.issuedOn,
      })),
      templateId: resume.templateId,
    });

    // Return formatted response
    if (Array.isArray(resumes)) {
      // If multiple resumes (when no `resumeId` is provided)
      return NextResponse.json(resumes.map(formatResumeData), { status: 200 });
    } else {
      // If single resume (when `resumeId` is provided)
      return NextResponse.json(formatResumeData(resumes), { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json({ message: 'Error fetching resumes', error }, { status: 500 });
  }
}
