import { GoogleGenerativeAI } from '@google/generative-ai';


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

const buildGoogleGenAIPrompt = (prompt: string) => ({
  contents: [
    { 
      role: 'user', 
      parts: [{ 
        text: `Please provide a short, professional response to the following prompt. The response should be in plain text, not markdown format, and should be concise and suitable for a resume or professional profile:\n\n${prompt}` 
      }] 
    }
  ],
});





export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      return new Response('Prompt is required', { status: 400 });
    }

    const geminiStream = await genAI
      .getGenerativeModel({ model: 'gemini-pro' })
      .generateContentStream(buildGoogleGenAIPrompt(prompt));

    // Collect the entire response
    let result = '';
    for await (const chunk of geminiStream.stream) {
      result += chunk.text();
    }

    // Trim any leading or trailing whitespace
    result = result.trim();

    // Return the full generated text
    return new Response(result, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    console.error('Error in generate API:', error);
    return new Response('Error generating content', { status: 500 });
  }
}