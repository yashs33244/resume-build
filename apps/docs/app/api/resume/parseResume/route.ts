import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { ResumeProps } from '../../../../types/ResumeProps';

const apiKey = process.env.GOOGLE_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);


// Bullet point processing utilities
const processActionVerb = (bullet: string): string => {
  const actionVerbs = [
    'Achieved', 'Administered', 'Advanced', 'Analyzed', 'Built',
    'Collaborated', 'Conducted', 'Created', 'Delivered', 'Developed',
    'Engineered', 'Established', 'Generated', 'Implemented', 'Improved',
    'Increased', 'Initiated', 'Led', 'Managed', 'Optimized',
    'Pioneered', 'Reduced', 'Resolved', 'Spearheaded', 'Streamlined'
  ];

  // Check if already starts with an action verb
  const startsWithVerb = actionVerbs.some(verb => 
    bullet.toLowerCase().startsWith(verb.toLowerCase())
  );

  if (startsWithVerb) return bullet;

  // Determine appropriate verb based on content
  if (bullet.toLowerCase().includes('develop') || bullet.toLowerCase().includes('build') || bullet.toLowerCase().includes('create')) {
    return `Developed ${bullet}`;
  } else if (bullet.toLowerCase().includes('improve') || bullet.toLowerCase().includes('enhance') || bullet.toLowerCase().includes('optimize')) {
    return `Improved ${bullet}`;
  } else if (bullet.toLowerCase().includes('manage') || bullet.toLowerCase().includes('lead') || bullet.toLowerCase().includes('direct')) {
    return `Led ${bullet}`;
  } else if (bullet.toLowerCase().includes('increase') || bullet.toLowerCase().includes('grow') || bullet.toLowerCase().includes('boost')) {
    return `Increased ${bullet}`;
  } else if (bullet.toLowerCase().includes('reduce') || bullet.toLowerCase().includes('decrease') || bullet.toLowerCase().includes('minimize')) {
    return `Reduced ${bullet}`;
  } else {
    return `Implemented ${bullet}`;
  }
};

const formatMetrics = (bullet: string): string => {
  // Format percentages
  bullet = bullet.replace(/(\d+)\s*%/g, '$1%');
  
  // Format large numbers with commas
  bullet = bullet.replace(/\b(\d{4,})\b/g, (match) => 
    parseInt(match).toLocaleString()
  );
  
  // Format currency
  bullet = bullet.replace(/\$\s*(\d+)/g, (match, num) => 
    `$${parseInt(num).toLocaleString()}`
  );

  return bullet;
};

const processBulletPoint = (bullet: string): string => {
  // Remove leading/trailing whitespace
  let processed = bullet.trim();

  // Remove leading articles
  processed = processed.replace(/^(the|a|an)\s+/i, '');

  // Ensure first letter is capitalized
  processed = processed.charAt(0).toUpperCase() + processed.slice(1);

  // Add action verb if needed
  processed = processActionVerb(processed);

  // Format metrics and numbers
  processed = formatMetrics(processed);

  // Ensure proper punctuation
  if (!/[.!?]$/.test(processed)) {
    processed += '.';
  }

  // Remove double periods
  processed = processed.replace(/\.+$/, '.');

  return processed;
};

const prompt = `
Parse the following resume with these props:
Extract all the information as it is. Do not add or remove anything from the data on your own. Also, do not add "Implemented" prefix to any bullet point. However, follow this rule - 
Parse all the data into this structure:
{
  personalInfo: {
    name: string;
    title: string;
    website?: string;
    email?: string;
    phone?: string;
    bio?: string;
    linkedin?: string;
    location?: string;
  },
  education: [{
    institution: string;
    major: string;
    start: string;
    end: string;
    degree: string;
    score: string;
  }],
  experience: [{
    company: string;
    role: string;
    start: string;
    end: string;
    responsibilities: string[];
    current: boolean;
  }],
  coreSkills: string[],
  projects: [{
    name: string;
    link: string;
    start: string;
    end: string;
    responsibilities: string[];
  }],
  certificates: [{
    name: string;
    issuer: string;
    issuedOn: string;
  }],
  achievements?: [{
    title: string;
    description: string;
  }];
  if cgpa is not present, give it as null
}`;


export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!apiKey) {
    return NextResponse.json({ message: 'API key is not configured.' }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get('resume') as File;

  if (!file) {
    return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
  }

  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Resume parsing timed out'));
      },20000);  
    });
    
    // Reduce generation config tokens and temperature
    

    const tempDir = os.tmpdir();
    const tempPath = path.join(tempDir, file.name);
    const fileBuffer = await file.arrayBuffer();
    await fs.writeFile(tempPath, Buffer.from(fileBuffer));

    const fileContent = await fs.readFile(tempPath);
    await fs.unlink(tempPath);

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.2
      }
    });

    const result = await Promise.race([
      model.generateContent([
        {
          inlineData: {
            mimeType: "application/pdf",
            data: fileContent.toString('base64')
          }
        },
        prompt
      ]),
      timeoutPromise
    ]);

    const response = await result.response;
    const text = await response.text();
    
    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}');
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error('Could not find valid JSON in the response.');
    }

    const jsonResponse = text.slice(jsonStartIndex, jsonEndIndex + 1);
    const parsedData: ResumeProps = JSON.parse(jsonResponse);

    const transformBullets = (responsibilities: string[]): string => {
      const listItems = responsibilities.map((item) => `<li>${item}</li>`).join('');
      return `<ul>${listItems}</ul>`;
    }

    const processedData: ResumeProps = {
      ...parsedData,
      userId: 'default-user-id',
      //@ts-ignore
      state: 'EDITING',
      templateId: 'default-template-id',
      skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
      coreSkills: Array.isArray(parsedData.coreSkills) ? parsedData.coreSkills : [],
      experience: (parsedData.experience || []).map((exp): any => ({
        ...exp,
        responsibilities: Array.isArray(exp.responsibilities) 
          ? transformBullets(
              exp.responsibilities
                .filter((resp) => resp.trim())
                .map(processBulletPoint)
            ).split('</li>').filter(item => item.trim() !== '<ul>' && item.trim() !== '')
          : []
      })),
      projects: (parsedData.projects || []).map((proj): any => ({
        ...proj,
        responsibilities: Array.isArray(proj.responsibilities)
          ? transformBullets(
              proj.responsibilities
                .filter((resp) => resp.trim())
                .map(processBulletPoint)
            ).split('</li>').filter(item => item.trim() !== '<ul>' && item.trim() !== '')
          : []
      }))
    };

    return NextResponse.json(processedData);

  } catch (error) {
    console.error('Error in resume parsing:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}