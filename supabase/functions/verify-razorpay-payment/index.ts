// @ts-expect-error - Deno runtime import
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { corsHeaders } from '../_shared/cors';
import { getSupabaseClient, supabaseAdmin } from '../_shared/supabase';

interface OrderItem {
  variant_id: string;
  quantity: number;
}

// HMAC-SHA256 signature verification using Web Crypto API (available in Deno runtime)
async function verifyRazorpaySignature(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  secret: string
): Promise<boolean> {
  const message = `${razorpay_order_id}|${razorpay_payment_id}`;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  const signatureHex = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return signatureHex === razorpay_signature;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = getSupabaseClient(req);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(JSON.stringify({ error: 'Missing payment verification fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1. Verify HMAC-SHA256 signature
    // @ts-expect-error - Deno.env is available in Deno runtime
    const isValid = await verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      // @ts-expect-error - Deno.env is available in Deno runtime
      Deno.env.get('RAZORPAY_KEY_SECRET')!
    );

    if (!isValid) {
      // Mark payment as failed in DB
      await supabaseAdmin
        .from('orders')
        .update({ payment_status: 'failed', status: 'cancelled' })
        .eq('razorpay_order_id', razorpay_order_id);

      return new Response(JSON.stringify({ error: 'Invalid payment signature' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Update order to confirmed/captured
    const { data: order, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'confirmed',
        payment_status: 'captured',
        razorpay_payment_id,
        razorpay_signature,
        updated_at: new Date().toISOString(),
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .eq('user_id', user.id)
      .select('*, order_items(*)')
      .single();

    if (updateError || !order) {
      throw new Error('Order not found or could not be updated');
    }

    // 3. Deduct stock and log inventory changes
    for (const item of order.order_items as OrderItem[]) {
      const { data: variant } = await supabaseAdmin
        .from('product_variants')
        .select('stock_quantity')
        .eq('id', item.variant_id)
        .single();

      if (!variant) continue;

      const previousQty = variant.stock_quantity;
      const newQty = Math.max(0, previousQty - item.quantity);

      await supabaseAdmin
        .from('product_variants')
        .update({ stock_quantity: newQty, updated_at: new Date().toISOString() })
        .eq('id', item.variant_id);

      await supabaseAdmin.from('inventory_logs').insert({
        variant_id: item.variant_id,
        change_type: 'sale',
        quantity_change: -item.quantity,
        previous_quantity: previousQty,
        new_quantity: newQty,
        reason: 'order_placed',
        reference_id: order.id,
        performed_by: user.id,
      });
    }

    // 4. Record coupon usage
    if (order.coupon_id) {
      await supabaseAdmin.from('coupon_usages').insert({
        coupon_id: order.coupon_id,
        user_id: user.id,
        order_id: order.id,
      });
      await supabaseAdmin.rpc('increment_coupon_usage', { coupon_id_input: order.coupon_id });
    }

    // 5. Clear cart items
    const { data: cartData } = await supabaseAdmin
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (cartData) {
      await supabaseAdmin.from('cart_items').delete().eq('cart_id', cartData.id);
    }

    // 6. Send order confirmation email
    await supabaseAdmin.functions.invoke('send-order-email', {
      body: { order_id: order.id, type: 'confirmation' },
    });

    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        order_number: order.order_number,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error('verify-razorpay-payment error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
