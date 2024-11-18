import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '../../db';
import { authOptions } from '../../lib/auth';
import { ResumeState } from "../../../types/ResumeProps";
import chromium from '@sparticuz/chromium';

// Configure chrome paths with better edge case handling
const CHROME_PATHS = {
  LINUX: [
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/chrome',
  ],
  MAC: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ],
  WIN: [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ],
};

const getChromePath = () => {
  // Priority 1: Environment variables
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  if (process.env.CHROME_BIN) {
    return process.env.CHROME_BIN;
  }

  // Priority 2: Serverless environments (Vercel, AWS Lambda)
  if (process.env.AWS_LAMBDA_FUNCTION_VERSION || process.env.VERCEL) {
    return chromium.executablePath;
  }

  // Priority 3: Local environment detection
  const fs = require('fs');
  const platform = process.platform;
  
  let paths:any = [];
  if (platform === 'linux') paths = CHROME_PATHS.LINUX;
  else if (platform === 'darwin') paths = CHROME_PATHS.MAC;
  else if (platform === 'win32') paths = CHROME_PATHS.WIN;
  
  const existingPath = paths.find((path:any) => fs.existsSync(path));
  if (existingPath) return existingPath;

  throw new Error(`Chrome not found. Please set PUPPETEER_EXECUTABLE_PATH or CHROME_BIN environment variable.`);
};

const getPuppeteer = async () => {
  try {
    // Development environment
    if (process.env.NODE_ENV === 'development') {
      const puppeteer = await import('puppeteer');
      return configurePuppeteer(puppeteer);
    }

    // Production environment
    if (process.env.AWS_LAMBDA_FUNCTION_VERSION || process.env.VERCEL) {
      // Using chromium-aws-lambda for serverless environments
      const puppeteer = await import('puppeteer-core');
      return configurePuppeteer(puppeteer, {
        executablePath: await chromium.executablePath,
        args: chromium.args,
      });
    }

    // Standard production environment
    const puppeteer = await import('puppeteer-core');
    return configurePuppeteer(puppeteer, {
      executablePath: getChromePath(),
    });
  } catch (error:any) {
    console.error('Puppeteer initialization error:', error);
    throw new Error(`Failed to initialize PDF generator: ${error.message}`);
  }
};

const configurePuppeteer = (puppeteer: any, additionalOptions = {}) => ({
  ...puppeteer,
  launch: (options = {}) => puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=none', // Improve font rendering
      '--disable-web-security', // Allow loading custom fonts
      '--allow-file-access-from-files', // Allow loading local files if needed
    ],
    ignoreHTTPSErrors: true,
    timeout: 60000, // Increase timeout to 60 seconds
    ...additionalOptions,
    ...options,
  })
});

export async function POST(request: NextRequest) {
  let browser;
  let resumeId;

  try {
    // Authentication and validation (unchanged)
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { html } = body;
    resumeId = body.resumeId;

    if (!html || !resumeId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // User and payment validation (unchanged)
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, status: true }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.status !== 'PAID') {
      return NextResponse.json({ error: 'Please upgrade to premium to generate PDF' }, { status: 403 });
    }

    // Resume validation (unchanged)
    const resume = await db.resume.findFirst({
      where: { userId: user.id, id: resumeId }
    });

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Update state to processing
    await db.resume.update({
      where: { id: resume.id },
      data: { state: ResumeState.DOWNLOADING }
    });

    // Initialize puppeteer with enhanced error handling
    const puppeteer = await getPuppeteer();
    browser = await puppeteer.launch().catch((error:any) => {
      console.error('Browser launch error:', error);
      throw new Error(`Failed to launch browser: ${error.message}`);
    });

    const page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({
      width: 595, // A4 width in pixels
      height: 842, // A4 height in pixels
      deviceScaleFactor: 2, // Improve resolution
    });

    // Improved content setting with better error handling
    await Promise.race([
      page.setContent(html, {
        waitUntil: ['networkidle0', 'domcontentloaded'],
        timeout: 30000
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Content loading timeout')), 30000)
      )
    ]);

    // Enhanced font and styling injection
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

    // Update state to success
    await db.resume.update({
      where: { id: resume.id },
      data: { state: ResumeState.DOWNLOAD_SUCCESS }
    });

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume-${resumeId}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error: any) {
    console.error('PDF generation error:', error);
    
    // Update state to error
    if (resumeId) {
      await db.resume.update({
        where: { id: resumeId },
        data: { state: ResumeState.DOWNLOAD_FAILED }
      }).catch(console.error);
    }

    return NextResponse.json({ 
      error: 'PDF generation failed', 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });

  } finally {
    if (browser) {
      await browser.close().catch(console.error);
    }
    await db.$disconnect().catch(console.error);
  }
}