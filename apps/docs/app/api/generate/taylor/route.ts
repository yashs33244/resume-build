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
                 6. Return ONLY the modified content in the exact same JSON format as the original, without any additional explanation or formatting.`
        }
      ]
    }
  ]
});

export async function POST(req: Request) {
  try {
    const { jobDescription, resumeData }: { jobDescription: string, resumeData: ResumeProps } = await req.json();

    if (!jobDescription || !resumeData) {
      return NextResponse.json({ message: 'Job description and resume data are required' }, { status: 400 });
    }

    const tailoredSections = await Promise.all(
      Object.entries(resumeData).map(async ([sectionName, sectionContent]) => {
        // Exclude skills-related fields from modification
        if (sectionName === 'skills' || sectionName === 'coreSkills' || sectionName === 'techSkills') {
          return [sectionName, sectionContent]; // Retain the original skills content without AI tailoring
        }

        if (typeof sectionContent === 'object' && sectionContent !== null) {
          const prompt = buildTailorResumePrompt(jobDescription, sectionName, sectionContent);

          const geminiStream = await genAI
            .getGenerativeModel({ model: 'gemini-pro' })
            .generateContentStream(prompt);

          let tailoredContent = '';
          for await (const chunk of geminiStream.stream) {
            tailoredContent += chunk.text();
          }

          try {
            const parsedContent = JSON.parse(tailoredContent.trim());
            return [sectionName, parsedContent];
          } catch (error) {
            console.error(`Error parsing tailored content for ${sectionName}:`, error);
            return [sectionName, sectionContent];
          }
        }

        // Return as-is for non-object sections
        return [sectionName, sectionContent];
      })
    );

    const tailoredResume: ResumeProps = Object.fromEntries(tailoredSections) as ResumeProps;

    // Ensure all required fields are present, including skills, coreSkills, and techSkills
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
    return NextResponse.json({ message: 'Error tailoring resume' }, { status: 500 });
  }
}
