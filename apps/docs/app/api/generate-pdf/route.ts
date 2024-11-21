import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import puppeteer from 'puppeteer';
import { authOptions } from '../../lib/auth';
import { db } from '../../db';
import { ResumeState } from '../../../types/ResumeProps';

class PDFGenerator {
  private static async launchBrowser() {
    return puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer'
      ]
    });
  }

  static async generatePDF(htmlContent: string): Promise<Buffer> {
    const browser = await this.launchBrowser();

    try {
      const page = await browser.newPage();
      
      // Set viewport to A4 size
      await page.setViewport({
        width: 595,
        height: 842,
        deviceScaleFactor: 2
      });

      // Set content with robust loading
      await page.setContent(htmlContent, {
        waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
        timeout: 30000
      });

      // Inject enhanced styling
      await page.addStyleTag({
        content: `
          @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box;
          }
          a {
            color: inherit !important;
            text-decoration: none !important;
          }
          
          body {
            font-family: 'Open Sans', sans-serif !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            min-height: 100vh !important;
          }

          .wrapper {
            transform: scale(1) !important;
            width: 100% !important;
            min-height: 100vh !important;
            position: relative !important;
            overflow: hidden !important;
          }
        `
      });

      // Wait for fonts and rendering
      await page.evaluateHandle('document.fonts.ready');

      // Generate high-quality PDF
      const pdfBuffer = await page.pdf({
        preferCSSPageSize: true,
        width: '595px', // A4 width in pixels
        height: '842px', // A4 height in pixels
        printBackground: true,
        margin: { top: 0, bottom: 0, left: 0, right: 0 }, // Remove margins
      });

      return Buffer.from(pdfBuffer);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }
}

export async function POST(request: NextRequest) {
  let resumeId;

  try {
    // Authenticate session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { html, css, resumeId: providedResumeId } = body;
    resumeId = providedResumeId;

    // Validate input
    if (!html || !resumeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check user permissions
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

    // Update resume state to downloading
    await db.resume.update({
      where: { id: resumeId },
      data: { state: ResumeState.DOWNLOADING }
    });

    // Generate PDF
    const pdfBuffer = await PDFGenerator.generatePDF(html);

    // Update success state
    await db.resume.update({
      where: { id: resumeId },
      data: { state: ResumeState.DOWNLOAD_SUCCESS }
    });

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume-${resumeId}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error: any) {
    console.error('PDF generation error:', error);

    // Update error state if possible
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
    await db.$disconnect().catch(console.error);
  }
}