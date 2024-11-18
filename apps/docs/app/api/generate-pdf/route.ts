import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '../../db';
import { authOptions } from '../../lib/auth';
import { ResumeState } from '../../../types/ResumeProps';
import puppeteer from 'puppeteer';
import { JSDOM } from 'jsdom';

class HTMLConverter {
  private static async convertToPostScript(html: string, css: string): Promise<string> {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Inline the CSS
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Convert to PostScript compatible format
    const psContent = `
      %!PS-Adobe-3.0
      %%BeginSetup
      /Times-Roman findfont
      12 scalefont
      setfont
      %%EndSetup
      
      % Define text rendering
      /drawText {
        moveto
        show
      } def
      
      % Start content
      ${this.generatePostScriptContent(document.body, dom.window as unknown as Window & typeof globalThis)}
      
      showpage
    `;

    return psContent;
  }

  private static generatePostScriptContent(element: Element, window: Window): string {
    let content = '';
    
    // Use getComputedStyle from the JSDOM window
    const styles = (window as any).getComputedStyle(element);
    
    // Convert element position and styles to PostScript commands
    if (element.textContent) {
      const x = parseInt(styles.left) || 0;
      const y = parseInt(styles.top) || 0;
      content += `
        (${element.textContent.replace(/[()]/g, '\\$&')})
        ${x} ${y} drawText
      `;
    }

    // Process children
    Array.from(element.children).forEach(child => {
      content += this.generatePostScriptContent(child, window);
    });

    return content;
  }
}

async function generatePDF(htmlContent: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport to A4 size
    await page.setViewport({
      width: 595,
      height: 842,
      deviceScaleFactor: 2
    });

    // Set content and wait for everything to load
    await page.setContent(htmlContent, {
      waitUntil: ['networkidle0', 'load', 'domcontentloaded']
    });

    // Inject default styles
    await page.addStyleTag({
      content: `
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');
        

        
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
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

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    // Generate PDF with high-quality settings
    const pdfBuffer = await page.pdf({
      preferCSSPageSize: true,
      width: '595px', // A4 width in pixels
      height: '842px', // A4 height in pixels
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 }, // Remove margins
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

export async function POST(request: NextRequest) {
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

    // Get request body
    const body = await request.json();
    const { html, css, resumeId: providedResumeId } = body;
    resumeId = providedResumeId;

    if (!html || !resumeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check user and permissions
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

    // Update resume state
    await db.resume.update({
      where: { id: resumeId },
      data: { state: ResumeState.DOWNLOADING }
    });

    // Generate PDF
    const pdfBuffer = await generatePDF(html);

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

    // Update error state
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