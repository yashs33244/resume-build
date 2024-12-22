import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";
import { createSubscription } from '../../../../utils/subscription';

// Initialize Razorpay with credentials from environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

// POST handler for creating subscription and Razorpay order
export async function POST(request: NextRequest) {
  try {
    // Parse incoming request data
    const { userId, planId } = await request.json();

    console.log('userId:', userId);
    console.log('planId:', planId);

    // Validate required fields
    if (!userId || !planId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Determine the subscription amount based on the planId
    let amount: number;
    if (planId === '30-day-plan') {
      amount = 19900; // 199 INR in paise
    } else if (planId === '90-day-plan') {
      amount = 49900; // 499 INR in paise
    } else {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${new Date().getTime()}`,
      payment_capture: true, // Automatically capture payment
    });

    // Return Razorpay order ID and payment details to the frontend
    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
