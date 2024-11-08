import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '../../db';
import { authOptions } from '../../lib/auth';
import path from 'path';
import { ResumeState } from "../../../types/ResumeProps"; // Adjust the import path as necessary

// Chrome executable paths for different environments
const CHROME_PATHS = {
  LINUX: '/usr/bin/google-chrome',
  LINUX_CHROME: '/usr/bin/chromium',
  LINUX_CHROMIUM: '/usr/bin/chromium-browser',
  MAC: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  WIN: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  WIN_X86: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
};

// Function to get Chrome path based on platform
const getChromePath = () => {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  if (process.env.CHROME_BIN) {
    return process.env.CHROME_BIN;
  }

  // For Vercel or similar serverless environments
  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    return process.env.CHROME_EXECUTABLE_PATH || '/opt/chrome/chrome';
  }

  const platform = process.platform;
  
  if (platform === 'linux') {
    // Try different Linux paths
    return [CHROME_PATHS.LINUX, CHROME_PATHS.LINUX_CHROME, CHROME_PATHS.LINUX_CHROMIUM]
      .find(path => require('fs').existsSync(path)) || CHROME_PATHS.LINUX;
  }
  
  if (platform === 'darwin') {
    return CHROME_PATHS.MAC;
  }
  
  if (platform === 'win32') {
    return require('fs').existsSync(CHROME_PATHS.WIN) 
      ? CHROME_PATHS.WIN 
      : CHROME_PATHS.WIN_X86;
  }

  throw new Error('Unsupported platform for Chrome');
};

// Dynamically import puppeteer based on environment
const getPuppeteer = async () => {
  try {
    if (process.env.NODE_ENV === 'development') {
      const puppeteer = await import('puppeteer');
      return {
        ...puppeteer,
        launch: (options = {}) => puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
          ],
          ...options,
        })
      };
    }
    
    // In production
    const puppeteer = await import('puppeteer-core');
    return {
      ...puppeteer,
      launch: (options = {}) => puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
        executablePath: getChromePath(),
        ...options,
      })
    };
  } catch (error) {
    console.error('Error initializing puppeteer:', error);
    throw new Error('Failed to initialize PDF generator');
  }
};

export async function POST(request: NextRequest) {
  let browser;
  
  let resumeId;

  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { html } = body;
    resumeId = body.resumeId;

    if (!html || !resumeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // User validation and payment check
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, status: true }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
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
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    // Update resume state to processing
    await db.resume.update({
      where: { id: resume.id },
      data: { state: ResumeState.DOWNLOADING }
    });

    // Initialize puppeteer with error handling
    const puppeteer = await getPuppeteer();
    browser = await puppeteer.launch().catch(error => {
      console.error('Browser launch error:', error);
      throw new Error('Failed to launch PDF generator');
    });

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

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      preferCSSPageSize: true,
      width: '595px', // A4 width in pixels
      height: '842px', // A4 height in pixels
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 }, // Remove margins
    });

    // Update resume state to success
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
    
    // Update resume state to error
    if (resumeId) {
      await db.resume.update({
        where: { id: resumeId },
        data: { state: ResumeState.DOWNLOAD_FAILED }
      }).catch(console.error);
    }

    return NextResponse.json(
      { 
        error: 'PDF generation failed', 
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );

  } finally {
    if (browser) {
      await browser.close().catch(console.error);
    }
    await db.$disconnect().catch(console.error);
  }
}