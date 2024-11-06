// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../db';


// Explicitly set Node.js runtime and force dynamic
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    if (request.method !== 'POST') {
      return NextResponse.json(
        { message: 'Method not allowed' },
        { status: 405 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email },
      select: { name: true, email: true, profilePhoto: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}