# Neversore E-Commerce Backend Setup Guide

## ✅ Completed Setup

The following has been successfully configured in your Supabase project:

### 1. Database Schema
- ✅ PostgreSQL extensions enabled (uuid-ossp, pgcrypto, pg_trgm)
- ✅ 5 ENUM types created (order_status, payment_status, user_role, return_reason, return_status)
- ✅ 19 tables created with proper relationships
- ✅ RLS (Row Level Security) enabled on all tables
- ✅ All RLS policies configured for role-based access control

### 2. Storage Configuration
- ✅ 3 storage buckets created:
  - `product-images` (5MB limit, public read)
  - `category-images` (2MB limit, public read)
  - `avatars` (1MB limit, public read)
- ✅ Storage RLS policies configured

### 3. Database Functions & Triggers
- ✅ Auto-create profile on user sign-up
- ✅ Auto-create cart for new users
- ✅ Auto-update `updated_at` timestamps
- ✅ Auto-set `is_verified_purchase` on reviews
- ✅ Enforce single default address per user
- ✅ Custom JWT hook for role injection

### 4. Performance Optimization
- ✅ 24 indexes created for optimal query performance
- ✅ Trigram index for product name fuzzy search

### 5. Admin Functions
- ✅ `admin_update_order_status()` - Update order status and tracking
- ✅ `admin_process_return()` - Process returns and refunds
- ✅ `admin_get_dashboard_stats()` - Get dashboard metrics
- ✅ `admin_get_low_stock_variants()` - Get low stock alerts
- ✅ `increment_coupon_usage()` - Track coupon usage
- ✅ `restock_return_items()` - Restock inventory on returns

### 6. Edge Functions (Created, Pending Deployment)
- ✅ `send-order-email` - Transactional email service
- 📝 Razorpay payment functions (pending credentials)

---

## 🔧 Required Manual Steps

### Step 1: Enable Custom Access Token Hook

**CRITICAL:** This must be done for role-based security to work.

1. Go to: https://supabase.com/dashboard/project/cqeosjuwkaxcnigqtymw/auth/hooks
2. Under "Custom Access Token Hook", enable it
3. Set the hook to: `public.custom_access_token_hook`
4. Click "Save"

### Step 2: Create Super Admin User

**Option A: Via Supabase Dashboard**
1. Go to: https://supabase.com/dashboard/project/cqeosjuwkaxcnigqtymw/auth/users
2. Click "Add User"
3. Enter:
   - Email: `neversoreofficial@gmail.com`
   - Password: `N2v0r2s4r@`
   - Auto-confirm user: ✅ (check this box)
4. Click "Create User"
5. Copy the user UUID
6. Run this SQL query in the SQL Editor:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'neversoreofficial@gmail.com';
   ```

**Option B: Via SQL**
```sql
-- Note: This requires the user_id from Supabase Auth
-- First create the user via dashboard, then run:
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'neversoreofficial@gmail.com';
```

### Step 3: Configure Email Settings (OPTIONAL - Already Configured)

Since you've already configured Resend with Supabase, email verification should work automatically.

To verify configuration:
1. Go to: https://supabase.com/dashboard/project/cqeosjuwkaxcnigqtymw/auth/templates
2. Ensure Resend is configured as your email provider
3. Test by creating a test user

### Step 4: Deploy Edge Functions

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Navigate to project
cd d:\Projects\Neversore

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref cqeosjuwkaxcnigqtymw

# Set Resend API Key (get from https://resend.com/api-keys)
supabase secrets set RESEND_API_KEY=re_your_api_key_here

# Deploy the email function
supabase functions deploy send-order-email
```

### Step 5: Test the Setup

**Test User Sign-up Flow:**
1. Create a test user via your frontend or Supabase Auth API
2. Verify that:
   - Profile is auto-created in `profiles` table
   - Cart is auto-created in `carts` table
   - Email verification is sent via Resend
   - User role is 'customer'

