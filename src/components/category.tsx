"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

const FALLBACK_IMAGE = "/images/categories/active.png";

// ─── Single card ───────────────────────────────────────────────────────────────
function CategoryCard({ category }: { category: Category }) {
  const [imgSrc, setImgSrc] = useState<string>(
    category.image_url ?? FALLBACK_IMAGE
  );

  return (
    <Link
      href={`/${category.slug}`}
      className="group relative flex w-full overflow-hidden border border-neutral-100 bg-neutral-900 shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
      style={{ aspectRatio: "3/4" }}
    >
      <div className="absolute inset-0">
        <Image
          src={imgSrc}
          alt={`${category.name} category`}
          fill
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="object-cover opacity-90 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 80vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-neutral-950/75 via-neutral-900/20 to-transparent" />
      </div>

      <div className="relative flex h-full w-full flex-col items-center justify-center p-3 text-center sm:p-7">
        <h3 className="text-base sm:text-xl font-black uppercase tracking-wide text-white">
          {category.name}
        </h3>
        {category.description && (
          <p className="mt-1 text-xs text-neutral-300 line-clamp-2 sm:text-sm">
            {category.description}
          </p>
        )}
        <div className="mt-4 hidden items-center gap-2 sm:flex">
          <span className="text-sm font-bold uppercase  text-white">Shop Now</span>
          <div className="h-px w-8 bg-red-500 transition-all duration-300 group-hover:w-14" />
        </div>
      </div>
    </Link>
  );
}

// ─── Skeleton placeholder ──────────────────────────────────────────────────────
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className=" bg-neutral-100 animate-pulse"
          style={{ aspectRatio: "3/4" }}
        />
      ))}
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────
export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, description, image_url, sort_order")
        .eq("is_active", true)
        .is("parent_id", null)
        .order("sort_order", { ascending: true });

      if (!error && data) setCategories(data as Category[]);
      setLoading(false);
    }
    fetchCategories();
  }, []);

  return (
    <section className="bg-white py-16 text-neutral-900 sm:py-20 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase  text-red-600 mb-2">
            Collections
          </p>
          <h2 className="text-2xl font-black uppercase  text-neutral-900 sm:text-3xl">
            Shop by Category
          </h2>
        </div>

        {loading ? (
          <SkeletonGrid />
        ) : categories.length === 0 ? (
          <p className="text-neutral-400 text-sm">No categories found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
