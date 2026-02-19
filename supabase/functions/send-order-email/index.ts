// @ts-expect-error - Deno runtime import
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { supabaseAdmin } from '../_shared/supabase';

interface OrderItem {
  product_name: string;
  color_name: string;
  size_label: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: string;
  user: { email: string; full_name: string | null };
  order_items: OrderItem[];
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  shipping_cost: number;
  total_amount: number;
  shipping_full_name: string;
  shipping_address_line_1: string;
  shipping_address_line_2: string | null;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  tracking_number?: string | null;
  tracking_url?: string | null;
}

serve(async (req: Request) => {
  try {
    const { order_id, type } = await req.json();

    // Fetch order with items and user profile
    const { data: order } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        user:profiles!user_id (email, full_name),
        order_items (*)
      `)
      .eq('id', order_id)
      .single();

    if (!order) throw new Error('Order not found');

    let subject = '';
    let htmlBody = '';

    switch (type) {
      case 'confirmation':
        subject = `Order Confirmed — ${order.order_number}`;
        htmlBody = buildOrderConfirmationHtml(order);
        break;
      case 'shipped':
        subject = `Your Order ${order.order_number} Has Been Shipped!`;
        htmlBody = buildShippedHtml(order);
        break;
      case 'delivered':
        subject = `Order ${order.order_number} Delivered`;
        htmlBody = buildDeliveredHtml(order);
        break;
      case 'return_update':
        subject = `Return Update for Order ${order.order_number}`;
        htmlBody = buildReturnUpdateHtml(order);
        break;
      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    // Send via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // @ts-expect-error - Deno.env is available in Deno runtime
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        // @ts-expect-error - Deno.env is available in Deno runtime
        from: `${Deno.env.get('SENDER_NAME') ?? 'Neversore'} <${Deno.env.get('SENDER_EMAIL') ?? 'orders@neversore.com'}>`,        to: [order.user.email],
        subject,
        html: htmlBody,
      }),
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.json();
      throw new Error(`Resend error: ${JSON.stringify(error)}`);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});

// --- HTML Template Builders ---

function buildOrderConfirmationHtml(order: Order): string {
  const itemsHtml = order.order_items
    .map((item: OrderItem) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.product_name} (${item.color_name} / ${item.size_label})</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">₹${item.unit_price}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">₹${item.total_price}</td>
      </tr>
    `)
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background-color: #f4f4f4; padding: 8px; border: 1px solid #ddd; text-align: left; }
        .total { font-weight: bold; font-size: 1.2em; color: #000; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 style="color: #000;">Order Confirmed!</h1>
        <p>Hi ${order.user.full_name || 'Customer'},</p>
        <p>Your order <strong>${order.order_number}</strong> has been confirmed and is being processed.</p>
        <table>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
          ${itemsHtml}
        </table>
        <p>Subtotal: ₹${order.subtotal}</p>
        <p>Discount: -₹${order.discount_amount}</p>
        <p>Tax (GST): ₹${order.tax_amount}</p>
        <p>Shipping: ₹${order.shipping_cost}</p>
        <p class="total">Total: ₹${order.total_amount}</p>
        <h3>Shipping Address:</h3>
        <p>
          ${order.shipping_full_name}<br>
          ${order.shipping_address_line_1}<br>
          ${order.shipping_address_line_2 ? order.shipping_address_line_2 + '<br>' : ''}
          ${order.shipping_city}, ${order.shipping_state} ${order.shipping_postal_code}<br>
          ${order.shipping_country}
        </p>
        <p>Thank you for choosing Neversore!</p>
      </div>
    </body>
    </html>
  `;
}

function buildShippedHtml(order: Order): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Your Order Has Shipped! 📦</h1>
        <p>Hi ${order.user.full_name || 'Customer'},</p>
        <p>Great news! Your order <strong>${order.order_number}</strong> is on its way.</p>
        ${order.tracking_number ? `
          <p>
            <strong>Tracking Number:</strong> ${order.tracking_number}<br>
            ${order.tracking_url ? `<a href="${order.tracking_url}">Track your order</a>` : ''}
          </p>
        ` : ''}
        <p>You should receive it soon. Get ready to elevate your fitness game!</p>
        <p>Thank you for choosing Neversore!</p>
      </div>
    </body>
    </html>
  `;
}

function buildDeliveredHtml(order: Order): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Order Delivered! 🎉</h1>
        <p>Hi ${order.user.full_name || 'Customer'},</p>
        <p>Your order <strong>${order.order_number}</strong> has been delivered.</p>
        <p>We hope you love your new gear! If you have any issues, please don't hesitate to contact us.</p>
        <p>Thank you for choosing Neversore!</p>
      </div>
    </body>
    </html>
  `;
}

function buildReturnUpdateHtml(order: Order): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Return Update</h1>
        <p>Hi ${order.user.full_name || 'Customer'},</p>
        <p>There's an update on your return request for order <strong>${order.order_number}</strong>.</p>
        <p>Please check your account for details.</p>
        <p>Thank you for choosing Neversore!</p>
      </div>
    </body>
    </html>
  `;
}
