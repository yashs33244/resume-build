import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: NextRequest) {
  try {
    const { html } = await req.json();
    
    if (!html) {
      return NextResponse.json({ error: 'No HTML content provided' }, { status: 400 });
    }

    // Launch a browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the content of the page to the provided HTML
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate the PDF

    
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');
        
        @page { 
          margin: 0 !important; 
        }
        
        body {
          font-family: 'CustomFont', sans-serif;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
        }
      `;
      document.head.appendChild(style);
    });
    const pdfBuffer = await page.pdf({
      preferCSSPageSize: true,
      width: '595px',
      height: '842px',
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 }, // Remove margins
    });
    await browser.close();
    

    // Return the PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=document.pdf',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'PDF generation failed', message: error.message }, { status: 500 });
  }
}
