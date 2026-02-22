"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useCart } from "@/context/cart-context";
import { supabase } from "@/lib/supabase";
import { formatPrice, resolvePrice } from "@/types/product";

interface ProductColor {
  id: string;
  color_name: string;
  color_hex: string;
  image_url: string | null;
  sort_order: number;
}

interface SizeOption {
  id: string;       // sizes.id
  size_label: string;
  variant_id: string;
  stock_quantity: number;
  price_override: number | null;
}

interface ProductImage {
  id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
  color_id: string | null;
}

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  base_price: number;
  sale_price: number | null;
  category_name: string;
  avg_rating: number;
  review_count: number;
  colors: ProductColor[];
  images: ProductImage[];
  // map: color_id â†’ available size options
  sizesByColor: Record<string, SizeOption[]>;
}

const FALLBACK_IMAGE = "/product/fallback.png";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const { addItem, itemCount, items, subtotal } = useCart();
  const router = useRouter();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState("description");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
  const [cartImgErrors, setCartImgErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!params?.id) return;
    fetchProduct(params.id);
  }, [params?.id]);

  const fetchProduct = async (id: string) => {
    setLoading(true);
    try {
      // Fetch product with category
      const { data: prod, error: prodError } = await supabase
        .from("products")
        .select("id,name,slug,description,short_description,base_price,sale_price,categories(name)")
        .eq("id", id)
        .eq("is_active", true)
        .single();

      if (prodError || !prod) { setLoading(false); return; }

      // Fetch colors
      const { data: colors } = await supabase
        .from("product_colors")
        .select("id,color_name,color_hex,image_url,sort_order")
        .eq("product_id", id)
        .order("sort_order");

      // Fetch all variants with size info
      const { data: variants } = await supabase
        .from("product_variants")
        .select("id,color_id,size_id,price_override,stock_quantity,is_active,sizes(id,size_label,sort_order)")
        .eq("product_id", id)
        .eq("is_active", true)
        .gt("stock_quantity", 0);

      // Fetch images
      const { data: images } = await supabase
        .from("product_images")
        .select("id,image_url,is_primary,sort_order,color_id")
        .eq("product_id", id)
        .order("sort_order");

      // Fetch rating stats
      const { data: reviews } = await supabase
        .from("product_reviews")
        .select("rating")
        .eq("product_id", id)
        .eq("is_approved", true);

      const reviewCount = reviews?.length ?? 0;
      const avgRating = reviewCount > 0
        ? Math.round((reviews!.reduce((s, r) => s + r.rating, 0) / reviewCount) * 10) / 10
        : 0;

      // Build sizesByColor map
      const sizesByColor: Record<string, SizeOption[]> = {};
      for (const v of (variants || [])) {
        const sizeData = Array.isArray(v.sizes) ? v.sizes[0] : v.sizes;
        if (!sizeData) continue;
        if (!sizesByColor[v.color_id]) sizesByColor[v.color_id] = [];
        sizesByColor[v.color_id].push({
          id: sizeData.id,
          size_label: sizeData.size_label,
          variant_id: v.id,
          stock_quantity: v.stock_quantity,
          price_override: v.price_override,
        });
      }
      // Sort sizes by sort_order
      for (const key of Object.keys(sizesByColor)) {
        sizesByColor[key].sort((a, b) => a.size_label.localeCompare(b.size_label));
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const categoryData = Array.isArray((prod as any).categories) ? (prod as any).categories[0] : (prod as any).categories;

      setProduct({
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        short_description: prod.short_description,
        base_price: prod.base_price,
        sale_price: prod.sale_price,
        category_name: categoryData?.name ?? "NEVERSORE",
        avg_rating: avgRating,
        review_count: reviewCount,
        colors: (colors || []) as ProductColor[],
        images: (images || []) as ProductImage[],
        sizesByColor,
      });

      // Pre-select first size for first color
      const firstColorId = colors?.[0]?.id;
      if (firstColorId && sizesByColor[firstColorId]?.length > 0) {
        setSelectedSizeId(sizesByColor[firstColorId][0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedColor = product?.colors[selectedColorIdx];
  const availableSizes = selectedColor ? (product?.sizesByColor[selectedColor.id] ?? []) : [];

  // Images for current color (color-specific first, else global)
  const colorImages = product?.images.filter((img) => img.color_id === selectedColor?.id) ?? [];
  const globalImages = product?.images.filter((img) => !img.color_id) ?? [];
  const displayImages = colorImages.length > 0 ? colorImages : globalImages;

  // Reset image errors when color changes
  // (inline reset in the setSelectedColorIdx call below handles most cases)

  const selectedVariant = availableSizes.find((s) => s.id === selectedSizeId) ?? null;
  const displayPrice = product
    ? resolvePrice(product.base_price, product.sale_price, selectedVariant?.price_override ?? null)
    : 0;

  const handleAddToCart = () => {
    if (!product || !selectedColor || !selectedVariant) return;
    addItem({
      variant_id: selectedVariant.variant_id,
      product_id: product.id,
      product_name: product.name,
      category: product.category_name,
      sku: `${product.slug}-${selectedColor.color_name}-${selectedVariant.size_label}`.toUpperCase(),
      color_name: selectedColor.color_name,
      color_hex: selectedColor.color_hex,
      size_label: selectedVariant.size_label,
      price: displayPrice,
      image: displayImages[0]?.image_url || FALLBACK_IMAGE,
      quantity,
    });
    setIsCartOpen(true);
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? "" : section);
  };

  if (loading) {
    return (
      <main className="bg-[#f8f8f8] min-h-screen text-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center text-gray-400 text-sm">
          Loading productâ€¦
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="bg-[#f8f8f8] min-h-screen text-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <p className="text-lg font-semibold">Product not found.</p>
          <Link href="/" className="mt-4 inline-block text-sm text-[#cc071e] underline">Back to home</Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-[#f8f8f8] min-h-screen text-slate-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* LEFT COLUMN - IMAGE GALLERY */}
          <div className="lg:col-span-7">
            <div className="flex flex-col gap-4 lg:flex-row">
              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2 lg:w-28 lg:flex-col lg:overflow-visible lg:pb-0">
                {displayImages.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIdx(index)}
                    className={`relative h-20 w-20 flex-none border-2 lg:h-24 lg:w-24 ${
                      selectedImageIdx === index
                        ? "border-[#cc071e]"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                        src={imgErrors.has(index) ? FALLBACK_IMAGE : (img.image_url || FALLBACK_IMAGE)}
                        alt="thumb"
                        fill
                        className="object-cover"
                        onError={() => setImgErrors((p) => new Set(p).add(index))}
                      />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="bg-white rounded-sm overflow-hidden aspect-[4/5] shadow-sm relative flex-1">
                {displayImages[selectedImageIdx] ? (
                  <Image
                    src={imgErrors.has(selectedImageIdx) ? FALLBACK_IMAGE : (displayImages[selectedImageIdx].image_url || FALLBACK_IMAGE)}
                    alt={product.name}
                    fill
                    className="object-cover"
                    onError={() => setImgErrors((p) => new Set(p).add(selectedImageIdx))}
                  />
                ) : (
                  <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-300 text-sm">
                    No image
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - PRODUCT INFO */}
          <div className="lg:col-span-5 space-y-8">

            {/* Header */}
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-gray-400 mb-2 uppercase">
                {product.category_name}
              </p>

              <h1 className="text-4xl font-extrabold tracking-tight mb-2 uppercase">
                {product.name}
              </h1>

              <div className="h-[2px] w-1/3 bg-gradient-to-r from-[#cc071e] to-transparent mb-4" />

              <div className="flex items-center space-x-4 mb-4">
                <span className="text-2xl font-semibold text-[#cc071e]">
                  {formatPrice(displayPrice)}
                </span>
                {product.sale_price && product.sale_price < product.base_price && !selectedVariant?.price_override && (
                  <span className="text-base text-gray-400 line-through">
                    {formatPrice(product.base_price)}
                  </span>
                )}
                {product.review_count > 0 && (
                  <div className="flex items-center text-yellow-400">
                    <span className="text-sm font-medium text-gray-600 mr-1">{product.avg_rating}</span>
                    â­
                    <span className="text-xs text-gray-400 ml-2">({product.review_count} Reviews)</span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed">
                {product.short_description ?? product.description ?? ""}
              </p>
            </div>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <span className="text-sm font-bold uppercase tracking-wider">
                  Select Color:{" "}
                  <span className="font-normal text-gray-500">{selectedColor?.color_name}</span>
                </span>

                <div className="flex space-x-3 mt-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={color.id}
                      onClick={() => {
                        setSelectedColorIdx(index);
                        setSelectedImageIdx(0);
                        setImgErrors(new Set());
                        const newSizes = product.sizesByColor[color.id] ?? [];
                        setSelectedSizeId(newSizes[0]?.id ?? null);
                      }}
                      className={`w-8 h-8 rounded-full transition-all ${
                        selectedColorIdx === index
                          ? "ring-2 ring-[#cc071e] ring-offset-2"
                          : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-1"
                      }`}
                      style={{ backgroundColor: color.color_hex }}
                      title={color.color_name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div>
                <span className="text-sm font-bold uppercase tracking-wider">Select Size</span>
                <div className="grid grid-cols-5 gap-2 mt-3">
                  {availableSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSizeId(size.id)}
                      className={`py-3 border text-sm font-bold uppercase transition ${
                        selectedSizeId === size.id
                          ? "border-[#cc071e] text-[#cc071e]"
                          : "border-gray-200 hover:border-[#cc071e]"
                      }`}
                    >
                      {size.size_label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Stock status */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-200 rounded">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2">-</button>
                <span className="px-4 font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2">+</button>
              </div>
              {selectedVariant ? (
                <p className="text-sm text-green-600 font-medium">In Stock â€¢ Ready to ship</p>
              ) : (
                <p className="text-sm text-red-500 font-medium">Select a size</p>
              )}
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant}
                className="w-full bg-[#cc071e] text-white py-4 font-extrabold tracking-widest hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ADD TO CART
              </button>

              <button
                onClick={() => { handleAddToCart(); router.push("/checkout"); }}
                disabled={!selectedVariant}
                className="w-full border-2 border-slate-900 py-4 font-extrabold tracking-widest hover:bg-slate-900 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                BUY IT NOW
              </button>
            </div>

            {/* Accordion */}
            <div className="border-t border-gray-100 pt-4 space-y-4">
              <div className="border-b border-gray-100 py-4">
                <button
                  onClick={() => toggleAccordion("description")}
                  className="w-full text-left font-bold text-sm uppercase tracking-widest flex justify-between"
                >
                  Description
                  {activeAccordion === "description" ? "-" : "+"}
                </button>
                {activeAccordion === "description" && (
                  <div className="mt-4 text-sm text-gray-600">
                    {product.description ?? "High-performance fitness clothing engineered for your toughest sessions."}
                  </div>
                )}
              </div>
              <div className="border-b border-gray-100 py-4">
                <button
                  onClick={() => toggleAccordion("fabric")}
                  className="w-full text-left font-bold text-sm uppercase tracking-widest flex justify-between"
                >
                  Fabric &amp; Care
                  {activeAccordion === "fabric" ? "-" : "+"}
                </button>
                {activeAccordion === "fabric" && (
                  <div className="mt-4 text-sm text-gray-600">
                    88% Polyester, 12% Spandex. Machine wash cold. Do not bleach.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {isCartOpen && (
        <button
          type="button"
          aria-label="Close cart"
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 z-40 bg-black/40"
        />
      )}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isCartOpen}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 p-6">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-900">
              Your Cart ({itemCount})
            </h2>
            <button type="button" onClick={() => setIsCartOpen(false)} className="text-sm font-semibold text-gray-500 hover:text-slate-900">
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <p className="text-sm text-gray-500">Your cart is currently empty.</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.variant_id} className="flex items-center gap-4 border-b border-gray-100 pb-4">
                    <div className="relative h-20 w-16 overflow-hidden rounded-md bg-gray-100">
                      <Image
                          src={cartImgErrors.has(item.variant_id) ? FALLBACK_IMAGE : (item.image || FALLBACK_IMAGE)}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                          onError={() => setCartImgErrors((p) => new Set(p).add(item.variant_id))}
                        />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{item.category}</p>
                      <p className="mt-1 text-sm font-bold text-slate-900">{item.product_name}</p>
                      <p className="mt-1 text-xs text-gray-500">{item.color_name} â€¢ {item.size_label}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#cc071e]">{formatPrice(item.price * item.quantity)}</p>
                      <p className="mt-1 text-xs text-gray-500">Qty {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 p-6">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              className="mt-4 block w-full bg-[#cc071e] py-3 text-center text-sm font-extrabold uppercase tracking-[0.2em] text-white hover:bg-red-700 transition"
            >
              Checkout
            </Link>
            <button
              className="mt-3 w-full border-2 border-slate-900 py-3 text-sm font-extrabold uppercase tracking-[0.2em] text-slate-900 hover:bg-slate-900 hover:text-white transition"
              onClick={() => setIsCartOpen(false)}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </aside>
    </main>
  );
}
