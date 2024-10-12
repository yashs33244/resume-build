import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

console.log('GEMINI_API_KEY is set:', !!process.env.GOOGLE_API_KEY);

const apiKey = process.env.GOOGLE_API_KEY || '';
if (!apiKey) {
  console.error('GEMINI_API_KEY is not set in the environment variables.');
}

let genAI: GoogleGenerativeAI;
try {
  genAI = new GoogleGenerativeAI(apiKey);
  console.log('GoogleGenerativeAI client initialized successfully');
} catch (error) {
  console.error('Error initializing GoogleGenerativeAI client:', error);
}

const prompt = `Parse the following resume and extract key information into a structured JSON format. Include sections for personal information, education, work experience, skills, and any other relevant categories. Ensure the output is valid JSON.`;

export async function POST(request: NextRequest) {
    console.log('Received POST request to /api/resume/parseResume');
  
    if (!apiKey) {
      console.error('API key is not configured.');
      return NextResponse.json({ message: 'API key is not configured.' }, { status: 500 });
    }
  
    const formData = await request.formData();
    const file = formData.get('resume') as File;
  
    if (!file) {
      console.error('No file uploaded');
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }
  
    try {
      console.log('Processing file:', file.name);
  
      const tempDir = os.tmpdir();
      const tempPath = path.join(tempDir, file.name);
      const fileBuffer = await file.arrayBuffer();
      await fs.writeFile(tempPath, Buffer.from(fileBuffer));
  
      console.log('File saved to temporary path:', tempPath);
  
      const fileContent = await fs.readFile(tempPath);
  
      console.log('File read successfully, size:', fileContent.length);
  
      await fs.unlink(tempPath);
      console.log('Temporary file deleted');
  
      console.log('Initializing Gemini model');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
      console.log('Sending request to Gemini API');
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: "application/pdf",
            data: fileContent.toString('base64')
          }
        },
        prompt
      ]);
  
      console.log('Received response from Gemini API');
  
      // Log the raw response to understand its structure
      const response = await result.response;
      const text = await response.text();
      console.log('Raw response:', text);
  
      // Attempt to extract valid JSON
      const jsonStartIndex = text.indexOf('{');
      const jsonEndIndex = text.lastIndexOf('}');
      if (jsonStartIndex === -1 || jsonEndIndex === -1) {
        throw new Error('Could not find valid JSON in the response.');
      }
  
      const jsonResponse = text.slice(jsonStartIndex, jsonEndIndex + 1);
  
      console.log('Parsing JSON response');
      const resumeData = JSON.parse(jsonResponse);
  
      // Add default fields
      resumeData.userId = 'default-user-id';
      resumeData.state = 'EDITING';
      resumeData.templateId = 'default-template-id';
  
      console.log('Sending response back to client');
      return NextResponse.json(resumeData);
  
    } catch (error) {
      console.error('Error in resume parsing:', error);
      if (error instanceof Error) {
        console.error('GoogleGenerativeAIError details:', error.message, error.stack);
        return NextResponse.json({ message: 'Error with Gemini API: ' + error.message }, { status: 500 });
      }
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
  

export const config = {
  api: {
    bodyParser: false,
  },
};