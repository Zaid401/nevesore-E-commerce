"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { searchProducts, ProductSearchResult } from "@/lib/search-products";
import { supabase } from "@/lib/supabase";

const PRODUCT_FALLBACK_IMAGE = "/product/fallback.png";

interface BestSellerProduct {
  id: string;
  name: string;
  base_price: number;
  sale_price: number | null;
  short_description: string | null;
  category: string;
  image: string;
}

type SortOption = "relevance" | "price_low_to_high" | "price_high_to_low" | "newest" | "best_selling";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "best_selling", label: "Best Selling" },
  { value: "newest", label: "Newest" },
  { value: "price_low_to_high", label: "Price: Low to High" },
  { value: "price_high_to_low", label: "Price: High to Low" },
];

function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";
  const [inputValue, setInputValue] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery.trim());
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("relevance");
  const [bestSellerFallback, setBestSellerFallback] = useState<BestSellerProduct[]>([]);
  const [loadingBestSellers, setLoadingBestSellers] = useState(false);
  const lastSyncedQuery = useRef<string>(initialQuery.trim());

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setInputValue(q);
    setDebouncedQuery(q.trim());
    lastSyncedQuery.current = q.trim();
  }, [searchParams]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQuery(inputValue.trim());
    }, 300);
    return () => clearTimeout(handle);
  }, [inputValue]);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (lastSyncedQuery.current === trimmed) return;
    lastSyncedQuery.current = trimmed;
    const nextPath = trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search";
    router.replace(nextPath, { scroll: false });
  }, [debouncedQuery, router]);

  useEffect(() => {
    const activeQuery = debouncedQuery.trim();
    if (!activeQuery) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    searchProducts(activeQuery).then((data) => {
      if (cancelled) return;
      setResults(data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const sortedResults = useMemo(() => sortProducts(results, sortOption), [results, sortOption]);

  useEffect(() => {
    let cancelled = false;
    setLoadingBestSellers(true);

    fetchBestSellerFallback()
      .then((data) => {
        if (!cancelled) setBestSellerFallback(data);
      })
      .catch(() => {
        if (!cancelled) setBestSellerFallback([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingBestSellers(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);
  const resultSummary = !debouncedQuery.trim()
    ? "Start typing to explore the catalog"
    : loading
      ? "Searching products..."
      : sortedResults.length === 0
        ? "No products matched your query"
        : `Showing ${sortedResults.length} result${sortedResults.length === 1 ? "" : "s"}`;

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-neutral-200 bg-white px-5 py-6 shadow-sm sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <label htmlFor="search-input" className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                Search the collection
              </label>
              <div className="relative mt-2">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400">
                  <path
                    fill="currentColor"
                    d="M15.5 14h-.79l-.28-.27A6 6 0 1 0 14 15.5l.27.28v.79l5 5L20.49 19zm-6 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8"
                  />
                </svg>
                <input
                  id="search-input"
                  type="text"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder="Search for joggers, tees, colors..."
                  className="w-full rounded-3xl border border-neutral-200 bg-neutral-50 py-3 pl-12 pr-4 text-sm font-medium text-neutral-800 placeholder:text-neutral-400 focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cc071e]"
                />
              </div>
            </div>
            <div className="basis-full sm:basis-52">
              <label htmlFor="sort-select" className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                Sort results
              </label>
              <select
                id="sort-select"
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value as SortOption)}
                className="mt-2 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-3 text-sm font-semibold text-neutral-800 focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cc071e]"
                disabled={sortedResults.length <= 1}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.1em] text-neutral-500">
            {resultSummary}
          </p>
        </div>

        <div className="mt-8">
          {loading ? (
            <SearchSkeleton />
          ) : !debouncedQuery.trim() ? (
            <DiscoveryPanel
              products={bestSellerFallback}
              loading={loadingBestSellers}
            />
          ) : sortedResults.length === 0 ? (
            <EmptyResults
              query={debouncedQuery}
              fallbackProducts={bestSellerFallback}
              loadingFallback={loadingBestSellers}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
              {sortedResults.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.base_price}
                  sale_price={product.sale_price}
                  image={product.image}
                  category={product.category || "Neversore"}
                  short_description={product.short_description}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageInner />
    </Suspense>
  );
}

function sortProducts(results: ProductSearchResult[], option: SortOption): ProductSearchResult[] {
  if (option === "relevance") return results;
  const sorted = [...results];

  if (option === "price_low_to_high") {
    return sorted.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
  }

  if (option === "price_high_to_low") {
    return sorted.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
  }

  if (option === "newest") {
    return sorted.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  }

  if (option === "best_selling") {
    return sorted.sort((a, b) => {
      if (a.is_best_selling === b.is_best_selling) {
        return Date.parse(b.created_at) - Date.parse(a.created_at);
      }
      return a.is_best_selling ? -1 : 1;
    });
  }

  return sorted;
}

function getEffectivePrice(product: ProductSearchResult) {
  return product.sale_price ?? product.base_price;
}

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="mb-4 aspect-3/4 rounded-xl bg-neutral-100 animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-neutral-100 animate-pulse" />
          <div className="mt-3 h-3 w-1/2 rounded bg-neutral-100 animate-pulse" />
          <div className="mt-4 h-4 w-1/3 rounded bg-neutral-200 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function DiscoveryPanel({ products, loading }: { products: BestSellerProduct[]; loading: boolean }) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white px-6 py-10 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">Discover The Lineup</p>
          <p className="mt-1 text-sm text-neutral-500">Browse our performance essentials while you fine-tune your search.</p>
        </div>
        <Link
          href="/best-sellers"
          className="inline-flex items-center justify-center rounded-full border border-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
        >
          View Best Sellers
        </Link>
      </div>
      <div className="mt-6">
        <BestSellerShowcase products={products} loading={loading} />
      </div>
    </div>
  );
}

function EmptyResults({
  query,
  fallbackProducts,
  loadingFallback,
}: {
  query: string;
  fallbackProducts: BestSellerProduct[];
  loadingFallback: boolean;
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white px-6 py-10 text-center shadow-sm">
      <p className="text-lg font-semibold uppercase tracking-wide text-neutral-900">No matches for "{query}"</p>
      <p className="mt-2 text-sm text-neutral-500">
        Double-check your spelling or try a related keyword. In the meantime, explore our most-loved fits.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">Best Seller Picks</p>
        <Link
          href="/best-sellers"
          className="inline-flex items-center justify-center rounded-full border border-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
        >
          View All Best Sellers
        </Link>
      </div>
      <div className="mt-4">
        <BestSellerShowcase products={fallbackProducts} loading={loadingFallback} />
      </div>
    </div>
  );
}

function BestSellerShowcase({ products, loading }: { products: BestSellerProduct[]; loading: boolean }) {
  if (loading) {
    return <BestSellerFallbackSkeleton />;
  }

  if (products.length === 0) {
    return <p className="text-xs text-neutral-500">We&apos;re updating our best sellers. Please check back soon.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.base_price}
          sale_price={product.sale_price}
          image={product.image}
          category={product.category || "Best Seller"}
          short_description={product.short_description}
        />
      ))}
    </div>
  );
}

function BestSellerFallbackSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="aspect-3/4 rounded-xl bg-neutral-100 animate-pulse" />
          <div className="mt-4 h-3 w-2/3 rounded bg-neutral-100 animate-pulse" />
          <div className="mt-2 h-3 w-1/3 rounded bg-neutral-100 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

interface BestSellerRow {
  id: string;
  name: string;
  base_price: number;
  sale_price: number | null;
  short_description: string | null;
  categories: { name: string } | null;
  product_images: ProductImageFallbackRow[] | null;
}

interface ProductImageFallbackRow {
  image_url: string | null;
  is_primary: boolean;
  sort_order: number | null;
}

async function fetchBestSellerFallback(): Promise<BestSellerProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,base_price,sale_price,short_description,categories(name),product_images(image_url,is_primary,sort_order)"
    )
    .eq("is_best_selling", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    console.error("bestSeller fallback failed", error.message);
    return [];
  }

  return ((data as unknown as BestSellerRow[]) ?? []).map(mapBestSellerRow);
}

function mapBestSellerRow(row: BestSellerRow): BestSellerProduct {
  return {
    id: row.id,
    name: row.name,
    base_price: row.base_price,
    sale_price: row.sale_price,
    short_description: row.short_description,
    category: row.categories?.name ?? "Best Seller",
    image: resolveFallbackImage(row.product_images),
  };
}

function resolveFallbackImage(images: ProductImageFallbackRow[] | null): string {
  if (!images || images.length === 0) return PRODUCT_FALLBACK_IMAGE;
  const sorted = [...images].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    const orderA = a.sort_order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.sort_order ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });
  return sorted[0]?.image_url ?? PRODUCT_FALLBACK_IMAGE;
}
