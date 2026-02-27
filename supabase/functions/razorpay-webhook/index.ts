// @ts-expect-error - Deno runtime import
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';

// Use Web Crypto API for webhook signature verification
async function verifyWebhookSignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return expectedSignature === signature;
}

serve(async (req: Request) => {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return new Response('Missing signature header', { status: 400 });
    }

    // Verify webhook signature
    // @ts-expect-error - Deno.env is available in Deno runtime
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')!;
    const isValid = await verifyWebhookSignature(bodyText, signature, webhookSecret);

    if (!isValid) {
      console.error('razorpay-webhook: invalid signature');
      return new Response('Invalid signature', { status: 400 });
    }

    const event = JSON.parse(bodyText);
    const eventType: string = event.event;

    console.log(`razorpay-webhook: received event "${eventType}"`);

    switch (eventType) {
      case 'payment.failed': {
        const paymentEntity = event.payload.payment.entity;
        const { error } = await supabaseAdmin
          .from('orders')
          .update({
            payment_status: 'failed',
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('razorpay_order_id', paymentEntity.order_id);

        if (error) {
          console.error('razorpay-webhook: failed to update order on payment.failed', error);
        }
        break;
      }

      case 'refund.processed': {
        const refundEntity = event.payload.refund.entity;
        const { error } = await supabaseAdmin
          .from('returns')
          .update({
            status: 'refund_completed',
            razorpay_refund_id: refundEntity.id,
            updated_at: new Date().toISOString(),
          })
          .eq('razorpay_refund_id', refundEntity.id);

        if (error) {
          console.error('razorpay-webhook: failed to update return on refund.processed', error);
        }
        break;
      }

      case 'payment.captured': {
        // Handle capture events for orders that may have been confirmed asynchronously
        const paymentEntity = event.payload.payment.entity;
        await supabaseAdmin
          .from('orders')
          .update({
            payment_status: 'captured',
            razorpay_payment_id: paymentEntity.id,
            updated_at: new Date().toISOString(),
          })
          .eq('razorpay_order_id', paymentEntity.order_id)
          .eq('payment_status', 'authorized'); // only update if still in authorized state
        break;
      }

      default:
        console.log(`razorpay-webhook: unhandled event type "${eventType}"`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('razorpay-webhook error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
