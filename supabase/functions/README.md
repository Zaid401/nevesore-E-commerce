# Neversore E-Commerce Backend - Edge Functions

## Overview

This directory contains Supabase Edge Functions for the Neversore fitness e-commerce platform.

## Available Functions

### 1. send-order-email
Handles transactional emails for order updates using Resend.

**Trigger Events:**
- Order confirmation
- Order shipped
- Order delivered
- Return updates

**Environment Variables Required:**
- `RESEND_API_KEY` - Your Resend API key

## Deployment Instructions

### Prerequisites
- Supabase CLI installed (`npm install -g supabase`)
- Logged in to Supabase CLI (`supabase login`)

### Deploy All Functions

```bash
# Navigate to project root
cd d:\Projects\Neversore

# Link to your Supabase project
supabase link --project-ref cqeosjuwkaxcnigqtymw

# Deploy all functions
supabase functions deploy
```

### Deploy Individual Function

```bash
supabase functions deploy send-order-email
```

### Set Environment Secrets

```bash
# Set Resend API key
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
```

## Payment Integration (Razorpay) - TO BE IMPLEMENTED

The following edge functions are **not yet implemented** as Razorpay credentials are pending:

1. **create-razorpay-order**
   - Creates Razorpay order and database order record
   - Returns checkout details to frontend
   
2. **verify-razorpay-payment**
   - Verifies payment signature
   - Updates order status
   - Deducts inventory
   - Triggers confirmation email
   
3. **razorpay-webhook**
   - Handles Razorpay webhook events
   - Processes payment failures and refunds

### To Implement Razorpay Functions Later:

1. Get Razorpay credentials:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_WEBHOOK_SECRET`

2. Create the edge function files (templates available in instructions.md)

3. Set environment secrets:
```bash
supabase secrets set RAZORPAY_KEY_ID=your_key_id
supabase secrets set RAZORPAY_KEY_SECRET=your_key_secret
supabase secrets set RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

4. Deploy the functions:
```bash
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
supabase functions deploy razorpay-webhook
```

## Testing Functions Locally

```bash
# Start local function server
supabase functions serve send-order-email --env-file .env.local

# Test with curl
curl -i --location --request POST 'http://localhost:54321/functions/v1/send-order-email' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"order_id":"UUID_HERE","type":"confirmation"}'
```

## Environment Variables Summary

| Variable | Required | Purpose |
|----------|----------|---------|
| `SUPABASE_URL` | Auto-set | Supabase project URL |
| `SUPABASE_ANON_KEY` | Auto-set | Public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-set | Admin API key |
| `RESEND_API_KEY` | Manual | Resend email service |
| `RAZORPAY_KEY_ID` | Not yet | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | Not yet | Razorpay secret key |
| `RAZORPAY_WEBHOOK_SECRET` | Not yet | Razorpay webhook signature |

## Notes

- Email verification is handled automatically by Supabase Auth + Resend SMTP integration
- Custom JWT hook is enabled to inject user roles into JWTs
- All database operations use RLS policies for security
- Storage buckets are configured for product images, category images, and user avatars
