"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useWishlist } from "@/context/wishlist-context";
import Navbar from "@/components/navbar";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemoveItem = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      removeItem(id);
      setRemovingId(null);
    }, 300);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f8f8]">
        <Navbar />
        
        {/* Empty Wishlist Section */}
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-14">
          <div className="rounded-[20px] bg-white p-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)] sm:p-12">
            <div className="mx-auto max-w-2xl text-center">
              {/* Empty Heart Icon */}
              <div className="mb-8 flex justify-center">
                <div className="inline-block rounded-full bg-[#f1f1f1] p-8">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-20 w-20 text-[#e5e5e5]"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    />
                  </svg>
                </div>
              </div>

              <h1 className="text-3xl font-bold uppercase tracking-[0.2em] text-[#111111] sm:text-4xl">
                Your Wishlist is Empty
              </h1>
              
              <p className="mt-3 text-lg text-[#555555]">
                Start building your collection of favorite gym outfits
              </p>

              <p className="mt-5 text-base text-[#777]">
                Hover over any product and click the heart icon to save items you love. Build your perfect wishlist and move everything to cart with one click!
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/"
                  className="rounded-full bg-[#cc071e] px-8 py-4 font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:shadow-[0_8px_16px_rgba(204,7,30,0.3)] hover:bg-red-700"
                >
                  Start Shopping
                </Link>
                <Link
                  href="/upper"
                  className="rounded-full border-2 border-[#cc071e] px-8 py-3 font-semibold uppercase tracking-[0.1em] text-[#cc071e] transition-all duration-300 hover:bg-[#cc071e] hover:text-white"
                >
                  Browse Collections
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Collections Section */}
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-14">
          <div className="mb-12">
            <h2 className="text-2xl font-bold uppercase tracking-[0.2em] text-[#111111]">
              Explore Our Collections
            </h2>
            <p className="mt-2 text-[#555555]">
              Discover premium gym wear and start curating your wishlist
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Upper Body", href: "/upper", icon: "👕" },
              { label: "Bottom Wear", href: "/bottom", icon: "👖" },
              { label: "Active Wear", href: "/active", icon: "⚡" },
              { label: "Casual Wear", href: "/casual", icon: "👟" },
            ].map((collection) => (
              <Link
                key={collection.label}
                href={collection.href}
                className="group rounded-[16px] border border-[#e5e5e5] bg-white p-8 text-center transition-all duration-300 hover:border-[#cc071e] hover:shadow-[0_8px_24px_rgba(204,7,30,0.15)]"
              >
                <div className="mb-4 text-5xl">{collection.icon}</div>
                <h3 className="font-bold uppercase tracking-[0.1em] text-[#111111] transition-colors group-hover:text-[#cc071e]">
                  {collection.label}
                </h3>
                <p className="mt-2 text-sm text-[#555555]">
                  Explore & Save to Wishlist
                </p>
                <div className="mt-4 inline-block rounded-full border border-[#cc071e] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#cc071e] transition-all group-hover:bg-[#cc071e] group-hover:text-white">
                  Browse →
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-14">
          <div className="rounded-[20px] bg-[#f1f1f1] p-8 sm:p-12">
            <h3 className="text-xl font-bold uppercase tracking-[0.2em] text-[#111111]">
              💡 How to Use Your Wishlist
            </h3>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#cc071e] text-2xl font-bold text-white">
                  1
                </div>
                <h4 className="font-bold text-[#111111]">Hover & Click</h4>
                <p className="mt-2 text-sm text-[#555555]">
                  Hover over any product and click the heart icon to add it to your wishlist
                </p>
              </div>
              <div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#cc071e] text-2xl font-bold text-white">
                  2
                </div>
                <h4 className="font-bold text-[#111111]">Save for Later</h4>
                <p className="mt-2 text-sm text-[#555555]">
                  Your wishlist saves automatically and you can access it anytime
                </p>
              </div>
              <div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#cc071e] text-2xl font-bold text-white">
                  3
                </div>
                <h4 className="font-bold text-[#111111]">Checkout Fast</h4>
                <p className="mt-2 text-sm text-[#555555]">
                  Move all items to cart with one click or add individually
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto max-w-7xl px-6 py-16 text-center sm:px-10 lg:px-14">
          <div className="rounded-[20px] bg-[#111111] p-10 sm:p-16">
            <h2 className="text-2xl font-bold uppercase tracking-[0.2em] text-white sm:text-3xl">
              Ready to Find Your Perfect Gym Look?
            </h2>
            <p className="mt-4 text-[#ddd]">
              Explore our premium collection and start building your wishlist today
            </p>
            <Link
              href="/"
              className="mt-8 inline-block rounded-full bg-[#cc071e] px-8 py-4 font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:shadow-[0_8px_16px_rgba(204,7,30,0.5)] hover:bg-red-700"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-14">
        {/* Header Section */}
        <div className="mb-12 opacity-0 animate-fade-in">
          <h1 className="text-3xl font-bold uppercase tracking-[0.2em] text-[#111111] sm:text-4xl">
            My Wishlist
          </h1>
          <p className="mt-2 text-base text-[#555555]">
            Save your favorite items for later.
          </p>
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
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`group overflow-hidden rounded-[16px] border border-[#e5e5e5] bg-white transition-all duration-500 opacity-0 animate-fade-in hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)] hover:-translate-y-1 ${
                removingId === item.id ? "opacity-0" : "opacity-100"
              }`}
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              {/* Image Container */}
              <div className="relative block overflow-hidden bg-[#f1f1f1]">
                <Link href={`/products/${item.id}`} className="relative block aspect-3/4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  />
                </Link>

                {/* Heart Icon - Top Right */}
                <div className="absolute right-3 top-3">
                  <div className="inline-block rounded-full bg-white/90 p-2 backdrop-blur-sm">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-5 w-5 text-[#cc071e] animate-heart-beat"
                    >
                      <path
                        fill="currentColor"
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Remove Button - Top Left */}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="group/btn absolute left-3 top-3 inline-flex items-center justify-center rounded-full bg-white/90 p-2 backdrop-blur-sm transition-all duration-300 hover:bg-[#cc071e]/90"
                  aria-label="Remove from wishlist"
                  title="Remove from wishlist"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-5 w-5 text-neutral-700 transition-colors group-hover/btn:text-white"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      d="M19 6.4L5.4 20M5 6.4L18.6 20"
                    />
                  </svg>
                </button>

                {/* Stock Status Badge */}
                <div className="absolute bottom-3 left-3">
                  <span className="inline-block rounded-full bg-green-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    In Stock
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#555555]">
                  {item.category}
                </p>

                <Link href={`/products/${item.id}`} className="block">
                  <h3 className="mt-2 line-clamp-2 text-sm font-bold uppercase tracking-[0.15em] text-[#111111] transition-colors duration-300 group-hover:text-[#cc071e]">
                    {item.name}
                  </h3>
                </Link>

                <p className="mt-3 text-lg font-bold text-[#cc071e]">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>

                {/* View Product Button */}
                <Link
                  href={`/products/${item.id}`}
                  className="mt-4 block w-full rounded-full bg-[#cc071e] py-3 text-center font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:shadow-[0_8px_16px_rgba(204,7,30,0.3)] hover:bg-red-700"
                >
                  Select Size &amp; Add to Cart
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping Link */}
        <div className="mt-12 flex justify-center opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Link
            href="/"
            className="rounded-full border-2 border-[#111111] px-8 py-3 font-semibold uppercase tracking-[0.1em] text-[#111111] transition-all duration-300 hover:bg-[#111111] hover:text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heartBeat {
          0%,
          100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.1);
          }
          50% {
            transform: scale(1.2);
          }
          75% {
            transform: scale(1.1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-heart-beat {
          animation: heartBeat 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
