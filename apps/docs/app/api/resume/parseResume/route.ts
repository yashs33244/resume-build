// Modified API code (api/resume/parseResume.ts)
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


const apiKey = process.env.GOOGLE_API_KEY || '';

const genAI = new GoogleGenerativeAI(apiKey);

// Enhanced prompt with specific formatting instructions
const prompt = `
Parse the following resume with these props and follow these specific formatting rules:

1. Skills should be categorized into two arrays:
   - skills: General technical and soft skills
   - coreSkills: Primary technical skills or specializations

2. For experience and projects:
   - Convert any paragraph descriptions into bullet points
   - Each bullet point should start with an action verb
   - Focus on achievements and quantifiable results
   - Remove any articles (a, an, the) from the beginning of bullets
   
Parse into this structure:
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
    score: number;
  }],
  experience: [{
    company: string;
    role: string;
    start: string;
    end: string;
    responsibilities: string[];
    current: boolean;
  }],
  skills: string[],
  coreSkills: string[],
  projects: [{
    name: string;
    link: string;
    start: string;
    end: string;
    responsibilities: string[];
  }]


  if cgpa is not present, give it as null
}`;

export async function POST(request: NextRequest) {
  if (!apiKey) {
    return NextResponse.json({ message: 'API key is not configured.' }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get('resume') as File;

  if (!file) {
    return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
  }

  try {
    const tempDir = os.tmpdir();
    const tempPath = path.join(tempDir, file.name);
    const fileBuffer = await file.arrayBuffer();
    await fs.writeFile(tempPath, Buffer.from(fileBuffer));

    const fileContent = await fs.readFile(tempPath);
    await fs.unlink(tempPath);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "application/pdf",
          data: fileContent.toString('base64')
        }
      },
      prompt
    ]);

    const response = await result.response;
    const text = await response.text();

    // Extract and parse JSON
    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}');
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error('Could not find valid JSON in the response.');
    }

    const jsonResponse = text.slice(jsonStartIndex, jsonEndIndex + 1);
    const parsedData = JSON.parse(jsonResponse);

    // Post-process the parsed data
    const processedData = {
      ...parsedData,
      userId: 'default-user-id',
      state: 'EDITING',
      templateId: 'default-template-id',
      // Ensure skills are properly categorized
      skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
      coreSkills: Array.isArray(parsedData.coreSkills) ? parsedData.coreSkills : [],
      // Process experience responsibilities
      experience: parsedData.experience?.map((exp: any) => ({
        ...exp,
        responsibilities: Array.isArray(exp.responsibilities) 
          ? exp.responsibilities.map((resp: string) => resp.trim().replace(/^(the|a|an)\s+/i, ''))
          : []
      })) || [],
      // Process project responsibilities
      projects: parsedData.projects?.map((proj: any) => ({
        ...proj,
        responsibilities: Array.isArray(proj.responsibilities)
          ? proj.responsibilities.map((resp: string) => resp.trim().replace(/^(the|a|an)\s+/i, ''))
          : []
      })) || []
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

