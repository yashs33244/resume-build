import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User does not exist' }, { status: 404 });
    }

    const resume = await db.resume.findFirst({
      where: { userId: user.id },
      select: { state: true, createdAt: true },
    });

    if (!resume) {
      return NextResponse.json({ message: 'No resume found' }, { status: 404 });
    }

    return NextResponse.json({
      state: resume.state,
      createdAt: resume.createdAt,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching resume state:', error);
    return NextResponse.json({ message: 'Error fetching resume state', error }, { status: 500 });
  }
}