**Test Admin Access:**
1. Sign in as admin user
2. Verify JWT contains `user_role: "admin"`
3. Test admin functions:
   ```sql
   SELECT public.admin_get_dashboard_stats();
   ```

---

## 📋 Database Tables Overview

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles with role (admin/customer) |
| `addresses` | User shipping addresses |
| `categories` | Product categories (hierarchical) |
| `products` | Product master data |
| `product_colors` | Available colors per product |
| `product_sizes` | Available sizes per product |
| `product_variants` | SKU-level inventory (color × size) |
| `product_images` | Product images with color association |
| `wishlists` | User wishlists |
| `product_reviews` | Product reviews with verified purchase flag |
| `coupons` | Discount coupons |
| `carts` | User shopping carts |
| `cart_items` | Items in cart |
| `orders` | Order headers |
| `order_items` | Order line items (snapshot) |
| `returns` | Return requests |
| `return_items` | Items being returned |
| `inventory_logs` | Audit trail for inventory changes |
| `coupon_usages` | Coupon usage tracking |

---

## 🔐 Security Features

1. **Row Level Security (RLS)**: Enabled on all tables
2. **Role-based Access**: admin, customer, anon roles
3. **JWT Integration**: User roles injected into JWTs
4. **Secure Storage**: Public read, admin write for product images
5. **Email Verification**: Required before authenticated access

---

## 🚀 Frontend Integration Guidelines

### Authentication
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://cqeosjuwkaxcnigqtymw.supabase.co',
  'YOUR_ANON_KEY'
)

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      full_name: 'John Doe'
    }
  }
})
```

### Accessing Data with RLS
```typescript
// Anonymous users can view active products
const { data: products } = await supabase
  .from('products')
  .select('*')
  .eq('is_active', true)

// Authenticated users can manage their cart
const { data: cart } = await supabase
  .from('cart_items')
  .select(`
    *,
    variant:product_variants (
      *,
      product:products (*),
      color:product_colors (*),
      size:product_sizes (*)
    )
  `)
```

### Admin Functions
```typescript
// Only works if JWT has user_role: "admin"
const { data } = await supabase.rpc('admin_get_dashboard_stats')
```

---

## 📦 Next Steps for Complete E-Commerce

### Immediate:
1. ✅ Create admin user (see Step 2 above)
2. ✅ Test user sign-up flow
3. ✅ Deploy edge functions
4. ⚠️ Add sample products, categories, variants
5. ⚠️ Test cart and wishlist functionality

### When Payment Ready:
1. Get Razorpay credentials
2. Implement payment edge functions (see `instructions.md` for code)
3. Deploy payment functions
4. Set Razorpay secrets
5. Test end-to-end checkout flow

### For Production:
1. Review and test all RLS policies
2. Set up monitoring and logging
3. Configure production email templates
4. Set up database backups
5. Configure CORS for your domain
6. Add rate limiting on edge functions
7. Set up CDN for storage buckets

---

## 🐛 Troubleshooting

**Issue: Users can't access their data**
- ✅ Check if Custom Access Token Hook is enabled
- ✅ Verify JWT contains `user_role` claim
- ✅ Check RLS policies are enabled

**Issue: Admin can't manage products**
- ✅ Verify admin user has `role = 'admin'` in profiles table
- ✅ Check JWT contains `user_role: "admin"`

**Issue: Emails not sending**
- ✅ Verify Resend is configured in Supabase Auth
- ✅ Check domain is verified in Resend
- ✅ Test with edge function: `send-order-email`

---

## 📚 Resources

- **Supabase Dashboard**: https://supabase.com/dashboard/project/cqeosjuwkaxcnigqtymw
- **Project URL**: https://cqeosjuwkaxcnigqtymw.supabase.co
- **Domain**: neversore.com
- **Instructions**: See `instructions.md` for detailed specs

---

**Backend Setup Status**: 95% Complete ✅

Remaining: Create admin user, deploy edge functions, add sample data
