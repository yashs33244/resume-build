import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { ResumeProps } from '../../../../types/ResumeProps';


// Prisma client initialization
const prisma = new PrismaClient();

// Type definition for Resume Data (adjust as needed)


export async function POST(req: NextRequest) {
  try {
    // Get the session to ensure the user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const { resumeData, template } = await req.json() as { 
      resumeData: ResumeProps, 
      template: string 
    };

    // Validate input
    if (!resumeData || !resumeData.personalInfo || !template) {
      return NextResponse.json({ 
        error: 'Invalid input', 
        details: 'Resume data or template is missing' 
      }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create the resume with all related data
    const newResume = await prisma.resume.create({
      data: {
        userId: user.id,
        templateId: template,
        state: 'NOT_STARTED',
        personalInfo: {
          create: {
            name: resumeData.personalInfo.name,
            title: resumeData.personalInfo.title,
            email: resumeData.personalInfo.email,
            phone: resumeData.personalInfo.phone,
            location: resumeData.personalInfo.location,
            website: resumeData.personalInfo.website,
            linkedin: resumeData.personalInfo.linkedin,
            bio: resumeData.personalInfo.bio
          }
        },
        // Education
        ...(resumeData.education && resumeData.education.length > 0 && {
          education: {
            create: resumeData.education.map(edu => ({
              institution: edu.institution,
              major: edu.major,
              start: edu.start,
              end: edu.end,
              degree: edu.degree,
              score: edu.score
            }))
          }
        }),
        // Experience
        ...(resumeData.experience && resumeData.experience.length > 0 && {
          experience: {
            create: resumeData.experience.map(exp => ({
              company: exp.company,
              role: exp.role,
              start: exp.start,
              end: exp.end,
              responsibilities: exp.responsibilities,
              current: exp.current
            }))
          }
        }),
        // Skills
        ...(resumeData.skills && resumeData.skills.length > 0 && {
          skills: {
            create: resumeData.skills
              .filter((skill:any) => skill && skill.name && skill.name.trim() !== '')
              .map((skill:any) => ({
                name: skill.name.trim()
              }))
          }
        }),
        
         // Achievements
         ...(resumeData.achievements && resumeData.achievements.length > 0 && {
          achievements: {
            create: resumeData.achievements.map(achievement => ({
              title: achievement.title,
              description: achievement.description
            }))
          }
        }),
        // Projects
        ...(resumeData.projects && resumeData.projects.length > 0 && {
          projects: {
            create: resumeData.projects.map(project => ({
              name: project.name,
              link: project.link,
              start: project.start,
              end: project.end,
              responsibilities: project.responsibilities
            }))
          }
        }),
        // Certificates
        ...(resumeData.certificates && resumeData.certificates.length > 0 && {
          certificates: {
            create: resumeData.certificates.map(cert => ({
              name: cert.name,
              issuer: cert.issuer,
              issuedOn: cert.issuedOn
            }))
          }
        }),
      },
      include: {
        personalInfo: true,
        education: true,
        experience: true,
        skills: true
      }
    });

    return NextResponse.json({ 
      message: 'Resume saved successfully', 
      resumeId: newResume.id 
    }, { status: 200 });

  } catch (error) {
    console.error('Error saving resume:', error);

    // More detailed error handling
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: 'Failed to save resume', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, { status: 500 });
    }

    return NextResponse.json({ 
      error: 'Failed to save resume', 
      details: 'An unexpected error occurred' 
    }, { status: 500 });

  } finally {
    // Ensure database connection is closed
    await prisma.$disconnect();
  }
}