import wkhtmltopdf from 'wkhtmltopdf';
const pathToBinary = '/usr/local/bin/wkhtmltopdf';
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';

interface WkhtmltopdfOptions {
  pageSize: string;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
}

// Named export for handling POST requests
export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body
    const { html } = await req.json() as { html: string };

    if (!html) {
      return NextResponse.json({ error: 'No HTML content provided' }, { status: 400 });
    }

    // Generate the PDF buffer
    const buffer: Buffer = await new Promise((resolve, reject) => {
      const options: WkhtmltopdfOptions = {
        pageSize: 'A4',
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
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

    // Set response headers and return the PDF as a file
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
