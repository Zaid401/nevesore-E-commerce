"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

// Local image fallback by slug (used when image_url is null in DB)
const LOCAL_IMAGES: Record<string, string> = {
  upper: "/images/categories/top.png",
  bottom: "/images/categories/bottom.png",
  active: "/images/categories/active.png",
  casual: "/images/categories/active.png",
};
const DEFAULT_IMAGE = "/images/categories/active.png";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

// ─── Single card ───────────────────────────────────────────────────────────────
function CategoryCard({
  category,
  isDraggingRef,
  tabIndex = 0,
}: {
  category: Category;
  isDraggingRef?: React.MutableRefObject<boolean>;
  tabIndex?: number;
}) {
  const image =
    category.image_url ?? LOCAL_IMAGES[category.slug] ?? DEFAULT_IMAGE;

  return (
    <Link
      href={`/${category.slug}`}
      onClick={(e) => isDraggingRef?.current && e.preventDefault()}
      tabIndex={tabIndex}
      className="group relative flex w-full overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
      style={{ aspectRatio: "4/5" }}
    >
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={`${category.name} category`}
          fill
          className="object-cover opacity-90 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 80vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-neutral-950/75 via-neutral-900/20 to-transparent" />
      </div>

      <div className="relative flex h-full w-full flex-col justify-end p-6">
        <h3 className="text-xl font-black uppercase  text-white">
          {category.name}
        </h3>
        {category.description && (
          <p className="mt-1 text-sm text-neutral-300 line-clamp-2">
            {category.description}
          </p>
        )}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs font-bold uppercase  text-white">
            Shop Now
          </span>
          <div className="h-px w-8 bg-red-500 transition-all duration-300 group-hover:w-14" />
        </div>
      </div>
    </Link>
  );
}

// ─── Static grid (≤ 4 categories — desktop only) ──────────────────────────────
function StaticGrid({ categories }: { categories: Category[] }) {
  const colClass =
    categories.length === 1
      ? "sm:grid-cols-1 sm:max-w-md sm:mx-auto"
      : categories.length === 2
      ? "sm:grid-cols-2"
      : categories.length === 3
      ? "sm:grid-cols-3"
      : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`hidden sm:grid gap-6 ${colClass}`}>
      {categories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} />
      ))}
    </div>
  );
}

// ─── Carousel (always on mobile, >4 on desktop) ────────────────────────────────
const GAP = 16; // px — matches gap-4

function InfiniteCarousel({
  categories,
  mobileOnly = false,
}: {
  categories: Category[];
  mobileOnly?: boolean;
}) {
  const len = categories.length;
  // Triple the array → [clone | real | clone] for seamless looping
  const items = [...categories, ...categories, ...categories];

  const [offset, setOffset] = useState(len); // start in the "real" block
  const [animated, setAnimated] = useState(true);
  // cardWidth in px — measured from the DOM so it works at every breakpoint
  const [cardWidth, setCardWidth] = useState(0);
  const isDraggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Measure the first card whenever the container resizes (handles breakpoints)
  useEffect(() => {
    if (!firstCardRef.current) return;
    const ro = new ResizeObserver(() => {
      if (firstCardRef.current) setCardWidth(firstCardRef.current.offsetWidth);
    });
    ro.observe(firstCardRef.current);
    setCardWidth(firstCardRef.current.offsetWidth);
    return () => ro.disconnect();
  }, []);

  const moveTo = useCallback((idx: number, withAnim = true) => {
    setAnimated(withAnim);
    setOffset(idx);
  }, []);

  const stopAuto = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goNext = useCallback(() => moveTo(offset + 1), [offset, moveTo]);
  const goPrev = useCallback(() => {
    stopAuto();
    moveTo(offset - 1);
  }, [offset, moveTo, stopAuto]);

  // Auto-advance every 3.5 s
  useEffect(() => {
    timerRef.current = setInterval(goNext, 3500);
    return stopAuto;
  }, [goNext, stopAuto]);

  // After each CSS transition, silently snap back to the real block if we are
  // now in one of the clones, so the loop is endless.
  const onTransitionEnd = useCallback(() => {
    if (offset >= len * 2) moveTo(offset - len, false);
    else if (offset < len) moveTo(offset + len, false);
  }, [offset, len, moveTo]);

  // Pointer drag
  const onPointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    dragStartX.current = e.clientX;
    dragStartOffset.current = offset;
    trackRef.current?.setPointerCapture(e.pointerId);
    stopAuto();
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const delta = dragStartX.current - e.clientX;
    if (Math.abs(delta) > 40) {
      isDraggingRef.current = true;
      moveTo(dragStartOffset.current + (delta > 0 ? 1 : -1));
    }
  };

  // Pixel-accurate translation: each step = measured card width + gap
  const translatePx = cardWidth > 0 ? -(offset * (cardWidth + GAP)) : 0;
  const dotIndex = ((offset % len) + len) % len;

  const containerClass = mobileOnly ? "sm:hidden" : "";

  return (
    <div className={containerClass}>
      {/* Track */}
      <div
        ref={trackRef}
        className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div
          className={`flex gap-4 ${
            animated
              ? "transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              : ""
          }`}
          style={{ transform: `translateX(${translatePx}px)` }}
          onTransitionEnd={onTransitionEnd}
        >
          {items.map((cat, i) => (
            <div
              key={`${cat.id}-${i}`}
              ref={i === 0 ? firstCardRef : undefined}
              className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] shrink-0"
            >
              <CategoryCard
                category={cat}
                isDraggingRef={isDraggingRef}
                tabIndex={i === offset ? 0 : -1}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile controls */}
      <div className="mt-6 flex sm:hidden items-center justify-center gap-4">
        <button
          onClick={goPrev}
          aria-label="Previous"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-600"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {categories.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                stopAuto();
                moveTo(len + i);
              }}
              aria-label={`Go to category ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                i === dotIndex
                  ? "w-6 h-2 bg-red-600"
                  : "w-2 h-2 bg-neutral-300 hover:bg-neutral-400"
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          aria-label="Next"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-600"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Desktop controls (only shown when not mobileOnly) */}
      {!mobileOnly && (
        <div className="hidden sm:flex justify-center gap-3 mt-6">
          <button
            onClick={goPrev}
            aria-label="Previous category"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-all hover:border-red-600 hover:text-red-600"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={goNext}
            aria-label="Next category"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-all hover:border-red-600 hover:text-red-600"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Skeleton placeholder ──────────────────────────────────────────────────────
function SkeletonGrid() {
  return (
    <>
      {/* Mobile skeleton - single card */}
      <div className="sm:hidden">
        <div
          className="rounded-2xl bg-neutral-100 animate-pulse"
          style={{ aspectRatio: "4/5" }}
        />
      </div>
      {/* Desktop skeleton - grid */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-neutral-100 animate-pulse"
            style={{ aspectRatio: "4/5" }}
          />
        ))}
      </div>
    </>
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

  const hasMany = categories.length > 4;

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
        ) : hasMany ? (
          // > 4 categories: carousel on all screens
          <InfiniteCarousel categories={categories} />
        ) : (
          // ≤ 4 categories: carousel on mobile, static grid on desktop
          <>
            <InfiniteCarousel categories={categories} mobileOnly />
            <StaticGrid categories={categories} />
          </>
        )}
      </div>
    </section>
  );
}
