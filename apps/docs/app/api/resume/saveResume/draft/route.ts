// app/api/resume/draft/route.ts
import { NextResponse } from 'next/server';

import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../../lib/auth';
import { db } from '../../../../db';


export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const { resumeId, content } = await request.json();

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Upsert the draft (create if not exists, update if exists)
    const draft = await db.resumeDraft.upsert({
      where: {
        userId_resumeId: {
          userId: user.id,
          resumeId,
        },
      },
      update: {
        content,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        resumeId,
        content,
      },
    });

    return NextResponse.json({ message: 'Draft saved successfully', draftId: draft.id });
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json({ message: 'Error saving draft', error }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const resumeId = searchParams.get('resumeId');

  if (!session?.user?.email || !resumeId) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  try {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const draft = await db.resumeDraft.findUnique({
      where: {
        userId_resumeId: {
          userId: user.id,
          resumeId,
        },
      },
    });

    return NextResponse.json({ draft });
  } catch (error) {
    console.error('Error fetching draft:', error);
    return NextResponse.json({ message: 'Error fetching draft', error }, { status: 500 });
  }
}