import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
import { ResumeProps } from '../../../../types/ResumeProps';
import { ResumeState } from '@prisma/client';

const buildTailorResumePrompt = (jobDescription: string, sectionName: string, sectionContent: any) => ({
  contents: [
    {
      role: 'user',
      parts: [
        {
          text: `Tailor the following ${sectionName} of a resume for this job description: "${jobDescription}".
                 Original ${sectionName}: ${JSON.stringify(sectionContent)}
                 
                 Instructions:
                 1. Analyze the job description and identify key skills, qualifications, and keywords.
                 2. Modify the resume section to highlight relevant experiences and skills that match the job requirements.
                 3. Include industry-specific keywords and phrases to improve ATS compatibility.
                 4. Ensure the tailored content is more detailed and specific than the original.
                 5. Maintain a professional tone and use action verbs.
                 6. IMPORTANT: Your response must be ONLY valid JSON that matches the exact structure of the original content.
                 7. Do not include any explanation text, only return the JSON object.
                 8. Ensure all JSON property names and values are properly quoted.
                 
                 Example response format:
                 ${JSON.stringify(sectionContent)}
                 `
        }
      ]
    }
  ]
});

// const sanitizeJsonResponse = (response: string): string => {
//   // Find the first '{' and last '}' to extract just the JSON object
//   const start = response.indexOf('{');
//   const end = response.lastIndexOf('}');
  
//   if (start === -1 || end === -1) {
//     throw new Error('No valid JSON object found in response');
//   }
  
//   return response.slice(start, end + 1);
// };

export async function POST(req: Request) {
  try {
    const { jobDescription, resumeData }: { jobDescription: string, resumeData: ResumeProps } = await req.json();

    if (!jobDescription || !resumeData) {
      return NextResponse.json({ message: 'Job description and resume data are required' }, { status: 400 });
    }

    const tailoredSections = await Promise.all(
      Object.entries(resumeData).map(async ([sectionName, sectionContent]) => {
        // Skip processing for non-object sections or specific fields
        if (
          sectionName === 'skills' || 
          sectionName === 'coreSkills' || 
          sectionName === 'techSkills' ||
          typeof sectionContent !== 'object' || 
          sectionContent === null
        ) {
          return [sectionName, sectionContent];
        }

        try {
          const prompt = buildTailorResumePrompt(jobDescription, sectionName, sectionContent);
          const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
          
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const tailoredContent = response.text();

          // Clean and parse the response

          
          // Validate that the parsed content has the same structure
          if (typeof tailoredContent !== 'object') {
            console.warn(`Invalid response structure for ${sectionName}, using original content`);
            return [sectionName, sectionContent];
          }

          return [sectionName, tailoredContent];
        } catch (error) {
          console.error(`Error processing section ${sectionName}:`, error);
          return [sectionName, sectionContent]; // Fallback to original content
        }
      })
    );

    const tailoredResume: ResumeProps = Object.fromEntries(tailoredSections) as ResumeProps;

    // Ensure all required fields are present with default or original values
    const defaultResume: Partial<ResumeProps> = {
      resumeId: resumeData.resumeId || crypto.randomUUID(), // Generate if not present
      userId: resumeData.userId,
      createdAt: resumeData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      size: resumeData.size || 'medium',
      state: resumeData.state || ResumeState.EDITING,
      templateId: resumeData.templateId || 'default-template',
      personalInfo: resumeData.personalInfo || null,
      languages: resumeData.languages || [],
      achievement: resumeData.achievement || null,
      projects: resumeData.projects || [],
      certificates: resumeData.certificates || []
    };

    // Merge the tailored resume with default values
    const finalResume: ResumeProps = {
      ...defaultResume,
      ...tailoredResume,
      education: tailoredResume.education || resumeData.education,
      experience: tailoredResume.experience || resumeData.experience,
      skills: tailoredResume.skills || resumeData.skills,
      coreSkills: tailoredResume.coreSkills || resumeData.coreSkills
    } as ResumeProps;

    return NextResponse.json(finalResume, { status: 200 });
  } catch (error) {
    console.error('Error tailoring resume:', error);
    return NextResponse.json({ 
      message: 'Error tailoring resume', 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}