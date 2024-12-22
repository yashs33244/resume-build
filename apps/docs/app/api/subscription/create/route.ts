import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";
import { createSubscription } from '../../../../utils/subscription';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

// Plan configurations
const PLAN_AMOUNTS = {
  '30-day-plan': 24900, // 199 INR in paise
  '90-day-plan': 59900  // 499 INR in paise
} as const;

export async function POST(request: NextRequest) {
  try {
    const { userId, planId } = await request.json();
    console.log('Creating order for:', { userId, planId });

    // Validate inputs
    if (!userId || !planId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and planId are required' },
        { status: 400 }
      );
    }

    // Validate plan
    if (!PLAN_AMOUNTS.hasOwnProperty(planId)) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    const amount = PLAN_AMOUNTS[planId as keyof typeof PLAN_AMOUNTS];

    // Generate a shorter receipt ID (max 40 chars)
    // Take first 8 chars of userId and timestamp to ensure uniqueness
    const timestamp = Date.now().toString().slice(-8);
    const userIdShort = userId.slice(0, 8);
    const receipt = `rcpt_${userIdShort}_${timestamp}`;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt,
      notes: {
        userId,
        planId
      }
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}