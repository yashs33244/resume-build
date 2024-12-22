import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

// Initialize Razorpay instance with your credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

// Handle POST request to create a subscription order
export async function POST(request: NextRequest) {
  try {
    const { userId, planId } = await request.json();

    // Map planId to subscription amount
    let amount: number;
    if (planId === '30-day-plan') {
      amount = 19900; // 199 INR for 30-day plan in paise
    } else if (planId === '90-day-plan') {
      amount = 49900; // 499 INR for 90-day plan in paise
    } else {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount, // Amount in paise
      currency: "INR",
      receipt: `receipt_${new Date().getTime()}`,
      payment_capture: 1, // Automatically capture payment
    });

    // Return order details to the frontend
    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
