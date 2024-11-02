// app/api/subscription/create/route.ts
import { NextResponse } from 'next/server';
import { createSubscription } from '../../../../utils/subscription';

export async function POST(request: Request) {
  try {
    const { userId, planId } = await request.json();
    console.log('userId:', userId);
    console.log('planId:', planId);


    if (!userId || !planId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const subscription = await createSubscription(userId, planId);

    return NextResponse.json(
      { 
        message: 'Subscription created successfully',
        subscription 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}