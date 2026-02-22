"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";

const categories = [
  {
    name: "Tops",
    label: "Upper Body",
    href: "/upper",
    image: "/images/categories/top.png",
    description: "Tees, tanks & compression tops",
    count: "12+ styles",
  },
  {
    name: "Bottoms",
    label: "Lower Body",
    href: "/bottom",
    image: "/images/categories/bottom.png",
    description: "Shorts, joggers & leggings",
    count: "10+ styles",
  },
  {
    name: "Activewear",
    label: "Performance Sets",
    href: "/active",
    image: "/images/categories/active.png",
    description: "Full training sets & combos",
    count: "8+ styles",
  },
  {
    name: "Casual",
    label: "Everyday Wear",
    href: "/casual",
    image: "/images/categories/active.png",
    description: "Hoodies, sweats & off-day fits",
    count: "9+ styles",
  },
];

export default function CategoryGrid() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isDraggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragStartIndex = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, categories.length - 1)));
  }, []);

  const prev = () => goTo(activeIndex - 1);
  const next = () => goTo(activeIndex + 1);

  // Auto-advance every 4s
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % categories.length);
    }, 4000);
    return () => clearInterval(id);
  }, [activeIndex]);

  // Pointer drag support
  const onPointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    dragStartX.current = e.clientX;
    dragStartIndex.current = activeIndex;
    trackRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const delta = dragStartX.current - e.clientX;
    if (Math.abs(delta) > 40) {
      isDraggingRef.current = true;
      goTo(dragStartIndex.current + (delta > 0 ? 1 : -1));
    }
  };

  return (
    <section className="bg-white py-16 text-neutral-900 sm:py-20 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600 mb-2">
              Collections
            </p>
            <h2 className="text-2xl font-black uppercase tracking-[0.15em] text-neutral-900 sm:text-3xl">
              Shop by Category
            </h2>
          </div>
          {/* Arrow buttons â€” desktop only */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={prev}
              disabled={activeIndex === 0}
              aria-label="Previous category"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-all hover:border-red-600 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={next}
              disabled={activeIndex === categories.length - 1}
              aria-label="Next category"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-all hover:border-red-600 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel track */}
        <div
          ref={trackRef}
          className="relative cursor-grab active:cursor-grabbing select-none"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] gap-4"
            style={{ transform: `translateX(calc(-${activeIndex * 100}% - ${activeIndex * 16}px))` }}
          >
            {categories.map((category, i) => (
              <Link
                key={category.name}
                href={category.href}
                onClick={(e) => isDraggingRef.current && e.preventDefault()}
                className="group relative flex-shrink-0 w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
                style={{ aspectRatio: "4/5" }}
                tabIndex={i === activeIndex ? 0 : -1}
              >
                {/* Image */}
                <div className="absolute inset-0">
                  <Image
                    src={category.image}
                    alt={`${category.name} category`}
                    fill
                    className="object-cover opacity-90 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-neutral-950/75 via-neutral-900/20 to-transparent" />
                </div>

                {/* Count badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-900 backdrop-blur-sm">
                    {category.count}
                  </span>
                </div>

                {/* Content */}
                <div className="relative flex h-full flex-col justify-end p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-red-400 mb-1">
                    {category.label}
                  </p>
                  <h3 className="text-xl font-black uppercase tracking-[0.2em] text-white">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-300">
                    {category.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                      Shop Now
                    </span>
                    <div className="h-px w-8 bg-red-500 transition-all duration-300 group-hover:w-14" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Dots + mobile arrows */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={prev}
            disabled={activeIndex === 0}
            aria-label="Previous"
            className="sm:hidden flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 disabled:opacity-30"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {categories.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  i === activeIndex
                    ? "w-6 h-2 bg-red-600"
                    : "w-2 h-2 bg-neutral-300 hover:bg-neutral-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={activeIndex === categories.length - 1}
            aria-label="Next"
            className="sm:hidden flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 disabled:opacity-30"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
