// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '../db';


// Force dynamic to prevent static optimization
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // Use Node.js runtime instead of edge

export async function POST(request: NextRequest) {
  const db = getPrismaClient();
  
  try {
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