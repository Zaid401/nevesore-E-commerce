"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  base_price: number;
  sale_price: number | null;
  category: string;
  image: string;
}

export default function FeaturedProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    async function fetchFeatured() {
      setLoading(true);
      let query = supabase
        .from("products")
        .select(
          "id, name, base_price, sale_price, categories(name), product_images(image_url, sort_order, is_primary)"
        )
        .eq("is_featured", true)
        .eq("is_active", true);

      if (sortOrder === "price_asc")
        query = query.order("base_price", { ascending: true });
      else if (sortOrder === "price_desc")
        query = query.order("base_price", { ascending: false });
      else query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (!error && data) {
        setProducts(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.map((p: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const imgs = [...(p.product_images ?? [])].sort(
              (a: any, b: any) =>
                (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) ||
                a.sort_order - b.sort_order
            );
            return {
              id: p.id,
              name: p.name,
              base_price: p.base_price,
              sale_price: p.sale_price,
              category: p.categories?.name ?? "",
              image: imgs[0]?.image_url ?? "/product/fallback.png",
            };
          })
        );
      }
      setLoading(false);
    }
    fetchFeatured();
  }, [sortOrder]);

  return (
    <main className="bg-neutral-50 min-h-screen text-neutral-900">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {/* Page Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-600 hover:text-neutral-900 transition-colors sm:text-sm"
          >
            ← Back to Home
          </Link>
          <h1 className="mt-5 text-2xl font-extrabold uppercase tracking-[0.2em] text-neutral-900 sm:mt-6 sm:text-3xl lg:text-4xl">
            Featured Products
          </h1>
          <div className="mt-3 h-0.5 w-20 bg-linear-to-r from-[#cc071e] to-transparent" />
          <p className="mt-3 text-sm text-neutral-600 sm:mt-4 sm:text-base lg:text-lg">
            Explore our curated selection of premium products designed for
            performance and style.
          </p>
        </div>

        {/* Sort row */}
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
          <p className="text-xs font-medium text-neutral-600 sm:text-sm">
            {loading ? "Loading..." : `Showing ${products.length} products`}
          </p>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#cc071e] sm:px-4 sm:text-sm"
          >
            <option value="default">Sort by Latest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6 mb-10 sm:mb-12 lg:mb-16">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-neutral-100 animate-pulse"
                style={{ aspectRatio: "3/4" }}
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center mb-10 sm:mb-12 lg:mb-16">
            <p className="text-base font-semibold text-neutral-900">
              No featured products yet
            </p>
            <p className="mt-2 text-sm text-neutral-600">
              Check back soon for the latest curated drops.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6 mb-10 sm:mb-12 lg:mb-16">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.base_price}
                sale_price={product.sale_price}
                image={product.image}
                category={product.category}
              />
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="rounded-2xl bg-linear-to-r from-[#cc071e] to-red-700 p-6 text-center text-white sm:p-10 lg:p-16">
          <h2 className="text-xl font-bold uppercase tracking-[0.2em] sm:text-2xl">
            Find Your Perfect Fit
          </h2>
          <p className="mt-3 text-xs sm:mt-4 sm:text-sm lg:text-base">
            Can&apos;t find what you&apos;re looking for? Explore all our
            collections or contact our support team.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-center">
            <Link
              href="/upper"
              className="px-6 py-3 bg-white text-[#cc071e] text-xs font-bold uppercase tracking-[0.15em] hover:bg-neutral-100 transition-all sm:px-8 sm:text-sm"
            >
              Shop All
            </Link>
            <a
              href="mailto:support@neversore.com"
              className="px-6 py-3 border-2 border-white text-xs font-bold uppercase tracking-[0.15em] text-white hover:bg-white hover:text-[#cc071e] transition-all sm:px-8 sm:text-sm"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
