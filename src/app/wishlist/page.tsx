"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useWishlist } from "@/context/wishlist-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleMoveAllToCart = () => {
    // Move all wishlist items to cart functionality
    // This would typically integrate with your cart context
    console.log("Move all items to cart");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="mx-auto h-16 w-16 text-gray-300 sm:h-20 sm:w-20 lg:h-24 lg:w-24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>

            <h1 className="mt-4 text-xl font-bold uppercase tracking-[0.2em] text-slate-900 sm:mt-6 sm:text-2xl lg:mt-8 lg:text-3xl xl:text-4xl">
              Your Wishlist is Empty
            </h1>
            
            <p className="mt-2 text-xs text-gray-600 sm:mt-3 sm:text-sm lg:mt-4 lg:text-base">
              Start adding your favorite products to your wishlist
            </p>

            <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:gap-3 lg:mt-8">
              <Link
                href="/"
                className="bg-slate-900 px-6 py-2 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-slate-800 sm:px-8 sm:py-3 sm:text-sm lg:px-8 lg:py-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-12 lg:px-8 lg:py-12">
        {/* Header Section */}
        <div className="mb-8 flex flex-col justify-between gap-3 sm:mb-10 sm:gap-4 lg:mb-12 lg:flex-row lg:items-center">
          <div>
            <Link
              href="/"
              className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 hover:text-gray-900"
            >
              Home /
            </Link>
            <h1 className="mt-1 text-xl font-extrabold uppercase tracking-[0.2em] text-slate-900 sm:mt-2 sm:text-2xl lg:mt-2 lg:text-4xl">
              My Wishlist
            </h1>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-red-600 sm:text-sm lg:text-sm">
              {items.length} Premium Items Saved
            </p>
          </div>
          <button
            onClick={handleMoveAllToCart}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-slate-800 sm:w-auto sm:px-6 sm:py-3 sm:text-sm lg:px-6 lg:py-3 lg:text-base"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5" fill="currentColor">
              <path d="M7 4h-2l-1 2v2h2l3 9h9l3-11H8.42zM10 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0m8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
            </svg>
            Move All to Bag
          </button>
        </div>

        {/* Success Message */}

        {/* Items Count */}
        {items.length > 2 && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <p className="text-sm font-medium text-[#555555]">
              {items.length} items in your wishlist
            </p>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
            >
              {/* Image Container */}
              <div className="relative aspect-3/4 overflow-hidden bg-gray-50">
                <Link href={`/products/${item.id}`}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                </Link>

                {/* Heart Icon Badge - Top Right */}
                <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 shadow-md">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
                  {item.category}
                </p>

                <Link href={`/products/${item.id}`}>
                  <h3 className="mt-1 line-clamp-2 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-900 hover:text-red-600">
                    {item.name}
                  </h3>
                </Link>

                <div className="mt-2 flex items-center gap-2">
                  <p className="text-base font-bold text-red-600">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>
                </div>

                {/* View Product Button */}
                <Link
                  href={`/products/${item.id}`}
                  className="mt-3 block w-full rounded-lg bg-slate-900 py-3 text-center text-xs font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:bg-slate-800"
                >
                  Select Size &amp; Add to Cart
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
