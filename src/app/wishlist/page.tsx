"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    setRemovingId(id);
    removeItem(id);
  };

  /* ── EMPTY STATE ── */
  if (items.length === 0) {
    return (
      <div className="bg-[#faf9f7] text-[#111111] min-h-screen">
        <Navbar />

        <main>
          {/* Hero */}
          <section className="relative overflow-hidden border-b border-[#e0ddd8] pt-24 md:pt-28">
            <span
              className="pointer-events-none select-none absolute bottom-[-0.15em] right-[-0.04em] text-transparent font-black leading-none tracking-wide hidden sm:block"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(80px, 16vw, 240px)",
                WebkitTextStroke: "1.5px #e8e5e0",
              }}
            >
              WISHLIST
            </span>
            <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pb-14 md:pb-16">
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-[10px] font-medium tracking-[0.22em] uppercase rounded-full px-3.5 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Saved Items
              </div>
              <h1
                className="leading-[0.92] tracking-wide text-[#111111] mb-4"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 9vw, 100px)" }}
              >
                My Wishlist
              </h1>
            </div>
          </section>

          {/* Empty card */}
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
            <div className="rounded-2xl border border-[#e0ddd8] bg-white overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <div className="bg-[#111111] px-6 py-3.5 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-auto text-[11px] tracking-[0.18em] uppercase text-white/30">Empty</span>
              </div>
              <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                {/* Heart icon */}
                <div className="w-16 h-16 rounded-full border border-[#e0ddd8] bg-[#faf9f7] flex items-center justify-center mb-6">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-red-300" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <p
                  className="text-[#111111] mb-2 leading-tight"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px,4vw,42px)", letterSpacing: "0.04em" }}
                >
                  Your Wishlist is Empty
                </p>
                <p className="text-sm font-light text-[#888888] mb-8 max-w-xs">
                  Start adding your favourite products to your wishlist and find them here later.
                </p>
                <Link
                  href="/"
                  className="group inline-flex items-center gap-2.5 bg-gray-900 hover:bg-gray-700 text-white text-[11px] font-medium tracking-[0.15em] uppercase rounded-full px-7 py-3.5 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Continue Shopping
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  /* ── FILLED STATE ── */
  return (
    <div className="bg-[#faf9f7] text-[#111111] min-h-screen">
      <Navbar />

      <main>
        {/* ── HERO ── */}
        <section className="relative overflow-hidden border-b border-[#e0ddd8] pt-24 md:pt-28">
          <span
            className="pointer-events-none select-none absolute bottom-[-0.15em] right-[-0.04em] text-transparent font-black leading-none tracking-wide hidden sm:block"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(80px, 16vw, 240px)",
              WebkitTextStroke: "1.5px #e8e5e0",
            }}
          >
            WISHLIST
          </span>

          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pb-14 md:pb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-[10px] font-medium tracking-[0.22em] uppercase rounded-full px-3.5 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Saved Items
              </div>
              <h1
                className="leading-[0.92] tracking-wide text-[#111111] mb-4"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 9vw, 100px)" }}
              >
                My Wishlist
              </h1>
              <p className="text-base font-light text-[#444444]">
                Products you love, saved in one place.
              </p>
            </div>

            {/* Right stat */}
            <div className="md:text-right flex-shrink-0 pb-1 space-y-2">
              <p
                className="leading-none text-[#111111] tracking-wide"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 6vw, 64px)" }}
              >
                {items.length}
              </p>
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#888888]">
                {items.length === 1 ? "Item Saved" : "Items Saved"}
              </p>
            </div>
          </div>
        </section>

        {/* ── GRID ── */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 md:py-14">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link href="/" className="text-[11px] tracking-[0.15em] uppercase text-[#888888] hover:text-red-600 transition-colors">
              Home
            </Link>
            <span className="text-[#cccccc] text-xs">·</span>
            <span className="text-[11px] tracking-[0.15em] uppercase text-[#111111]">Wishlist</span>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {items.map((item) => (
              <article
                key={item.id}
                className="group relative rounded-2xl border border-[#e0ddd8] bg-white hover:border-red-200 hover:shadow-[0_8px_32px_rgba(212,0,31,0.06)] transition-all duration-300 overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] bg-[#f0edea] overflow-hidden">
                  <Link href={`/products/${item.id}`}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  {/* Remove (heart) button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    aria-label="Remove from wishlist"
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white border border-[#e0ddd8] flex items-center justify-center shadow-sm transition-all duration-200 hover:border-red-300 hover:shadow-md ${
                      removingId === item.id ? "opacity-50 scale-90" : ""
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-red-500" fill="currentColor">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>

                  {/* Category pill */}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[9px] font-medium tracking-[0.2em] uppercase bg-white/90 border border-[#e0ddd8] text-[#888888] rounded-full px-2.5 py-1">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <Link href={`/products/${item.id}`}>
                    <h3
                      className="text-[#111111] leading-tight truncate mb-1 hover:text-red-600 transition-colors duration-150"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "clamp(14px, 2vw, 17px)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {item.name}
                    </h3>
                  </Link>

                  <p className="text-sm font-medium text-red-600 mb-3">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>

                  {/* CTA */}
                  <Link
                    href={`/products/${item.id}`}
                    className="group/btn flex items-center justify-center gap-2 w-full bg-[#111111] hover:bg-gray-900 text-white text-[10px] font-medium tracking-[0.15em] uppercase rounded-full py-2.5 transition-all duration-200"
                  >
                    View Product
                    <span className="transition-transform duration-200 group-hover/btn:translate-x-1">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom CTA strip */}
          <div className="mt-12 rounded-2xl border border-[#e0ddd8] bg-white overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="bg-[#111111] px-6 py-3.5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-auto text-[11px] tracking-[0.18em] uppercase text-white/30">
                Keep Exploring
              </span>
            </div>
            <div className="px-6 sm:px-8 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div>
                <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#888888] mb-1">
                  More to discover
                </p>
                <p
                  className="text-[#111111] leading-tight"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(22px,3vw,30px)", letterSpacing: "0.04em" }}
                >
                  Find Your Next <span className="text-red-600">Drop</span>
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Link
                  href="/"
                  className="group inline-flex items-center gap-2.5 bg-gray-900 hover:bg-gray-700 text-white text-[11px] font-medium tracking-[0.15em] uppercase rounded-full px-6 py-3 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Browse All
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-2.5 border border-[#e0ddd8] hover:border-red-200 text-[#888888] hover:text-red-600 text-[11px] font-medium tracking-[0.15em] uppercase rounded-full px-6 py-3 transition-all duration-200"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}