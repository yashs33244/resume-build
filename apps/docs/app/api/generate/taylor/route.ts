import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
import { ResumeProps } from '../../../../types/ResumeProps';

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

const sanitizeJsonResponse = (response: string): string => {
  // Find the first '{' and last '}' to extract just the JSON object
  const start = response.indexOf('{');
  const end = response.lastIndexOf('}');
  
  if (start === -1 || end === -1) {
    throw new Error('No valid JSON object found in response');
  }
  
  return response.slice(start, end + 1);
};

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
          const sanitizedJson = sanitizeJsonResponse(tailoredContent);
          const parsedContent = JSON.parse(sanitizedJson);
          
          // Validate that the parsed content has the same structure
          if (typeof parsedContent !== 'object') {
            console.warn(`Invalid response structure for ${sectionName}, using original content`);
            return [sectionName, sectionContent];
          }

          return [sectionName, parsedContent];
        } catch (error) {
          console.error(`Error processing section ${sectionName}:`, error);
          return [sectionName, sectionContent]; // Fallback to original content
        }
      })
    );

    const tailoredResume: ResumeProps = Object.fromEntries(tailoredSections) as ResumeProps;

    // Ensure all required fields are present
    const requiredFields: (keyof ResumeProps)[] = ['userId', 'personalInfo', 'education', 'experience', 'skills', 'coreSkills'];
    for (const field of requiredFields) {
      if (!(field in tailoredResume)) {
        //@ts-ignore
        tailoredResume[field] = resumeData[field];
      }
    }

    return NextResponse.json(tailoredResume, { status: 200 });
  } catch (error) {
    console.error('Error tailoring resume:', error);
    return NextResponse.json({ 
      message: 'Error tailoring resume', 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}