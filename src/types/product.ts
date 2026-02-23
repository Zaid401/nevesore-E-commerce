// ─── Global Sizes ────────────────────────────────────────────────────────────
export interface Size {
  id: string;
  size_label: string; // "S" | "M" | "L" | "XL" | "XXL" | "XXXL"
  sort_order: number;
}

// ─── Categories ──────────────────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
}

// ─── Products ─────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  base_price: number;
  sale_price: number | null;
  category_id: string | null;
  is_active: boolean;
  is_featured: boolean;
  tags: string[];
  created_at: string;
}

// ─── Product Colors (per-product) ─────────────────────────────────────────────
export interface ProductColor {
  id: string;
  product_id: string;
  color_name: string;  // e.g., "Crimson Red"
  color_hex: string;   // e.g., "#cc071e"
  image_url: string | null;
  sort_order: number;
}

// ─── Product Variants (color × size) ─────────────────────────────────────────
export interface ProductVariant {
  id: string;
  product_id: string;
  color_id: string;
  size_id: string;
  sku: string;
  price_override: number | null;
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
}

// ─── Product Images ───────────────────────────────────────────────────────────
export interface ProductImage {
  id: string;
  product_id: string;
  color_id: string | null;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
}

// ─── Denormalized product for listing / product-card ─────────────────────────
export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  sale_price: number | null;
  category: string;        // category.name
  image: string;           // primary product_image url
  color_count: number;     // number of product_colors
  avg_rating: number | null;
  review_count: number;
}

// ─── Full product detail (for product page) ───────────────────────────────────
export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  base_price: number;
  sale_price: number | null;
  category: Category | null;
  colors: ProductColorWithImages[];
  sizes: Size[];
  variants: ProductVariantWithSize[];
  images: ProductImage[];
  avg_rating: number | null;
  review_count: number;
}

export interface ProductColorWithImages extends ProductColor {
  images: ProductImage[];
}

export interface ProductVariantWithSize extends ProductVariant {
  size: Size;
  color: ProductColor;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export type CartItem = {
  // Variant reference (the canonical key)
  variant_id: string;

  // Product info (denormalized for display, no DB round-trip needed)
  product_id: string;
  product_name: string;
  category: string;
  sku: string;

  // Variant display info
  color_name: string;
  color_hex: string;
  size_label: string;

  // Pricing & media
  price: number;       // resolved: price_override ?? sale_price ?? base_price
  image: string;

  quantity: number;
};

// ─── Pricing helper ───────────────────────────────────────────────────────────
export function resolvePrice(
  base_price: number,
  sale_price: number | null,
  price_override: number | null
): number {
  return price_override ?? sale_price ?? base_price;
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}
