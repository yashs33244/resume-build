import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import puppeteer from 'puppeteer';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { html, resumeId } = await request.json();

    if (!session?.user?.email || !html || !resumeId) {
      return NextResponse.json(
        { message: 'Invalid input or user not authenticated' },
        { status: 400 }
      );
    }

    // Fetch user and check payment status
    const user = await prisma.user.findUnique({
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

    // Find the specific resume using resumeId
    const resume = await prisma.resume.findFirst({
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

    // Launch browser instance and generate PDF
    const browser = await puppeteer.launch({
      //@ts-ignore
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });


    // Inject custom font and styling
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

    await browser.close();

    await prisma.resume.update({
      where: { id: resume.id },
      data: { state: "DOWNLOAD_SUCCESS" }
    });

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
        'Cache-Control': 'no-cache'
      },
    });

  } catch (error: any) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'PDF generation failed', message: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
