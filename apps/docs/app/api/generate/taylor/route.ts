import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DOMParser } from 'xmldom';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
import { ResumeProps } from '../../../../types/ResumeProps';
import { ResumeState } from '@prisma/client';

// Utility function to parse HTML responsibilities
const parseHtmlResponsibilities = (htmlString: string): string[] => {
  if (!htmlString) return [];

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const listItems = doc.getElementsByTagName('li');
    
    const responsibilities: string[] = [];
    for (let i = 0; i < listItems.length; i++) {
      const item = listItems[i];
      // Remove any leading tags like "Developed", "Implemented", etc.
      const cleanedText = item?.textContent
        ?.replace(/^(Developed|Improved|Implemented|Led)\s*/, '')
        .trim() || '';
      
      if (cleanedText) {
        responsibilities.push(cleanedText);
      }
    }

    return responsibilities;
  } catch (error) {
    console.error('Error parsing HTML responsibilities:', error);
    return [];
  }
};

// Modify the prompt to handle parsed responsibilities
const buildTailorResumePrompt = (jobDescription: string, sectionName: string, sectionContent: any) => ({
  contents: [
    {
      role: 'user',
      parts: [
        {
          text: `Carefully tailor the ${sectionName} section of a resume for this job description:

Job Description: "${jobDescription}"

Original ${sectionName} Content: ${JSON.stringify(sectionContent)}

Detailed Tailoring Guidelines:
1. Analyze job description for key skills and requirements
2. Modify section to:
   - Highlight most relevant experiences
   - Use exact keywords from job description
   - Quantify achievements 
   - Demonstrate direct job requirement alignment
3. If section contains responsibilities:
   - Rewrite to be more achievement-oriented
   - Focus on impact and measurable outcomes
   - Use powerful action verbs
4. Maintain original JSON structure
5. Ensure ATS optimization

Respond with ONLY a valid JSON string matching the input structure.`
        }
      ]
    }
  ]
});

export async function POST(req: Request) {
  try {
    const { jobDescription, resumeData }: { jobDescription: string, resumeData: ResumeProps } = await req.json();

    if (!jobDescription || !resumeData) {
      return NextResponse.json({ 
        message: 'Job description and resume data are required',
        details: {
          jobDescription: !!jobDescription,
          resumeData: !!resumeData
        }
      }, { status: 400 });
    }

    // Deep clone to avoid mutation
    const processedResumeData = JSON.parse(JSON.stringify(resumeData));

    // Pre-process sections with HTML responsibilities
    const sectionsToProcess = ['projects', 'experience'];
    
    for (const sectionName of sectionsToProcess) {
      if (processedResumeData[sectionName]) {
        processedResumeData[sectionName] = processedResumeData[sectionName].map((item:any) => {
          // Parse HTML responsibilities if they exist
          if (item.responsibilities && typeof item.responsibilities[0] === 'string') {
            const parsedResponsibilities = item.responsibilities.flatMap((resp:any) => 
              parseHtmlResponsibilities(resp)
            );
            
            return {
              ...item,
              responsibilities: parsedResponsibilities
            };
          }
          return item;
        });
      }
    }

    const tailoredSections = [];

    for (const [sectionName, sectionContent] of Object.entries(processedResumeData)) {
      // Skip processing for specific sections
      if (
        ['skills', 'coreSkills', 'techSkills', 'certificates'].includes(sectionName) || 
        typeof sectionContent !== 'object' || 
        sectionContent === null
      ) {
        tailoredSections.push([sectionName, sectionContent]);
        continue;
      }

      try {
        const prompt = buildTailorResumePrompt(jobDescription, sectionName, sectionContent);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        // Attempt to parse the response, fallback to original content
        let tailoredContent;
        try {
          tailoredContent = JSON.parse(responseText);
        } catch {
          tailoredContent = sectionContent;
        }

        tailoredSections.push([sectionName, tailoredContent]);
      } catch (error) {
        console.error(`Error processing section ${sectionName}:`, error);
        tailoredSections.push([sectionName, sectionContent]);
      }
    }

    const tailoredResume: ResumeProps = Object.fromEntries(tailoredSections) as ResumeProps;

    // Comprehensive fallback and validation
    const finalResume: ResumeProps = {
      ...resumeData,
      ...tailoredResume,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(finalResume, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Tailoring-Method': 'AI-Enhanced'
      }
    });
  } catch (error) {
    console.error('Resume tailoring error:', error);
    return NextResponse.json({ 
      message: 'Resume tailoring failed', 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}