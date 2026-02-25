// @ts-expect-error - Deno runtime import
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getSupabaseClient, supabaseAdmin } from '../_shared/supabase.ts';

interface RequestItem {
  variant_id: string;
  quantity: number;
}

interface VariantRow {
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

    const { items, address_id, coupon_code, payment_method } = await req.json() as {
      items: RequestItem[];
      address_id: string;
      coupon_code?: string;
      payment_method: 'online' | 'cod';
    };

    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Cart is empty' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1. Fetch variants from DB and validate stock
    const variantIds = items.map((i) => i.variant_id);
    const { data: variants, error: variantsError } = await supabaseAdmin
      .from('product_variants')
      .select(`
        id, sku, stock_quantity, price_override, is_active,
        product:products (id, name, base_price, sale_price, is_active),
        color:product_colors (color_name),
        size:sizes (size_label)
      `)
      .in('id', variantIds);

    if (variantsError || !variants) {
      throw new Error('Failed to fetch product variants');
    }

    const variantMap: Map<string, VariantRow> = new Map(
      variants.map((v: unknown) => [(v as VariantRow).id, v as VariantRow])
    );

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

    for (const item of items) {
      const variant = variantMap.get(item.variant_id);
      if (!variant) {
        return new Response(
          JSON.stringify({ error: `Product variant not found: ${item.variant_id}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
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

      const unitPrice = variant.price_override ?? variant.product.sale_price ?? variant.product.base_price;
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

    // 2. Apply coupon if provided
    let discountAmount = 0;
    let couponId: string | null = null;

    if (coupon_code) {
      const { data: coupon } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('code', coupon_code.toUpperCase())
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

    // 3. Calculate totals
    const shippingCost = subtotal >= 999 ? 0 : 99;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = Math.round(taxableAmount * 0.18 * 100) / 100; // 18% GST
    const totalAmount = Math.round((taxableAmount + taxAmount + shippingCost) * 100) / 100;

    // 4. Fetch shipping address
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

    // 5. Generate order number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `ORD-${dateStr}-${random}`;

    const orderBase = {
      order_number: orderNumber,
      user_id: user.id,
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
      coupon_code: coupon_code ? coupon_code.toUpperCase() : null,
    };

    // ── COD path ────────────────────────────────────────────────────────
    if (payment_method === 'cod') {
      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({ ...orderBase, status: 'confirmed', payment_status: 'cod_pending' })
        .select('id, order_number')
        .single();

      if (orderError || !order) throw new Error(orderError?.message ?? 'Failed to create COD order');

      await supabaseAdmin.from('order_items').insert(
        validatedItems.map((item) => ({ order_id: order.id, ...item }))
      );

      // Deduct stock
      for (const item of validatedItems) {
        const variant = variantMap.get(item.variant_id)!;
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

      // Record coupon usage
      if (couponId) {
        await supabaseAdmin.from('coupon_usages').insert({
          coupon_id: couponId,
          user_id: user.id,
          order_id: order.id,
        });
        await supabaseAdmin.rpc('increment_coupon_usage', { coupon_id_input: couponId });
      }

      // Send confirmation email
      await supabaseAdmin.functions.invoke('send-order-email', {
        body: { order_id: order.id, type: 'confirmation' },
      });

      return new Response(
        JSON.stringify({ success: true, order_id: order.id, order_number: order.order_number }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── Online payment path ──────────────────────────────────────────────
    // @ts-expect-error - Deno.env is available in Deno runtime
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')!;
    // @ts-expect-error - Deno.env is available in Deno runtime
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')!;
    const razorpayAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);

    const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${razorpayAuth}`,
      },
      body: JSON.stringify({
        amount: Math.round(totalAmount * 100),
        currency: 'INR',
        receipt: orderNumber,
        notes: { user_id: user.id, order_number: orderNumber },
      }),
    });

    const rzpOrder = await rzpResponse.json();
    if (!rzpResponse.ok) {
      throw new Error(`Razorpay error: ${JSON.stringify(rzpOrder)}`);
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        ...orderBase,
        status: 'pending',
        payment_status: 'pending',
        razorpay_order_id: rzpOrder.id,
      })
      .select('id')
      .single();

    if (orderError || !order) throw new Error(orderError?.message ?? 'Failed to create order');

    await supabaseAdmin.from('order_items').insert(
      validatedItems.map((item) => ({ order_id: order.id, ...item }))
    );

    return new Response(
      JSON.stringify({
        order_id: order.id,
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
