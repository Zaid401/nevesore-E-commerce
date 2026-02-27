# Razorpay Payment Integration - Testing Guide

## ✅ Setup Complete

All Edge Functions have been deployed successfully:
- ✅ `create-razorpay-order` (v4) - Creates orders and Razorpay payment orders
- ✅ `verify-razorpay-payment` (v3) - Verifies payment signatures and updates orders
- ✅ `razorpay-webhook` (v3) - Handles Razorpay webhook events
- ✅ `send-order-email` (v2) - Sends order confirmation emails

## 🔑 Required Secrets (Should be set in Supabase Dashboard)

Navigate to: **Supabase Dashboard → Project Settings → Edge Functions → Secrets**

Required secrets:
- `RAZORPAY_KEY_ID` = `rzp_test_SKGDQs4h9IdpBg`
- `RAZORPAY_KEY_SECRET` = `5cwpwzWbgDpp3Cw1CTeKxwSf`
- `RAZORPAY_WEBHOOK_SECRET` = (The webhook secret from Razorpay Dashboard)
- `RESEND_API_KEY` = (Your Resend API key for emails)

## 📋 Test Scenarios

### 1. Cash on Delivery (COD) Flow

**Steps:**
1. Browse products at `http://localhost:3000`
2. Add items to cart
3. Click "Proceed to Checkout"
4. Log in if not already authenticated
5. Select or add a shipping address
6. Choose payment method: **Cash on Delivery**
7. Click "Place Order"

**Expected Result:**
- Order created with status `confirmed` and payment_status `cod_pending`
- Stock deducted immediately
- Redirect to `/confirmation?order=ORD-XXXXXXXX-XXXX`
- Order confirmation email sent (if RESEND_API_KEY is configured)

### 2. Online Payment (Razorpay) Flow

**Steps:**
1. Add items to cart
2. Proceed to checkout
3. Log in
4. Select shipping address
5. Choose payment method: **Online Payment**
6. Click "Place Order"

**Expected Behavior:**
- Razorpay payment modal opens
- Order created in DB with status `pending` and payment_status `pending`
- **No stock deduction yet** (happens after payment verification)

**Test Payment:** Use Razorpay test card
- Card Number: `4111 1111 1111 1111`
- Expiry: Any future date (e.g., `12/28`)
- CVV: Any 3 digits (e.g., `123`)
- Cardholder Name: Any name

**After Successful Payment:**
- Payment signature verified via `verify-razorpay-payment` Edge Function
- Order updated to status `confirmed` and payment_status `captured`
- Stock deducted
- Cart cleared
- Redirected to `/confirmation?order=ORD-XXXXXXXX-XXXX`
- Order confirmation email sent

**If Payment is Cancelled:**
- Modal dismissed
- User stays on checkout page
- Error message: "Payment cancelled. You can retry or choose Cash on Delivery."
- Order remains in `pending` status

### 3. Webhook Events (Razorpay → Supabase)

**Webhook URL:** `https://cqeosjuwkaxcnigqtymw.supabase.co/functions/v1/razorpay-webhook`

**Events to Subscribe:**
- `payment.captured` - Updates order payment_status to 'captured'
- `payment.failed` - Marks order as 'failed' and 'cancelled'
- `refund.processed` - Updates return status to 'refund_completed'

**How to Configure Webhook:**

1. Go to **Razorpay Dashboard → Account & Settings → Webhooks**
2. Click "+ Create New Webhook"
3. Enter:
   - **Webhook URL:** `https://cqeosjuwkaxcnigqtymw.supabase.co/functions/v1/razorpay-webhook`
   - **Secret:** (Copy this and add as `RAZORPAY_WEBHOOK_SECRET` in Supabase)
   - **Active Events:** Select `payment.captured`, `payment.failed`, `refund.processed`
4. Save and test the webhook

**Testing Webhooks:**
- Use Razorpay Dashboard's "Test Webhook" feature
- Send a test `payment.captured` event
- Check Supabase Edge Function logs to verify webhook received and processed

## 🐛 Debugging

### Check Edge Function Logs

1. Open **Supabase Dashboard → Edge Functions → Logs**
2. Filter by function name
3. Look for errors or stack traces

### Common Issues

**401 Unauthorized:**
- ✅ **FIXED** - All functions now have `verify_jwt: false` and handle auth internally
- User must be logged in to place orders

**500 Internal Server Error:**
- Check if all required secrets are set in Supabase Dashboard
- Verify database tables exist (products, orders, order_items, addresses, etc.)
- Check Edge Function logs for specific error messages

**Razorpay API Error:**
- Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are correct
- Ensure test mode keys are being used for test mode orders
- Check Razorpay Dashboard for API errors

**Payment Signature Verification Failed:**
- Ensure `RAZORPAY_KEY_SECRET` matches the one used to create the order
- Check that the payment was made for the correct order_id

## 🔍 Verification Checklist

- [ ] Dev server running at `http://localhost:3000`
- [ ] User can browse products and add to cart
- [ ] User can log in/sign up
- [ ] User can add/select shipping address
- [ ] COD orders create successfully
- [ ] Razorpay modal opens for online payments
- [ ] Test card payment goes through
- [ ] Order status updates to 'confirmed' after payment
- [ ] Stock is deducted correctly
- [ ] Cart is cleared after successful payment
- [ ] Confirmation page displays order details
- [ ] Webhook endpoint is configured in Razorpay Dashboard
- [ ] Webhook events are processed correctly

## 📊 Database Tables

Key tables used in the payment flow:
- `products` - Product catalog
- `product_variants` - SKUs with stock quantities
- `addresses` - User shipping addresses
- `orders` - Order records
- `order_items` - Line items for each order
- `carts` & `cart_items` - Shopping cart
- `coupons` & `coupon_usages` - Discount codes
- `inventory_logs` - Stock movement tracking

## 🎯 Next Steps

After testing is successful:
1. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to **live mode keys** for production
2. Update webhook URL in Razorpay Dashboard to production URL
3. Configure `RESEND_API_KEY` for order confirmation emails
4. Test the entire flow again in production
5. Monitor Edge Function logs for any errors
