"use client";

import Link from "next/link";
import ProductCard from "./product-card";
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  base_price: number;
  sale_price: number | null;
  category: string;
  image: string;
  short_description: string | null;
}

interface ProductImage {
  image_url: string;
  sort_order: number;
  is_primary: boolean;
}

interface SupabaseProduct {
  id: string;
  name: string;
  base_price: number;
  sale_price: number | null;
  short_description: string | null;
  categories: { name: string }[] | null;
  product_images: ProductImage[] | null;
}

const GAP = 16; // px gap between cards

// ─── Multi-card carousel (used when > 4 featured products) ───────────────────
function FeaturedCarousel({ products }: { products: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const cw = containerRef.current.offsetWidth;
    const count = cw >= 1024 ? 4 : 2;
    const w = (cw - (count - 1) * GAP) / count;
    setCardWidth(w);
    setVisibleCount(count);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const maxIndex = Math.max(0, products.length - visibleCount);
  // Clamp current index to valid range when layout or products change
  const clampedIndex = Math.min(currentIndex, maxIndex);
  const offset = -(clampedIndex * (cardWidth + GAP));

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <div className="relative px-5 sm:px-6">
      {/* Prev arrow */}
      <button
        onClick={prev}
        disabled={clampedIndex === 0}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-neutral-200 text-lg text-neutral-700 transition hover:bg-neutral-900 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed sm:h-10 sm:w-10"
        aria-label="Previous"
      >
        ‹
      </button>

      {/* Track */}
      <div ref={containerRef} className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(${offset}px)`, gap: `${GAP}px` }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="shrink-0"
              style={{
                width:
                  cardWidth > 0
                    ? `${cardWidth}px`
                    : `calc((100% - ${(visibleCount - 1) * GAP}px) / ${visibleCount})`,
              }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.base_price}
                sale_price={product.sale_price}
                image={product.image}
                category={product.category}
                short_description={product.short_description}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Next arrow */}
      <button
        onClick={next}
        disabled={clampedIndex >= maxIndex}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-neutral-200 text-lg text-neutral-700 transition hover:bg-neutral-900 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed sm:h-10 sm:w-10"
        aria-label="Next"
      >
        ›
      </button>

      {/* Dots */}
      {maxIndex > 0 && (
        <div className="mt-5 flex justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-200 ${i === clampedIndex ? "w-6 bg-neutral-900" : "w-1.5 bg-neutral-300"
                }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Static grid (used when ≤ 4 featured products) ───────────────────────────
function StaticGrid({ products }: { products: Product[] }) {
  const colClass =
    products.length <= 1
      ? "lg:grid-cols-1"
      : products.length === 2
        ? "lg:grid-cols-2"
        : products.length === 3
          ? "lg:grid-cols-3"
          : "lg:grid-cols-4";

  return (
    <div className={`grid grid-cols-2 gap-3 sm:gap-6 ${colClass}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.base_price}
          sale_price={product.sale_price}
          image={product.image}
          category={product.category}
          short_description={product.short_description}
        />
      ))}
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl bg-neutral-100 animate-pulse"
          style={{ aspectRatio: "3/4" }}
        />
      ))}
    </div>
  );
}

// ─── Main exported component ──────────
export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      const { data, error } = await supabase
        .from("products")
        .select(
          "id, name, base_price, sale_price, short_description, categories(name), product_images(image_url, sort_order, is_primary)"
        )
        .eq("is_featured", true)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProducts(
          data.map((p: SupabaseProduct) => {
            const imgs = [...(p.product_images ?? [])].sort(
              (a: ProductImage, b: ProductImage) =>
                (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) ||
                a.sort_order - b.sort_order
            );
            return {
              id: p.id,
              name: p.name,
              base_price: p.base_price,
              sale_price: p.sale_price,
              short_description: p.short_description,
              category: p.categories?.[0]?.name ?? "",
              image: imgs[0]?.image_url ?? "/product/fallback.png",
            };
          })
        );
      }
      setLoading(false);
    }
    fetchFeatured();
  }, []);

  return (
    <section className="bg-neutral-50 py-12 text-neutral-900 sm:py-16 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:gap-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
          <div>
            <h2 className="text-xl font-bold uppercase text-neutral-900 sm:text-2xl">
              Featured Products
            </h2>
            <div className="mt-2 h-0.5 w-16 bg-linear-to-r from-[#cc071e] to-transparent sm:w-20" />
          </div>
          <Link
            href="/featured-products"
            className="whitespace-nowrap px-3 py-2 sm:px-6 border-2 border-neutral-900 font-bold uppercase text-xs sm:text-base text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-200"
          >
            View All
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonGrid />
        ) : products.length === 0 ? (
          <p className="text-sm text-neutral-500">No featured products available.</p>
        ) : products.length > 4 ? (
          <FeaturedCarousel products={products} />
        ) : (
          <StaticGrid products={products} />
        )}
      </div>
    </section>
  );
}
