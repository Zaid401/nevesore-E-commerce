// @ts-expect-error - Deno runtime import
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { corsHeaders } from '../_shared/cors';
import { getSupabaseClient, supabaseAdmin } from '../_shared/supabase';

interface CartVariant {
  id: string;
  sku: string;
  stock_quantity: number;
  price_override: number | null;
  is_active: boolean;
  product: {
    id: string;
    name: string;
    base_price: number;
    sale_price: number | null;
    is_active: boolean;
  };
  color: { color_name: string };
  size: { size_label: string };
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

    const { address_id, coupon_code } = await req.json();

    // 1. Fetch user's cart with items and validate stock
    const { data: cart } = await supabaseAdmin
      .from('carts')
      .select(`
        id,
        cart_items (
          id, quantity,
          variant:product_variants (
            id, sku, stock_quantity, price_override, is_active,
            product:products (id, name, base_price, sale_price, is_active),
            color:product_colors (color_name),
            size:sizes (size_label)
          )
        )
      `)
      .eq('user_id', user.id)
      .single();

    if (!cart || !cart.cart_items?.length) {
      return new Response(JSON.stringify({ error: 'Cart is empty' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Validate stock and calculate subtotal
    let subtotal = 0;
    const validatedItems: Array<{
      variant_id: string;
      product_name: string;
      color_name: string;
      size_label: string;
      sku: string;
      quantity: number;
      unit_price: number;
      total_price: number;
    }> = [];

    for (const item of cart.cart_items) {
      const variant = item.variant as CartVariant;
      if (!variant.is_active || !variant.product.is_active) {
        return new Response(
          JSON.stringify({ error: `Product "${variant.product.name}" is no longer available` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (variant.stock_quantity < item.quantity) {
        return new Response(
          JSON.stringify({
            error: `Insufficient stock for ${variant.product.name} — ${variant.color.color_name} / ${variant.size.size_label}. Only ${variant.stock_quantity} left.`,
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const unitPrice: number = variant.price_override ?? variant.product.sale_price ?? variant.product.base_price;
      subtotal += unitPrice * item.quantity;

      validatedItems.push({
        variant_id: variant.id,
        product_name: variant.product.name,
        color_name: variant.color.color_name,
        size_label: variant.size.size_label,
        sku: variant.sku,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: unitPrice * item.quantity,
      });
    }

    // 3. Apply coupon if provided
    let discountAmount = 0;
    let couponId: string | null = null;

    if (coupon_code) {
      const { data: coupon } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('code', (coupon_code as string).toUpperCase())
        .eq('is_active', true)
        .single();

      if (coupon) {
        const now = new Date();
        const validFrom = new Date(coupon.valid_from);
        const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;

        if (now >= validFrom && (!validUntil || now <= validUntil)) {
          if (!coupon.usage_limit || coupon.used_count < coupon.usage_limit) {
            const { count } = await supabaseAdmin
              .from('coupon_usages')
              .select('*', { count: 'exact', head: true })
              .eq('coupon_id', coupon.id)
              .eq('user_id', user.id);

            if (!count || count < coupon.per_user_limit) {
              if (subtotal >= coupon.min_order_amount) {
                if (coupon.discount_type === 'percentage') {
                  discountAmount = (subtotal * coupon.discount_value) / 100;
                  if (coupon.max_discount_amount) {
                    discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
                  }
                } else {
                  discountAmount = Math.min(coupon.discount_value, subtotal);
                }
                couponId = coupon.id;
              }
            }
          }
        }
      }
    }

    // 4. Calculate final totals
    const shippingCost = subtotal >= 999 ? 0 : 99; // free shipping above ₹999
    const taxRate = 0.18; // 18% GST
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = Math.round(taxableAmount * taxRate * 100) / 100;
    const totalAmount = Math.round((taxableAmount + taxAmount + shippingCost) * 100) / 100;

    // 5. Fetch shipping address
    const { data: address } = await supabaseAdmin
      .from('addresses')
      .select('*')
      .eq('id', address_id)
      .eq('user_id', user.id)
      .single();

    if (!address) {
      return new Response(JSON.stringify({ error: 'Invalid or missing shipping address' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 6. Generate order number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `ORD-${dateStr}-${random}`;

    // 7. Create Razorpay order
    // @ts-expect-error - Deno.env is available in Deno runtime
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')!
    // @ts-expect-error - Deno.env is available in Deno runtime
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')!;
    const razorpayAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);

    const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${razorpayAuth}`,
      },
      body: JSON.stringify({
        amount: Math.round(totalAmount * 100), // Razorpay expects paise
        currency: 'INR',
        receipt: orderNumber,
        notes: {
          user_id: user.id,
          order_number: orderNumber,
        },
      }),
    });

    const rzpOrder = await rzpResponse.json();
    if (!rzpResponse.ok) {
      throw new Error(`Razorpay error: ${JSON.stringify(rzpOrder)}`);
    }

    // 8. Create order in database
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        status: 'pending',
        shipping_full_name: address.full_name,
        shipping_phone: address.phone,
        shipping_address_line_1: address.address_line_1,
        shipping_address_line_2: address.address_line_2 ?? null,
        shipping_city: address.city,
        shipping_state: address.state,
        shipping_postal_code: address.postal_code,
        shipping_country: address.country,
        subtotal,
        discount_amount: discountAmount,
        shipping_cost: shippingCost,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        coupon_id: couponId,
        coupon_code: coupon_code ? (coupon_code as string).toUpperCase() : null,
        payment_status: 'pending',
        razorpay_order_id: rzpOrder.id,
      })
      .select('id')
      .single();

    if (orderError) throw orderError;

    // 9. Create order items
    await supabaseAdmin.from('order_items').insert(
      validatedItems.map((item) => ({ order_id: order!.id, ...item }))
    );

    // 10. Return Razorpay checkout info to frontend
    return new Response(
      JSON.stringify({
        order_id: order!.id,
        order_number: orderNumber,
        razorpay_order_id: rzpOrder.id,
        razorpay_key_id: razorpayKeyId,
        amount: Math.round(totalAmount * 100),
        currency: 'INR',
        prefill: {
          name: address.full_name,
          email: user.email,
          contact: address.phone,
        },
        summary: {
          subtotal,
          discount_amount: discountAmount,
          shipping_cost: shippingCost,
          tax_amount: taxAmount,
          total_amount: totalAmount,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error('create-razorpay-order error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
