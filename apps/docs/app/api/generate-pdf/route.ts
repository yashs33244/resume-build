import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '../../db';  
import { authOptions } from '../../lib/auth';



// Dynamically import puppeteer based on environment
const getPuppeteer = async () => {
  if (process.env.NODE_ENV === 'development') {
    const puppeteer = await import('puppeteer');
    return puppeteer;
  }
  
  // In production
  const puppeteer = await import('puppeteer-core');
  return {
    ...puppeteer,
    launch: (options: any = {}) => puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
      executablePath: process.env.CHROME_BIN || 
                     process.env.PUPPETEER_EXECUTABLE_PATH || 
                     '/usr/bin/google-chrome',
    })
  };
};

export async function POST(request: NextRequest) {
  let browser;
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    const { html, resumeId } = await request.json();

    if (!session?.user?.email || !html || !resumeId) {
      return NextResponse.json(
        { message: 'Invalid input or user not authenticated' },
        { status: 400 }
      );
    }

    // User validation and payment check
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, status: true }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.status !== 'PAID') {
      return NextResponse.json(
        { error: 'Please upgrade to premium to generate PDF' },
        { status: 403 }
      );
    }

    // Resume validation
    const resume = await db.resume.findFirst({
      where: {
        userId: user.id,
        id: resumeId
      }
    });

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Initialize puppeteer
    const puppeteer = await getPuppeteer();
    browser = await puppeteer.launch();
    const page = await browser.newPage();

   

    // Set content with extended timeout and wait options
    await page.setContent(html, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000
    });

    // Inject custom font and styling
    //@ts-ignore
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');
        
        @page { 
          margin: 0 !important; 
        }
        
        body {
          font-family: 'Open Sans', sans-serif;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
        }
      `;
      document.head.appendChild(style);
    });

    // Generate PDF with specific settings
    const pdfBuffer = await page.pdf({
      preferCSSPageSize: true,
      width: '595px', // A4 width in pixels
      height: '842px', // A4 height in pixels
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 }, // Remove margins
    });

    // Cleanup and update resume state
    await browser.close();
    await db.resume.update({
      where: { id: resume.id },
      data: { state: "DOWNLOAD_SUCCESS" }
    });

    // Return PDF with appropriate headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
        'Cache-Control': 'no-cache'
      },
    });

  } catch (error: any) {
    console.error('PDF generation error:', error);
    if (browser) {
      await browser.close();
    }
    return NextResponse.json(
      { error: 'PDF generation failed', message: error.message },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
    await db.$disconnect();
  }
}