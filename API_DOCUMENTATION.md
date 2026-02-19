# Neversore E-Commerce API Documentation

## Base Configuration

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://cqeosjuwkaxcnigqtymw.supabase.co',
  'YOUR_ANON_KEY_HERE'
)
```

---

## Authentication

### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword',
  options: {
    data: {
      full_name: 'John Doe'
    },
    emailRedirectTo: 'https://neversore.com/verify-email'
  }
})
```

**Note**: User must verify email before accessing authenticated features. Profile and cart are auto-created.

### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securepassword'
})
```

### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser()
```

### Sign Out
```typescript
await supabase.auth.signOut()
```

---

## Products

### List Active Products (Public)
```typescript
const { data: products, error } = await supabase
  .from('products')
  .select(`
    *,
    category:categories(*),
    variants:product_variants(
      *,
      color:product_colors(*),
      size:product_sizes(*)
    ),
    images:product_images(*)
  `)
  .eq('is_active', true)
  .order('created_at', { ascending: false })
```

### Get Product by Slug (Public)
```typescript
const { data: product, error } = await supabase
  .from('products')
  .select(`
    *,
    category:categories(*),
    variants:product_variants(
      *,
      color:product_colors(*),
      size:product_sizes(*)
    ),
    images:product_images(*)
  `)
  .eq('slug', 'product-slug')
  .eq('is_active', true)
  .single()
```

### Search Products (Public)
```typescript
const { data: products, error } = await supabase
  .from('products')
  .select('*')
  .textSearch('name', 'gym shirt', { type: 'plain', config: 'english' })
  .eq('is_active', true)
```

### Filter Products by Category
```typescript
const { data: products, error } = await supabase
  .from('products')
  .select('*, category:categories(*)')
  .eq('category_id', 'category-uuid')
  .eq('is_active', true)
```

### Featured Products
```typescript
const { data: products, error } = await supabase
  .from('products')
  .select('*')
  .eq('is_featured', true)
  .eq('is_active', true)
  .limit(8)
```

---

## Categories

### List All Active Categories (Public)
```typescript
const { data: categories, error } = await supabase
  .from('categories')
  .select('*')
  .eq('is_active', true)
  .order('sort_order')
```

### Get Category with Products
```typescript
const { data: category, error } = await supabase
  .from('categories')
  .select(`
    *,
    products:products(*)
  `)
  .eq('slug', 'category-slug')
  .single()
```

---

## Cart (Authenticated)

### Get User Cart
```typescript
const { data: cart, error } = await supabase
  .from('cart_items')
  .select(`
    *,
    variant:product_variants(
      *,
      product:products(*),
      color:product_colors(*),
      size:product_sizes(*)
    )
  `)
```

### Add to Cart
```typescript
const { data, error } = await supabase
  .from('cart_items')
  .upsert({
    cart_id: userCartId, // Get from carts table where user_id = auth.uid()
    variant_id: 'variant-uuid',
    quantity: 2
  })
```

### Update Cart Item Quantity
```typescript
const { data, error } = await supabase
  .from('cart_items')
  .update({ quantity: 3 })
  .eq('id', 'cart-item-uuid')
```

### Remove from Cart
```typescript
const { data, error } = await supabase
  .from('cart_items')
  .delete()
  .eq('id', 'cart-item-uuid')
```

### Clear Cart
```typescript
const { data, error } = await supabase
  .from('cart_items')
  .delete()
  .in('cart_id', [userCartId])
```

---

## Wishlist (Authenticated)

### Get User Wishlist
```typescript
const { data: wishlist, error } = await supabase
  .from('wishlists')
  .select(`
    *,
    product:products(*, images:product_images(*))
  `)
```

### Add to Wishlist
```typescript
const { data, error } = await supabase
  .from('wishlists')
  .insert({
    user_id: user.id,
    product_id: 'product-uuid'
  })
```

### Remove from Wishlist
```typescript
const { data, error } = await supabase
  .from('wishlists')
  .delete()
  .eq('product_id', 'product-uuid')
```

---

## Addresses (Authenticated)

### Get User Addresses
```typescript
const { data: addresses, error } = await supabase
  .from('addresses')
  .select('*')
  .order('is_default', { ascending: false })
```

