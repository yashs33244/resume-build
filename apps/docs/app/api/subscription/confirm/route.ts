// Handle Razorpay Payment Confirmation
export async function POST(request: NextRequest) {
    try {
      const { userId, paymentDetails, planId } = await request.json();
      console.log('paymentDetails:', paymentDetails);
      
      // Ensure the payment details include the required Razorpay fields
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = paymentDetails;
  
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return NextResponse.json(
          { error: 'Missing payment details' },
          { status: 400 }
        );
      }
  
      // Here, verify the Razorpay payment signature for security purposes
      const generated_signature = generateSignature(razorpay_order_id, razorpay_payment_id);
  
      if (generated_signature !== razorpay_signature) {
        return NextResponse.json(
          { error: 'Payment signature mismatch' },
          { status: 400 }
        );
      }
  
      // Proceed to create the subscription after verifying payment success
      const subscription = await createSubscription(userId, planId);
      
      // Respond with success
      return NextResponse.json(
        { message: 'Subscription confirmed', subscription },
        { status: 200 }
      );
      
    } catch (error) {
      console.error('Error confirming payment:', error);
      return NextResponse.json(
        { error: 'Failed to confirm payment' },
        { status: 500 }
      );
    }
  }
  
  // Helper function to generate Razorpay signature (this is just an example)
  function generateSignature(orderId: string, paymentId: string): string {
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    const body = `${orderId}|${paymentId}`;
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', key_secret);
    return hmac.update(body).digest('hex');
  }
  