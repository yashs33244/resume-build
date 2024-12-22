import { NextRequest, NextResponse } from "next/server";
import { createSubscription } from '../../../../utils/subscription';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { userId, paymentDetails, planId } = await request.json();
    
    console.log('Confirming payment:', { userId, planId, paymentDetails });

    const { 
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature 
    } = paymentDetails;

    // Validate required fields
    if (!userId || !planId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment details' },
        { status: 400 }
      );
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const secret = process.env.RAZORPAY_KEY_SECRET as string;
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(text)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      console.error('Signature verification failed');
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Create subscription
    const subscription = await createSubscription({
      userId,
      planId,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription created',
      subscription
    });

  } catch (error) {
    console.error('Error processing payment confirmation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process payment confirmation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}