### Add Address
```typescript
const { data, error } = await supabase
  .from('addresses')
  .insert({
    user_id: user.id,
    label: 'Home',
    full_name: 'John Doe',
    phone: '+919876543210',
    address_line_1: '123 Main St',
    address_line_2: 'Apt 4B',
    city: 'Mumbai',
    state: 'Maharashtra',
    postal_code: '400001',
    country: 'India',
    is_default: true
  })
```

### Update Address
```typescript
const { data, error } = await supabase
  .from('addresses')
  .update({ is_default: true })
  .eq('id', 'address-uuid')
```

### Delete Address
```typescript
const { data, error } = await supabase
  .from('addresses')
  .delete()
  .eq('id', 'address-uuid')
```

---

## Orders (Authenticated)

### Get User Orders
```typescript
const { data: orders, error } = await supabase
  .from('orders')
  .select(`
    *,
    order_items(*)
  `)
  .order('created_at', { ascending: false })
```

### Get Single Order
```typescript
const { data: order, error } = await supabase
  .from('orders')
  .select(`
    *,
    order_items(*)
  `)
  .eq('id', 'order-uuid')
  .single()
```

### Track Order Status
```typescript
const { data: order, error } = await supabase
  .from('orders')
  .select('status, tracking_number, tracking_url')
  .eq('order_number', 'ORD-20260217-ABCD')
  .single()
```

---

## Reviews (Authenticated for write, Public for read)

### Get Product Reviews (Public)
```typescript
const { data: reviews, error } = await supabase
  .from('product_reviews')
  .select(`
    *,
    user:profiles(full_name, avatar_url)
  `)
  .eq('product_id', 'product-uuid')
  .eq('is_approved', true)
  .order('created_at', { ascending: false })
```

### Add Review (Authenticated)
```typescript
const { data, error } = await supabase
  .from('product_reviews')
  .insert({
    product_id: 'product-uuid',
    user_id: user.id,
    rating: 5,
    title: 'Great product!',
    body: 'Love this gym shirt, very comfortable.'
  })
```

**Note**: `is_verified_purchase` is auto-set based on order history.

### Update Review
```typescript
const { data, error } = await supabase
  .from('product_reviews')
  .update({
    rating: 4,
    body: 'Updated review text'
  })
  .eq('id', 'review-uuid')
```

### Delete Review
```typescript
const { data, error } = await supabase
  .from('product_reviews')
  .delete()
  .eq('id', 'review-uuid')
```

---

## Coupons (Authenticated)

### Validate Coupon
```typescript
const { data: coupon, error } = await supabase
  .from('coupons')
  .select('*')
  .eq('code', 'WELCOME10')
  .eq('is_active', true)
  .gte('valid_until', new Date().toISOString())
  .single()

// Then check usage limits manually
const { count } = await supabase
  .from('coupon_usages')
  .select('*', { count: 'exact', head: true })
  .eq('coupon_id', coupon.id)
  .eq('user_id', user.id)
```

---

## Profile (Authenticated)

### Get Profile
```typescript
const { data: profile, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single()
```

### Update Profile
```typescript
const { data, error } = await supabase
  .from('profiles')
  .update({
    full_name: 'John Doe',
    phone: '+919876543210'
  })
  .eq('id', user.id)
```

---

## Storage / File Upload

### Upload Product Image (Admin Only)
```typescript
const file = event.target.files[0]
const filePath = `${productId}/general/${Date.now()}_${file.name}`

const { data, error } = await supabase.storage
  .from('product-images')
  .upload(filePath, file)

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('product-images')
  .getPublicUrl(filePath)
```

### Upload Avatar (User)
```typescript
const file = event.target.files[0]
const filePath = `${user.id}/avatar.webp`

const { data, error } = await supabase.storage
  .from('avatars')
  .upload(filePath, file, { upsert: true })
```

---

## Admin RPC Functions (Admin Only)

### Get Dashboard Stats
```typescript
const { data, error } = await supabase.rpc('admin_get_dashboard_stats')

// Returns:
// {
//   total_orders: 150,
//   total_revenue: 245000,
//   orders_today: 5,
//   revenue_today: 8500,
//   pending_orders: 12,
//   total_customers: 230,
//   low_stock_variants: 8,
//   pending_returns: 3,
//   pending_reviews: 7
// }
```

