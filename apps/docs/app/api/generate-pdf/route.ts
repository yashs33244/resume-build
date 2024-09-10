import wkhtmltopdf from 'wkhtmltopdf';
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';

interface WkhtmltopdfOptions {
  pageHeight: string;
  pageWidth: string;
  // pageSize: string;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  'enable-local-file-access'?: boolean;  // Add this option to allow local file access
}

export async function POST(req: NextRequest) {
  try {
    const { html } = await req.json() as { html: string };

    if (!html) {
      return NextResponse.json({ error: 'No HTML content provided' }, { status: 400 });
    }

    // Generate the PDF buffer
    const buffer: Buffer = await new Promise((resolve, reject) => {
      const options: WkhtmltopdfOptions = {
        // pageSize: 'A4',
        pageHeight: '842px',
        pageWidth: '595px',
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        'enable-local-file-access': true,  // Enable local file access
      };

      wkhtmltopdf(html, options, (err: Error | null, stream: Readable | undefined) => {
        if (err) return reject(err);
        if (stream) {
          const chunks: Buffer[] = [];
          stream.on('data', (chunk: Buffer) => chunks.push(chunk));
          stream.on('end', () => resolve(Buffer.concat(chunks)));
        } else {
          reject(new Error('PDF stream is undefined'));
        }
      });
    });

    // Return the PDF
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=resume.pdf',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'PDF generation failed', message: error.message }, { status: 500 });
  }
}
