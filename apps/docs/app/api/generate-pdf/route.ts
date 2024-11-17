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
      if (process.env.NODE_ENV === 'development') {
          const puppeteer = await import('puppeteer');
          return configurePuppeteer(puppeteer);
      }

      const puppeteer = await import('puppeteer-core');
      const executablePath = (await chromium.executablePath) || getChromePath();

      if (!executablePath) {
          throw new Error('Failed to locate Chromium executable path.');
      }

      return configurePuppeteer(puppeteer, {
          executablePath,
          args: chromium.args,
      });
  } catch (error:any) {
      console.error('Puppeteer initialization error:', error);
      throw new Error(`Failed to initialize PDF generator: ${error.message}`);
  }
};


const configurePuppeteer = (puppeteer:any, additionalOptions = {}) => ({
  ...puppeteer,
  launch: (options = {}) => puppeteer.launch({
      headless: true,
      args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--font-render-hinting=none',
          '--disable-web-security',
          '--allow-file-access-from-files',
          '--single-process', // Serverless compatibility
          '--disable-extensions', // Prevent extension issues
      ],
      ignoreHTTPSErrors: true,
      timeout: 60000,
      ...additionalOptions,
      ...options,
  })
});


export async function POST(request: NextRequest) {
  let browser;
  let resumeId;

  try {
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

      const user = await db.user.findUnique({
          where: { email: session.user.email },
          select: { id: true, status: true },
      });

      if (!user) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      if (user.status !== 'PAID') {
          return NextResponse.json({ error: 'Please upgrade to premium to generate PDF' }, { status: 403 });
      }

      const resume = await db.resume.findFirst({
          where: { userId: user.id, id: resumeId },
      });

      if (!resume) {
          return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
      }

      await db.resume.update({
          where: { id: resume.id },
          data: { state: ResumeState.DOWNLOADING },
      });

      const puppeteer = await getPuppeteer();
      browser = await puppeteer.launch();

      const page = await browser.newPage();
      await page.setViewport({
          width: 595,
          height: 842,
          deviceScaleFactor: 2,
      });

      await Promise.race([
          page.setContent(html, {
              waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
              timeout: 60000,
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Content loading timeout')), 60000)),
      ]);

      const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
      });

      await db.resume.update({
          where: { id: resume.id },
          data: { state: ResumeState.DOWNLOAD_SUCCESS },
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
  } catch (error:any) {
      console.error('PDF generation error:', error);

      if (resumeId) {
          await db.resume.update({
              where: { id: resumeId },
              data: { state: ResumeState.DOWNLOAD_FAILED },
          }).catch(console.error);
      }

      return NextResponse.json({
          error: 'PDF generation failed',
          message: error.message,
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }, { status: 500 });

  } finally {
      if (browser) {
          try {
              await browser.close();
          } catch (closeError) {
              console.error('Failed to close browser:', closeError);
          }
      }
      try {
          await db.$disconnect();
      } catch (dbError) {
          console.error('Failed to disconnect database:', dbError);
      }
  }
}
