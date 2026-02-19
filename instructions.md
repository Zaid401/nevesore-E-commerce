# Supabase E-Commerce Backend — Fitness Clothing Brand

## Complete Setup Instructions for AI Agent (MCP Server Execution)

> **Context**: These instructions are designed to be executed by an Agentic AI connected to Supabase via MCP server. Every step must be performed programmatically — no manual dashboard interaction. This is a **single-vendor** fitness clothing e-commerce backend.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Supabase Project Initialization](#2-supabase-project-initialization)
3. [Authentication Setup](#3-authentication-setup)
4. [Database Schema](#4-database-schema)
5. [Row Level Security (RLS) Policies](#5-row-level-security-rls-policies)
6. [Storage Buckets (Image Handling)](#6-storage-buckets-image-handling)
7. [Edge Functions](#7-edge-functions)
8. [Razorpay Payment Integration](#8-razorpay-payment-integration)
9. [Resend Email Integration](#9-resend-email-integration)
10. [Admin Setup](#10-admin-setup)
11. [Database Functions & Triggers](#11-database-functions--triggers)
12. [Indexes & Performance](#12-indexes--performance)
13. [API Route Map & Role Access Matrix](#13-api-route-map--role-access-matrix)
14. [Testing Checklist](#14-testing-checklist)

---

## 1. Project Overview

### Tech Stack

| Layer            | Technology                        |
| ---------------- | --------------------------------- |
| Database         | Supabase (PostgreSQL)             |
| Auth             | Supabase Auth (Email + JWT)       |
| Storage          | Supabase Storage (product images) |
| Email            | Resend (via Supabase Edge Fn)     |
| Payments         | Razorpay                          |
| Serverless Logic | Supabase Edge Functions (Deno)    |
| Access Control   | RLS + JWT role claims             |

### Roles

| Role      | Description                                       |
| --------- | ------------------------------------------------- |
| `admin`   | Single super-admin. Full CRUD on everything.      |
| `customer`| Registered user. Can browse, order, review, etc.  |
| `anon`    | Unauthenticated visitor. Read-only product access.|

---

## 2. Supabase Project Initialization

### Step 2.1 — Confirm project connection via MCP

- Verify MCP server connection to the target Supabase project.
- Confirm you have access to run SQL, manage storage, manage auth settings, and deploy edge functions.

### Step 2.2 — Enable required extensions

Run via SQL:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for fuzzy search on product names
```

---

## 3. Authentication Setup

### Step 3.1 — Configure Auth Providers

- **Enable Email/Password** sign-up and sign-in.
- **Disable** all social providers and phone/SMS OTP. Only email auth is needed.
- **Enable email confirmation** (mandatory). Users must verify email before accessing authenticated routes.

### Step 3.2 — Email Templates

Configure the following email templates (these will be sent via Resend — see Section 9):

| Template             | Purpose                                      |
| -------------------- | -------------------------------------------- |
| Confirmation         | Sent on sign-up for email verification       |
| Password Recovery    | Sent when user requests password reset        |
| Email Change         | Sent when user updates their email            |

Set the **Site URL** and **Redirect URLs** to the frontend domain (placeholder: `https://yourdomain.com`). The agent should set these as configurable environment variables.

### Step 3.3 — JWT Configuration

Supabase issues JWTs automatically. We will store the user role inside `app_metadata` (via a trigger on sign-up) so that RLS policies can read it from the JWT.

- Default role for new sign-ups: `customer`
- Admin role is assigned manually (see Section 10)

### Step 3.4 — Custom JWT Hook (Role in Token)

Create a database function that Supabase Auth will call to inject the `user_role` into the JWT:

```sql
-- Function to get user role from profiles table
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  claims jsonb;
  user_role text;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = (event->>'user_id')::uuid;

  claims := event->'claims';

  IF user_role IS NOT NULL THEN
    claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  ELSE
    claims := jsonb_set(claims, '{user_role}', '"customer"');
  END IF;

  event := jsonb_set(event, '{claims}', claims);
  RETURN event;
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM authenticated, anon, public;
```

> **Important**: After creating this function, enable the "Custom Access Token Hook" in Supabase Auth settings and point it to `public.custom_access_token_hook`.

---

## 4. Database Schema

### Step 4.1 — Create ENUM types

```sql
CREATE TYPE public.order_status AS ENUM (
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'return_requested',
  'return_approved',
  'returned',
  'refunded'
);

CREATE TYPE public.payment_status AS ENUM (
  'pending',
  'authorized',
  'captured',
  'failed',
  'refunded',
  'partially_refunded'
);

CREATE TYPE public.user_role AS ENUM ('admin', 'customer');

CREATE TYPE public.return_reason AS ENUM (
  'defective',
  'wrong_item',
  'size_issue',
  'not_as_described',
  'changed_mind',
  'other'
);

CREATE TYPE public.return_status AS ENUM (
  'requested',
  'approved',
  'rejected',
  'received',
  'refund_initiated',
  'refund_completed'
);
```

### Step 4.2 — Profiles Table

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role public.user_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on sign-up (trigger defined in Section 11)
```

### Step 4.3 — Addresses Table

```sql
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label TEXT DEFAULT 'Home',  -- e.g., Home, Office
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Step 4.4 — Categories Table

```sql
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Step 4.5 — Products Table

```sql
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  base_price NUMERIC(10,2) NOT NULL CHECK (base_price >= 0),
  sale_price NUMERIC(10,2) CHECK (sale_price IS NULL OR sale_price >= 0),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Step 4.6 — Product Colors Table

```sql
CREATE TABLE public.product_colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  color_name TEXT NOT NULL,         -- e.g., "Midnight Black"
  color_hex TEXT NOT NULL,          -- e.g., "#1a1a1a"
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Step 4.7 — Product Sizes Table

```sql
CREATE TABLE public.product_sizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size_label TEXT NOT NULL,         -- e.g., "S", "M", "L", "XL", "XXL"
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Step 4.8 — Product Variants Table (Size × Color combinations)

```sql
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  color_id UUID NOT NULL REFERENCES public.product_colors(id) ON DELETE CASCADE,
  size_id UUID NOT NULL REFERENCES public.product_sizes(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  price_override NUMERIC(10,2),    -- NULL means use product base_price
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold INT DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, color_id, size_id)
);
```

### Step 4.9 — Product Images Table

```sql
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  color_id UUID REFERENCES public.product_colors(id) ON DELETE SET NULL,  -- NULL = general product image
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Step 4.10 — Wishlist Table

```sql
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);
```

### Step 4.11 — Product Reviews Table

```sql
CREATE TABLE public.product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,  -- admin must approve
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, user_id)  -- one review per product per user
);
```

### Step 4.12 — Coupons Table

```sql
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
  min_order_amount NUMERIC(10,2) DEFAULT 0,
  max_discount_amount NUMERIC(10,2),  -- cap for percentage discounts
  usage_limit INT,                     -- total times coupon can be used
  used_count INT DEFAULT 0,
  per_user_limit INT DEFAULT 1,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Step 4.13 — Cart Table

```sql
CREATE TABLE public.carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)  -- one cart per user
);

CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(cart_id, variant_id)
);
```

### Step 4.14 — Orders Table

```sql
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,   -- human-readable: e.g., ORD-20240101-XXXX
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  status public.order_status NOT NULL DEFAULT 'pending',
  
  -- Snapshot of address at time of order
  shipping_full_name TEXT NOT NULL,
  shipping_phone TEXT NOT NULL,
  shipping_address_line_1 TEXT NOT NULL,
  shipping_address_line_2 TEXT,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_postal_code TEXT NOT NULL,
  shipping_country TEXT NOT NULL DEFAULT 'India',

  -- Pricing
  subtotal NUMERIC(10,2) NOT NULL,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  shipping_cost NUMERIC(10,2) DEFAULT 0,
  tax_amount NUMERIC(10,2) DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL,

  -- Coupon
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
  coupon_code TEXT,

  -- Payment
  payment_status public.payment_status NOT NULL DEFAULT 'pending',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,

  -- Tracking
  tracking_number TEXT,
  tracking_url TEXT,
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Step 4.15 — Order Items Table

```sql
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,          -- snapshot
  color_name TEXT NOT NULL,            -- snapshot
  size_label TEXT NOT NULL,            -- snapshot
  sku TEXT NOT NULL,                   -- snapshot
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,   -- snapshot of price at purchase
  total_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Step 4.16 — Returns Table

```sql
CREATE TABLE public.returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  reason public.return_reason NOT NULL,
  description TEXT,
  status public.return_status NOT NULL DEFAULT 'requested',
  admin_notes TEXT,
  refund_amount NUMERIC(10,2),
  razorpay_refund_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.return_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  return_id UUID NOT NULL REFERENCES public.returns(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE RESTRICT,
  quantity INT NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Step 4.17 — Inventory Log Table (Audit Trail)

```sql
CREATE TABLE public.inventory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  change_quantity INT NOT NULL,       -- positive = restock, negative = sold/adjusted
  previous_quantity INT NOT NULL,
  new_quantity INT NOT NULL,
  reason TEXT NOT NULL,               -- 'order_placed', 'order_cancelled', 'return_received', 'manual_adjustment'
  reference_id UUID,                  -- order_id, return_id, etc.
  performed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Step 4.18 — Coupon Usage Tracking

```sql
CREATE TABLE public.coupon_usages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(coupon_id, user_id, order_id)
);
```

---

## 5. Row Level Security (RLS) Policies

> **Critical**: Enable RLS on **every** table. No exceptions.

### Step 5.1 — Enable RLS

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;
```

### Step 5.2 — Helper function for role check

```sql
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  SELECT coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'user_role',
    'anon'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT public.get_user_role() = 'admin';
$$;
```

### Step 5.3 — RLS Policies per Table

Below are the RLS policies. Apply them **exactly** as specified.

#### Profiles

```sql
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (but not role)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- Admin can view all profiles
CREATE POLICY "Admin can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Admin can update any profile
CREATE POLICY "Admin can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());
```

#### Addresses

```sql
CREATE POLICY "Users manage own addresses"
  ON public.addresses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin manages all addresses"
  ON public.addresses FOR ALL
  USING (public.is_admin());
```

#### Categories (Public read, Admin write)

```sql
CREATE POLICY "Anyone can view active categories"
  ON public.categories FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin manages categories"
  ON public.categories FOR ALL
  USING (public.is_admin());
```

#### Products (Public read, Admin write)

```sql
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin manages products"
  ON public.products FOR ALL
  USING (public.is_admin());
```

#### Product Colors / Sizes / Variants / Images — same pattern

```sql
-- Product Colors
CREATE POLICY "Anyone can view product colors"
  ON public.product_colors FOR SELECT
  USING (true);

CREATE POLICY "Admin manages product colors"
  ON public.product_colors FOR ALL
  USING (public.is_admin());

-- Product Sizes
CREATE POLICY "Anyone can view product sizes"
  ON public.product_sizes FOR SELECT
  USING (true);

CREATE POLICY "Admin manages product sizes"
  ON public.product_sizes FOR ALL
  USING (public.is_admin());

-- Product Variants
CREATE POLICY "Anyone can view active variants"
  ON public.product_variants FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin manages variants"
  ON public.product_variants FOR ALL
  USING (public.is_admin());

-- Product Images
CREATE POLICY "Anyone can view product images"
  ON public.product_images FOR SELECT
  USING (true);

CREATE POLICY "Admin manages product images"
  ON public.product_images FOR ALL
  USING (public.is_admin());
```

#### Wishlists

```sql
CREATE POLICY "Users manage own wishlist"
  ON public.wishlists FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin views all wishlists"
  ON public.wishlists FOR SELECT
  USING (public.is_admin());
```

#### Reviews

```sql
CREATE POLICY "Anyone can view approved reviews"
  ON public.product_reviews FOR SELECT
  USING (is_approved = true OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Authenticated users can create reviews"
  ON public.product_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own review"
  ON public.product_reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own review"
  ON public.product_reviews FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admin manages all reviews"
  ON public.product_reviews FOR ALL
  USING (public.is_admin());
```

#### Coupons

```sql
CREATE POLICY "Authenticated users can view active coupons"
  ON public.coupons FOR SELECT
  USING (
    (is_active = true AND (valid_until IS NULL OR valid_until > now()))
    OR public.is_admin()
  );

CREATE POLICY "Admin manages coupons"
  ON public.coupons FOR ALL
  USING (public.is_admin());
```

#### Cart & Cart Items

```sql
CREATE POLICY "Users manage own cart"
  ON public.carts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own cart items"
  ON public.cart_items FOR ALL
  USING (
    cart_id IN (SELECT id FROM public.carts WHERE user_id = auth.uid())
  )
  WITH CHECK (
    cart_id IN (SELECT id FROM public.carts WHERE user_id = auth.uid())
  );

CREATE POLICY "Admin views all carts"
  ON public.carts FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin views all cart items"
  ON public.cart_items FOR SELECT
  USING (public.is_admin());
```

#### Orders & Order Items

```sql
CREATE POLICY "Users view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin manages all orders"
  ON public.orders FOR ALL
  USING (public.is_admin());

CREATE POLICY "Users view own order items"
  ON public.order_items FOR SELECT
  USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "Order items insertable during order creation"
  ON public.order_items FOR INSERT
  WITH CHECK (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
  );

CREATE POLICY "Admin manages order items"
  ON public.order_items FOR ALL
  USING (public.is_admin());
```

#### Returns & Return Items

```sql
CREATE POLICY "Users view own returns"
  ON public.returns FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can request returns"
  ON public.returns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin manages returns"
  ON public.returns FOR ALL
  USING (public.is_admin());

CREATE POLICY "Users view own return items"
  ON public.return_items FOR SELECT
  USING (
    return_id IN (SELECT id FROM public.returns WHERE user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "Users can add return items"
  ON public.return_items FOR INSERT
  WITH CHECK (
    return_id IN (SELECT id FROM public.returns WHERE user_id = auth.uid())
  );

CREATE POLICY "Admin manages return items"
  ON public.return_items FOR ALL
  USING (public.is_admin());
```

#### Inventory Logs

```sql
CREATE POLICY "Admin only for inventory logs"
  ON public.inventory_logs FOR ALL
  USING (public.is_admin());
```

#### Coupon Usages

```sql
CREATE POLICY "Users view own coupon usage"
  ON public.coupon_usages FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "System/admin manages coupon usage"
  ON public.coupon_usages FOR ALL
  USING (public.is_admin());
```

---

## 6. Storage Buckets (Image Handling)

### Step 6.1 — Create Buckets

```sql
-- Product images bucket (public read)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,  -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
);

-- Category images bucket (public read)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'category-images',
  'category-images',
  true,
  2097152,  -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- User avatars bucket (public read)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  1048576,  -- 1MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);
```

### Step 6.2 — Storage RLS Policies

```sql
-- Product images: public read, admin write
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admin upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images'
    AND public.is_admin()
  );

CREATE POLICY "Admin update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admin delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin());

-- Category images: same pattern
CREATE POLICY "Public read category images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'category-images');

CREATE POLICY "Admin manage category images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'category-images' AND public.is_admin());

CREATE POLICY "Admin update category images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'category-images' AND public.is_admin());

CREATE POLICY "Admin delete category images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'category-images' AND public.is_admin());

-- Avatars: users manage own, admin manages all
CREATE POLICY "Public read avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

### Step 6.3 — Image Upload Path Convention

Follow this folder structure inside buckets:

```
product-images/
  └── {product_id}/
      └── {color_id|general}/
          └── {timestamp}_{filename}.webp

category-images/
  └── {category_id}/
      └── {timestamp}_{filename}.webp

avatars/
  └── {user_id}/
      └── avatar.webp
```

---

## 7. Edge Functions

> All edge functions must be deployed as **Supabase Edge Functions** (Deno runtime).

### Step 7.1 — Shared utilities

Create a shared helper file for all edge functions:

**`supabase/functions/_shared/cors.ts`**

```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};
```

**`supabase/functions/_shared/supabase.ts`**

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

export function getSupabaseClient(req: Request) {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  );
}
```

---

## 8. Razorpay Payment Integration

### Step 8.1 — Environment Variables (Secrets)

Set these as Supabase Edge Function secrets:

```
RAZORPAY_KEY_ID=<your_razorpay_key_id>
RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>
RAZORPAY_WEBHOOK_SECRET=<your_razorpay_webhook_secret>
```

### Step 8.2 — Edge Function: `create-razorpay-order`

**Purpose**: Customer initiates checkout → this function creates a Razorpay order and returns order details to the frontend.

**`supabase/functions/create-razorpay-order/index.ts`**

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getSupabaseClient, supabaseAdmin } from '../_shared/supabase.ts';
import { encode as base64Encode } from 'https://deno.land/std@0.168.0/encoding/base64.ts';

serve(async (req) => {
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

    // 1. Fetch user's cart with items, validate stock
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
            size:product_sizes (size_label)
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

    // 2. Validate stock and calculate totals
    let subtotal = 0;
    const validatedItems = [];

    for (const item of cart.cart_items) {
      const variant = item.variant;
      if (!variant.is_active || !variant.product.is_active) {
        return new Response(JSON.stringify({ error: `Product ${variant.product.name} is no longer available` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (variant.stock_quantity < item.quantity) {
        return new Response(JSON.stringify({ error: `Insufficient stock for ${variant.product.name} - ${variant.color.color_name} - ${variant.size.size_label}` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
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

    // 3. Apply coupon if provided
    let discountAmount = 0;
    let couponId = null;

    if (coupon_code) {
      const { data: coupon } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('code', coupon_code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (coupon) {
        // Validate coupon
        const now = new Date();
        const validFrom = new Date(coupon.valid_from);
        const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;

        if (now >= validFrom && (!validUntil || now <= validUntil)) {
          if (!coupon.usage_limit || coupon.used_count < coupon.usage_limit) {
            // Check per-user limit
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
                  discountAmount = coupon.discount_value;
                }
                couponId = coupon.id;
              }
            }
          }
        }
      }
    }

    // 4. Calculate final total
    const shippingCost = subtotal >= 999 ? 0 : 99;  // free shipping above 999
    const taxRate = 0.18;  // 18% GST
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = Math.round(taxableAmount * taxRate * 100) / 100;
    const totalAmount = taxableAmount + taxAmount + shippingCost;

    // 5. Fetch shipping address
    const { data: address } = await supabaseAdmin
      .from('addresses')
      .select('*')
      .eq('id', address_id)
      .eq('user_id', user.id)
      .single();

    if (!address) {
      return new Response(JSON.stringify({ error: 'Invalid address' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 6. Generate order number
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `ORD-${dateStr}-${random}`;

    // 7. Create Razorpay order
    const razorpayAuth = base64Encode(
      `${Deno.env.get('RAZORPAY_KEY_ID')}:${Deno.env.get('RAZORPAY_KEY_SECRET')}`
    );

    const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${razorpayAuth}`,
      },
      body: JSON.stringify({
        amount: Math.round(totalAmount * 100),  // Razorpay expects paise
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
        shipping_address_line_2: address.address_line_2,
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
        coupon_code: coupon_code?.toUpperCase() || null,
        payment_status: 'pending',
        razorpay_order_id: rzpOrder.id,
      })
      .select('id')
      .single();

    if (orderError) throw orderError;

    // 9. Create order items
    const orderItems = validatedItems.map((item) => ({
      order_id: order.id,
      ...item,
    }));

    await supabaseAdmin.from('order_items').insert(orderItems);

    // 10. Return Razorpay order info to frontend
    return new Response(
      JSON.stringify({
        order_id: order.id,
        order_number: orderNumber,
        razorpay_order_id: rzpOrder.id,
        razorpay_key_id: Deno.env.get('RAZORPAY_KEY_ID'),
        amount: Math.round(totalAmount * 100),
        currency: 'INR',
        prefill: {
          name: address.full_name,
          email: user.email,
          contact: address.phone,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

### Step 8.3 — Edge Function: `verify-razorpay-payment`

**Purpose**: After Razorpay checkout on frontend, verify the payment signature and confirm the order.

**`supabase/functions/verify-razorpay-payment/index.ts`**

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getSupabaseClient, supabaseAdmin } from '../_shared/supabase.ts';
import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts';

serve(async (req) => {
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

    // 1. Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = hmac(
      'sha256',
      Deno.env.get('RAZORPAY_KEY_SECRET')!,
      body,
      'utf8',
      'hex'
    );

    if (expectedSignature !== razorpay_signature) {
      // Mark payment as failed
      await supabaseAdmin
        .from('orders')
        .update({ payment_status: 'failed' })
        .eq('razorpay_order_id', razorpay_order_id);

      return new Response(JSON.stringify({ error: 'Invalid payment signature' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Update order
    const { data: order } = await supabaseAdmin
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

    if (!order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. Deduct stock
    for (const item of order.order_items) {
      const { data: variant } = await supabaseAdmin
        .from('product_variants')
        .select('stock_quantity')
        .eq('id', item.variant_id)
        .single();

      const newQty = variant.stock_quantity - item.quantity;

      await supabaseAdmin
        .from('product_variants')
        .update({ stock_quantity: newQty, updated_at: new Date().toISOString() })
        .eq('id', item.variant_id);

      // Log inventory change
      await supabaseAdmin.from('inventory_logs').insert({
        variant_id: item.variant_id,
        change_quantity: -item.quantity,
        previous_quantity: variant.stock_quantity,
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

    // 5. Clear cart
    await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('cart_id', (await supabaseAdmin.from('carts').select('id').eq('user_id', user.id).single()).data.id);

    // 6. Trigger order confirmation email (via Resend — see Section 9)
    await supabaseAdmin.functions.invoke('send-order-email', {
      body: { order_id: order.id, type: 'confirmation' },
    });

    return new Response(
      JSON.stringify({ success: true, order_id: order.id, order_number: order.order_number }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

### Step 8.4 — Edge Function: `razorpay-webhook`

**Purpose**: Handle Razorpay webhook events for payment failures, refunds, etc.

**`supabase/functions/razorpay-webhook/index.ts`**

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';
import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts';

serve(async (req) => {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    // Verify webhook signature
    const expectedSignature = hmac(
      'sha256',
      Deno.env.get('RAZORPAY_WEBHOOK_SECRET')!,
      body,
      'utf8',
      'hex'
    );

    if (expectedSignature !== signature) {
      return new Response('Invalid signature', { status: 400 });
    }

    const event = JSON.parse(body);
    const eventType = event.event;

    switch (eventType) {
      case 'payment.failed': {
        const paymentEntity = event.payload.payment.entity;
        await supabaseAdmin
          .from('orders')
          .update({ payment_status: 'failed', status: 'cancelled' })
          .eq('razorpay_order_id', paymentEntity.order_id);
        break;
      }

      case 'refund.processed': {
        const refundEntity = event.payload.refund.entity;
        await supabaseAdmin
          .from('returns')
          .update({
            status: 'refund_completed',
            razorpay_refund_id: refundEntity.id,
            updated_at: new Date().toISOString(),
          })
          .eq('razorpay_refund_id', refundEntity.id);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
```

---

## 9. Resend Email Integration

### Step 9.1 — Environment Variables

```
RESEND_API_KEY=<your_resend_api_key>
SENDER_EMAIL=orders@yourdomain.com
SENDER_NAME=YourBrandName
```

### Step 9.2 — Configure Supabase Auth to use Resend

In Supabase Auth settings, set the **custom SMTP** configuration pointing to Resend's SMTP:

| Setting       | Value                    |
| ------------- | ------------------------ |
| SMTP Host     | `smtp.resend.com`        |
| SMTP Port     | `465`                    |
| SMTP User     | `resend`                 |
| SMTP Password | `<RESEND_API_KEY>`       |
| Sender Email  | `noreply@yourdomain.com` |
| Sender Name   | `YourBrandName`          |

> This ensures all Supabase Auth emails (verification, password reset, email change) are sent via Resend automatically.

### Step 9.3 — Edge Function: `send-order-email`

**Purpose**: Transactional emails for order confirmation, shipping updates, return status.

**`supabase/functions/send-order-email/index.ts`**

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';

serve(async (req) => {
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
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        from: `${Deno.env.get('SENDER_NAME')} <${Deno.env.get('SENDER_EMAIL')}>`,
        to: [order.user.email],
        subject,
        html: htmlBody,
      }),
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.json();
      throw new Error(`Resend error: ${JSON.stringify(error)}`);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});

// --- HTML Template Builders ---
// NOTE: The agent should build these as branded, responsive HTML email templates
// tailored to the fitness clothing brand. Below are minimal structures.

function buildOrderConfirmationHtml(order: any): string {
  const itemsHtml = order.order_items
    .map((item: any) => `
      <tr>
        <td>${item.product_name} (${item.color_name} / ${item.size_label})</td>
        <td>${item.quantity}</td>
        <td>₹${item.unit_price}</td>
        <td>₹${item.total_price}</td>
      </tr>
    `)
    .join('');

  return `
    <h1>Order Confirmed!</h1>
    <p>Hi ${order.user.full_name},</p>
    <p>Your order <strong>${order.order_number}</strong> has been confirmed.</p>
    <table border="1" cellpadding="8">
      <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
      ${itemsHtml}
    </table>
    <p>Subtotal: ₹${order.subtotal}</p>
    <p>Discount: -₹${order.discount_amount}</p>
    <p>Tax: ₹${order.tax_amount}</p>
    <p>Shipping: ₹${order.shipping_cost}</p>
    <p><strong>Total: ₹${order.total_amount}</strong></p>
    <p>Shipping to: ${order.shipping_address_line_1}, ${order.shipping_city}, ${order.shipping_state} ${order.shipping_postal_code}</p>
  `;
}

function buildShippedHtml(order: any): string {
  return `
    <h1>Your Order Has Shipped!</h1>
    <p>Hi ${order.user.full_name},</p>
    <p>Order <strong>${order.order_number}</strong> is on its way.</p>
    ${order.tracking_number ? `<p>Tracking: <a href="${order.tracking_url}">${order.tracking_number}</a></p>` : ''}
  `;
}

function buildDeliveredHtml(order: any): string {
  return `
    <h1>Order Delivered!</h1>
    <p>Hi ${order.user.full_name},</p>
    <p>Order <strong>${order.order_number}</strong> has been delivered. Enjoy your new gear!</p>
  `;
}

function buildReturnUpdateHtml(order: any): string {
  return `
    <h1>Return Update</h1>
    <p>Hi ${order.user.full_name},</p>
    <p>There's an update on your return request for order <strong>${order.order_number}</strong>. Please check your account for details.</p>
  `;
}
```

---

## 10. Admin Setup

### Step 10.1 — Create the Super Admin

> **This is a one-time operation.** The admin account should be created via the Auth API, then have its role elevated.

The agent should:

1. Create a new user via Supabase Auth with a secure email and password.
2. After the profile trigger creates the row in `profiles`, update the role:

```sql
-- Replace 'admin-uuid-here' with the actual user UUID after creation
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@yourdomain.com';
```

3. Confirm that the JWT now includes `"user_role": "admin"` by testing a sign-in.

### Step 10.2 — Admin-Only Database Functions

```sql
-- Function: Admin updates order status
CREATE OR REPLACE FUNCTION public.admin_update_order_status(
  order_id_input UUID,
  new_status public.order_status,
  tracking_number_input TEXT DEFAULT NULL,
  tracking_url_input TEXT DEFAULT NULL,
  notes_input TEXT DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_order json;
BEGIN
  -- Verify caller is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: admin access required';
  END IF;

  UPDATE public.orders
  SET
    status = new_status,
    tracking_number = COALESCE(tracking_number_input, tracking_number),
    tracking_url = COALESCE(tracking_url_input, tracking_url),
    notes = COALESCE(notes_input, notes),
    updated_at = now()
  WHERE id = order_id_input
  RETURNING row_to_json(orders.*) INTO updated_order;

  RETURN updated_order;
END;
$$;

-- Function: Admin processes return
CREATE OR REPLACE FUNCTION public.admin_process_return(
  return_id_input UUID,
  new_status public.return_status,
  admin_notes_input TEXT DEFAULT NULL,
  refund_amount_input NUMERIC DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_return json;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: admin access required';
  END IF;

  UPDATE public.returns
  SET
    status = new_status,
    admin_notes = COALESCE(admin_notes_input, admin_notes),
    refund_amount = COALESCE(refund_amount_input, refund_amount),
    updated_at = now()
  WHERE id = return_id_input
  RETURNING row_to_json(returns.*) INTO updated_return;

  -- If return is received, restock inventory
  IF new_status = 'received' THEN
    PERFORM public.restock_return_items(return_id_input);
  END IF;

  RETURN updated_return;
END;
$$;

-- Function: Restock items from a return
CREATE OR REPLACE FUNCTION public.restock_return_items(return_id_input UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  ri RECORD;
  current_qty INT;
BEGIN
  FOR ri IN
    SELECT ri.quantity, oi.variant_id
    FROM public.return_items ri
    JOIN public.order_items oi ON ri.order_item_id = oi.id
    WHERE ri.return_id = return_id_input
  LOOP
    SELECT stock_quantity INTO current_qty
    FROM public.product_variants
    WHERE id = ri.variant_id;

    UPDATE public.product_variants
    SET stock_quantity = current_qty + ri.quantity, updated_at = now()
    WHERE id = ri.variant_id;

    INSERT INTO public.inventory_logs (variant_id, change_quantity, previous_quantity, new_quantity, reason, reference_id)
    VALUES (ri.variant_id, ri.quantity, current_qty, current_qty + ri.quantity, 'return_received', return_id_input);
  END LOOP;
END;
$$;

-- Function: Increment coupon usage count
CREATE OR REPLACE FUNCTION public.increment_coupon_usage(coupon_id_input UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.coupons
  SET used_count = used_count + 1, updated_at = now()
  WHERE id = coupon_id_input;
END;
$$;
```

### Step 10.3 — Admin Dashboard RPC Functions

```sql
-- Dashboard: Get sales summary
CREATE OR REPLACE FUNCTION public.admin_get_dashboard_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT json_build_object(
    'total_orders', (SELECT COUNT(*) FROM public.orders),
    'total_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM public.orders WHERE payment_status = 'captured'),
    'orders_today', (SELECT COUNT(*) FROM public.orders WHERE created_at::date = CURRENT_DATE),
    'revenue_today', (SELECT COALESCE(SUM(total_amount), 0) FROM public.orders WHERE created_at::date = CURRENT_DATE AND payment_status = 'captured'),
    'pending_orders', (SELECT COUNT(*) FROM public.orders WHERE status IN ('confirmed', 'processing')),
    'total_customers', (SELECT COUNT(*) FROM public.profiles WHERE role = 'customer'),
    'low_stock_variants', (SELECT COUNT(*) FROM public.product_variants WHERE stock_quantity <= low_stock_threshold AND is_active = true),
    'pending_returns', (SELECT COUNT(*) FROM public.returns WHERE status = 'requested'),
    'pending_reviews', (SELECT COUNT(*) FROM public.product_reviews WHERE is_approved = false)
  ) INTO result;

  RETURN result;
END;
$$;

-- Dashboard: Get low stock products
CREATE OR REPLACE FUNCTION public.admin_get_low_stock_variants()
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
  SELECT row_to_json(t.*)
  FROM (
    SELECT
      pv.id, pv.sku, pv.stock_quantity, pv.low_stock_threshold,
      p.name AS product_name,
      pc.color_name,
      ps.size_label
    FROM public.product_variants pv
    JOIN public.products p ON pv.product_id = p.id
    JOIN public.product_colors pc ON pv.color_id = pc.id
    JOIN public.product_sizes ps ON pv.size_id = ps.id
    WHERE pv.stock_quantity <= pv.low_stock_threshold
    AND pv.is_active = true
    ORDER BY pv.stock_quantity ASC
  ) t;
END;
$$;
```

---

## 11. Database Functions & Triggers

### Step 11.1 — Auto-create profile on sign-up

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'customer'
  );

  -- Also create an empty cart for the user
  INSERT INTO public.carts (user_id) VALUES (NEW.id);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Step 11.2 — Auto-update `updated_at` timestamps

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply to all tables with updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.product_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.carts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.returns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

### Step 11.3 — Auto-set `is_verified_purchase` on reviews

```sql
CREATE OR REPLACE FUNCTION public.check_verified_purchase()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if user has a delivered order containing this product
  IF EXISTS (
    SELECT 1
    FROM public.orders o
    JOIN public.order_items oi ON o.id = oi.order_id
    JOIN public.product_variants pv ON oi.variant_id = pv.id
    WHERE o.user_id = NEW.user_id
    AND pv.product_id = NEW.product_id
    AND o.status = 'delivered'
  ) THEN
    NEW.is_verified_purchase = true;
  ELSE
    NEW.is_verified_purchase = false;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_verified_purchase
  BEFORE INSERT ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION public.check_verified_purchase();
```

### Step 11.4 — Enforce single default address

```sql
CREATE OR REPLACE FUNCTION public.enforce_single_default_address()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE public.addresses
    SET is_default = false
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_default_address
  BEFORE INSERT OR UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.enforce_single_default_address();
```

---

## 12. Indexes & Performance

```sql
-- Products
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_active ON public.products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_name_trgm ON public.products USING GIN (name gin_trgm_ops);

-- Categories
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_parent ON public.categories(parent_id);

-- Variants
CREATE INDEX idx_variants_product ON public.product_variants(product_id);
CREATE INDEX idx_variants_sku ON public.product_variants(sku);
CREATE INDEX idx_variants_stock ON public.product_variants(stock_quantity) WHERE is_active = true;

-- Orders
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX idx_orders_number ON public.orders(order_number);
CREATE INDEX idx_orders_razorpay ON public.orders(razorpay_order_id);

-- Order Items
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_order_items_variant ON public.order_items(variant_id);

-- Cart Items
CREATE INDEX idx_cart_items_cart ON public.cart_items(cart_id);

-- Wishlists
CREATE INDEX idx_wishlists_user ON public.wishlists(user_id);

-- Reviews
CREATE INDEX idx_reviews_product ON public.product_reviews(product_id);
CREATE INDEX idx_reviews_approved ON public.product_reviews(is_approved) WHERE is_approved = true;

-- Returns
CREATE INDEX idx_returns_order ON public.returns(order_id);
CREATE INDEX idx_returns_user ON public.returns(user_id);
CREATE INDEX idx_returns_status ON public.returns(status);

-- Inventory Logs
CREATE INDEX idx_inventory_logs_variant ON public.inventory_logs(variant_id);
CREATE INDEX idx_inventory_logs_created ON public.inventory_logs(created_at DESC);

-- Addresses
CREATE INDEX idx_addresses_user ON public.addresses(user_id);

-- Coupons
CREATE INDEX idx_coupons_code ON public.coupons(code);
CREATE INDEX idx_coupons_active ON public.coupons(is_active) WHERE is_active = true;

-- Product Images
CREATE INDEX idx_product_images_product ON public.product_images(product_id);

-- Product Colors & Sizes
CREATE INDEX idx_product_colors_product ON public.product_colors(product_id);
CREATE INDEX idx_product_sizes_product ON public.product_sizes(product_id);
```

---

## 13. API Route Map & Role Access Matrix

This section defines how the frontend should interact with the backend. All data access goes through **Supabase Client SDK** with RLS enforcement. Edge Functions handle server-side logic.

### Direct Table Operations (via Supabase SDK + RLS)

| Operation                      | Table              | Anon | Customer | Admin |
| ------------------------------ | ------------------ | ---- | -------- | ----- |
| List products                  | products           | ✅    | ✅        | ✅     |
| Get product detail             | products + joins   | ✅    | ✅        | ✅     |
| CRUD products                  | products           | ❌    | ❌        | ✅     |
| List categories                | categories         | ✅    | ✅        | ✅     |
| CRUD categories                | categories         | ❌    | ❌        | ✅     |
| CRUD variants/colors/sizes     | product_*          | ❌    | ❌        | ✅     |
| View own profile               | profiles           | ❌    | ✅        | ✅     |
| Update own profile             | profiles           | ❌    | ✅        | ✅     |
| View all profiles              | profiles           | ❌    | ❌        | ✅     |
| CRUD own addresses             | addresses          | ❌    | ✅        | ✅     |
| CRUD own wishlist              | wishlists          | ❌    | ✅        | ✅     |
| Create review                  | product_reviews    | ❌    | ✅        | ✅     |
| View approved reviews          | product_reviews    | ✅    | ✅        | ✅     |
| Approve/reject reviews         | product_reviews    | ❌    | ❌        | ✅     |
| CRUD own cart                  | carts, cart_items  | ❌    | ✅        | ✅     |
| View own orders                | orders             | ❌    | ✅        | ✅     |
| View all orders                | orders             | ❌    | ❌        | ✅     |
| Request return                 | returns            | ❌    | ✅        | ✅     |
| Process return                 | returns            | ❌    | ❌        | ✅     |
| CRUD coupons                   | coupons            | ❌    | ❌        | ✅     |
| View active coupons            | coupons            | ❌    | ✅        | ✅     |
| View inventory logs            | inventory_logs     | ❌    | ❌        | ✅     |
| Upload product images          | storage            | ❌    | ❌        | ✅     |
| Upload own avatar              | storage            | ❌    | ✅        | ✅     |

### Edge Function Endpoints

| Function                   | Method | Auth Required | Roles     |
| -------------------------- | ------ | ------------- | --------- |
| `create-razorpay-order`    | POST   | Yes           | customer  |
| `verify-razorpay-payment`  | POST   | Yes           | customer  |
| `razorpay-webhook`         | POST   | No (webhook)  | N/A       |
| `send-order-email`         | POST   | Internal only | system    |

### RPC Functions

| Function                        | Auth Required | Roles  |
| ------------------------------- | ------------- | ------ |
| `admin_update_order_status`     | Yes           | admin  |
| `admin_process_return`          | Yes           | admin  |
| `admin_get_dashboard_stats`     | Yes           | admin  |
| `admin_get_low_stock_variants`  | Yes           | admin  |
| `increment_coupon_usage`        | Internal      | system |

---

## 14. Testing Checklist

After completing all setup steps, verify the following:

### Auth
- [ ] New user can sign up with email → receives verification email via Resend
- [ ] Unverified user cannot access authenticated routes
- [ ] Verified user can sign in and JWT contains `user_role: "customer"`
- [ ] Admin JWT contains `user_role: "admin"`
- [ ] Password reset flow works via Resend

### Products & Catalog
- [ ] Anonymous user can list active products and categories
- [ ] Anonymous user CANNOT create/update/delete products
- [ ] Admin can full CRUD on products, variants, colors, sizes, images
- [ ] Product image upload to `product-images` bucket works for admin
- [ ] Product search using `pg_trgm` returns relevant results

### Cart & Checkout
- [ ] Customer can add/update/remove cart items
- [ ] Cart validates stock availability
- [ ] `create-razorpay-order` creates order in DB and returns Razorpay checkout data
- [ ] `verify-razorpay-payment` confirms payment, deducts stock, clears cart
- [ ] Coupon validation works (expiry, limits, min order)
- [ ] Order confirmation email sent via Resend

### Orders & Admin
- [ ] Customer sees only own orders
- [ ] Admin sees all orders
- [ ] Admin can update order status (triggers email for shipped/delivered)
- [ ] Admin dashboard stats return correct data

### Returns & Inventory
- [ ] Customer can request return on delivered order
- [ ] Admin can approve/reject return
- [ ] Approved + received return restocks inventory
- [ ] Inventory logs track all stock changes

### Wishlist & Reviews
- [ ] Customer can add/remove wishlist items
- [ ] Customer can create one review per product
- [ ] Verified purchase flag auto-set correctly
- [ ] Only approved reviews visible to public
- [ ] Admin can approve/reject reviews

### Security
- [ ] RLS enabled on ALL tables (verify with `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public'`)
- [ ] Customer cannot access admin RPC functions
- [ ] Anonymous cannot access any write operations (except viewing products/categories)
- [ ] Storage policies prevent unauthorized uploads

---

## Execution Order Summary

The AI agent should execute these steps **in this exact order**:

1. Verify MCP connection and project access
2. Enable PostgreSQL extensions (Step 2.2)
3. Create ENUM types (Step 4.1)
4. Create all tables (Steps 4.2–4.18)
5. Enable RLS on all tables (Step 5.1)
6. Create helper functions (Step 5.2)
7. Apply all RLS policies (Step 5.3)
8. Create storage buckets (Step 6.1)
9. Apply storage policies (Step 6.2)
10. Create all database functions and triggers (Section 11)
11. Create indexes (Section 12)
12. Create admin RPC functions (Steps 10.2–10.3)
13. Set environment secrets for Edge Functions
14. Deploy Edge Functions (Sections 7–9)
15. Configure Supabase Auth settings (Section 3)
16. Configure SMTP with Resend (Step 9.2)
17. Set up Custom Access Token Hook (Step 3.4)
18. Create admin user (Step 10.1)
19. Run testing checklist (Section 14)

---

> **Note to Agent**: If any step fails, log the error, do NOT skip it, and retry with a fix. Every step is critical for a production-ready backend. All SQL should be run via the Supabase MCP server's SQL execution capability.