### Get Low Stock Variants
```typescript
const { data, error } = await supabase.rpc('admin_get_low_stock_variants')

// Returns array of variants with low stock
```

### Update Order Status
```typescript
const { data, error } = await supabase.rpc('admin_update_order_status', {
  order_id_input: 'order-uuid',
  new_status: 'shipped',
  tracking_number_input: '1234567890',
  tracking_url_input: 'https://tracking.com/1234567890',
  notes_input: 'Shipped via BlueDart'
})
```

### Process Return
```typescript
const { data, error } = await supabase.rpc('admin_process_return', {
  return_id_input: 'return-uuid',
  new_status: 'approved',
  admin_notes_input: 'Return approved, refund initiated',
  refund_amount_input: 1499.00
})
```

---

## Returns (Authenticated)

### Request Return
```typescript
const { data: returnRequest, error } = await supabase
  .from('returns')
  .insert({
    order_id: 'order-uuid',
    user_id: user.id,
    reason: 'size_issue',
    description: 'Product too small, need to exchange'
  })
  .select()
  .single()

// Then add return items
const { data: returnItems, error: itemsError } = await supabase
  .from('return_items')
  .insert([
    {
      return_id: returnRequest.id,
      order_item_id: 'order-item-uuid',
      quantity: 1
    }
  ])
```

### Get My Returns
```typescript
const { data: returns, error } = await supabase
  .from('returns')
  .select(`
    *,
    order:orders(order_number),
    return_items(
      *,
      order_item:order_items(*)
    )
  `)
  .order('created_at', { ascending: false })
```

---

## Real-time Subscriptions

### Subscribe to Order Updates
```typescript
const orderSubscription = supabase
  .channel('order-updates')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'orders',
      filter: `user_id=eq.${user.id}`
    },
    (payload) => {
      console.log('Order updated:', payload.new)
    }
  )
  .subscribe()

// Unsubscribe when done
orderSubscription.unsubscribe()
```

### Subscribe to Cart Changes
```typescript
const cartSubscription = supabase
  .channel('cart-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'cart_items'
    },
    (payload) => {
      console.log('Cart changed:', payload)
    }
  )
  .subscribe()
```

---

## Error Handling

All Supabase operations return `{ data, error }`. Always check for errors:

```typescript
const { data, error } = await supabase.from('products').select('*')

if (error) {
  console.error('Error:', error.message)
  // Handle error (show toast, etc.)
  return
}

// Use data
console.log(data)
```

---

## Role-Based Access

Check user role from JWT or profile:

```typescript
const { data: { user } } = await supabase.auth.getUser()

// Get profile with role
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single()

if (profile.role === 'admin') {
  // Show admin UI
}
```

---

## Pagination

```typescript
const pageSize = 20
const page = 1

const { data, error, count } = await supabase
  .from('products')
  .select('*', { count: 'exact' })
  .eq('is_active', true)
  .range((page - 1) * pageSize, page * pageSize - 1)

const totalPages = Math.ceil(count / pageSize)
```

---

## Best Practices

1. **Always validate user input** before inserting/updating
2. **Use transactions** for multi-step operations (via RPC functions)
3. **Check stock availability** before adding to cart
4. **Handle loading and error states** in UI
5. **Use optimistic updates** for better UX
6. **Cache frequently accessed data** (categories, etc.)
7. **Implement debouncing** for search functionality
8. **Use select with specific fields** to reduce payload size

---

## Environment Variables (.env)

```env
NEXT_PUBLIC_SUPABASE_URL=https://cqeosjuwkaxcnigqtymw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## Testing

Use Supabase Studio SQL Editor for testing queries:
https://supabase.com/dashboard/project/cqeosjuwkaxcnigqtymw/editor

---

## Support & Resources

- **Supabase Dashboard**: https://supabase.com/dashboard/project/cqeosjuwkaxcnigqtymw
- **Supabase Docs**: https://supabase.com/docs
- **Project Setup Guide**: See SETUP_GUIDE.md
- **Database Schema**: See instructions.md

---

**Last Updated**: February 17, 2026
**API Version**: 1.0
**Project**: Neversore E-Commerce Backend
