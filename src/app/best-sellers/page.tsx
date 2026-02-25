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
  short_description: string | null;
}

export default function BestSellersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    async function fetchBestSellers() {
      setLoading(true);
      let query = supabase
        .from("products")
        .select(
          "id, name, base_price, sale_price, short_description, categories(name), product_images(image_url, sort_order, is_primary)"
        )
        .eq("is_best_selling", true)
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
              short_description: p.short_description,
              category: p.categories?.name ?? "",
              image: imgs[0]?.image_url ?? "/product/fallback.png",
            };
          })
        );
      }
      setLoading(false);
    }
    fetchBestSellers();
  }, [sortOrder]);

  return (
    <main className="bg-neutral-50 min-h-screen text-neutral-900">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mb-12">
          <Link
            href="/"
            className="text-xs font-semibold uppercase  text-neutral-600 hover:text-neutral-900 transition-colors sm:text-sm"
          >
            ← Back to Home
          </Link>
          <h1 className="mt-5 text-2xl font-extrabold uppercase text-neutral-900 sm:mt-6 sm:text-3xl lg:text-4xl">
            Best Seller Collection
          </h1>
          <div className="mt-3 h-0.5 w-20 bg-gradient-to-r from-[#cc071e] to-transparent" />
          <p className="mt-3 text-sm text-neutral-600 sm:mt-4 sm:text-base lg:text-lg">
            Shop the most-loved pieces picked by our community.
          </p>
        </div>

        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
          <p className="text-xs font-medium text-neutral-600 sm:text-sm">
            {loading ? "Loading..." : `Showing ${products.length} products`}
          </p>
          <div className="flex gap-3">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#cc071e] sm:px-4 sm:text-sm"
            >
              <option value="default">Sort by Best Sellers</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-neutral-100 animate-pulse"
                style={{ aspectRatio: "3/4" }}
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center">
            <p className="text-base font-semibold text-neutral-900">
              No best sellers yet
            </p>
            <p className="mt-2 text-sm text-neutral-600">
              Check back soon for the most-loved picks from our community.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
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
        )}
      </div>

      <Footer />
    </main>
  );
}
