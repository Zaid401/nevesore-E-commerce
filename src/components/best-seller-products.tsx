"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "./product-card";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  base_price: number;
  sale_price: number | null;
  category: string;
  image: string;
}

export default function BestSellerProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBestSellers() {
      const { data, error } = await supabase
        .from("products")
        .select(
          "id, name, base_price, sale_price, categories(name), product_images(image_url, sort_order, is_primary)"
        )
        .eq("is_best_selling", true)
        .eq("is_active", true)
        .limit(4);

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
              category: p.categories?.name ?? "",
              image: imgs[0]?.image_url ?? "/product/fallback.png",
            };
          })
        );
      }
      setLoading(false);
    }
    fetchBestSellers();
  }, []);

  return (
    <section className="bg-white py-12 text-neutral-900 sm:py-16 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:gap-8 sm:px-6 lg:px-8">
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-neutral-900 sm:text-2xl">
              Best Seller Collection
            </h2>
            <div className="mt-2 h-[2px] w-16 bg-gradient-to-r from-[#cc071e] to-transparent sm:w-20" />
          </div>
          <Link
            href="/best-sellers"
            className="whitespace-nowrap px-3 py-2 sm:px-6 border-2 border-neutral-900 font-bold uppercase tracking-[0.15em] text-xs sm:text-base text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-200"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-neutral-100 animate-pulse"
                style={{ aspectRatio: "3/4" }}
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-sm text-neutral-400">
            No best sellers configured yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
      </div>
    </section>
  );
}
