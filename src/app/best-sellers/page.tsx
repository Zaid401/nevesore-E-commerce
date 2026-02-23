"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import Link from "next/link";

const bestSellers = [
  {
    id: "best-1",
    name: "POWERLIFT TRAINING SHOES",
    price: 120.0,
    image: "/images/categories/bottom.png",
    category: "FOOTWEAR",
  },
  {
    id: "best-2",
    name: "CORE COMPRESSION TEE",
    price: 55.0,
    image: "/images/categories/active.png",
    category: "APPAREL",
  },
  {
    id: "best-3",
    name: "ELITE TRAINING SHORTS",
    price: 45.0,
    image: "/images/categories/bottom.png",
    category: "APPAREL",
  },
  {
    id: "best-4",
    name: "AERO WINDBREAKER",
    price: 120.0,
    image: "/images/categories/upper.png",
    category: "OUTERWEAR",
  },
  {
    id: "best-5",
    name: "TRAINING JOGGERS",
    price: 79.0,
    image: "/images/categories/bottom.png",
    category: "APPAREL",
  },
  {
    id: "best-6",
    name: "PERFORMANCE TANK",
    price: 39.0,
    image: "/images/categories/upper.png",
    category: "APPAREL",
  },
  {
    id: "best-7",
    name: "ENDURANCE LEGGINGS",
    price: 84.0,
    image: "/images/categories/bottom.png",
    category: "TRAINING",
  },
  {
    id: "best-8",
    name: "FLEX ZIP HOODIE",
    price: 95.0,
    image: "/images/categories/upper.png",
    category: "OUTERWEAR",
  },
];

export default function BestSellersPage() {
  return (
    <main className="bg-neutral-50 min-h-screen text-neutral-900">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mb-12">
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-600 hover:text-neutral-900 transition-colors sm:text-sm"
          >
            ← Back to Home
          </Link>
          <h1 className="mt-5 text-2xl font-extrabold uppercase tracking-[0.2em] text-neutral-900 sm:mt-6 sm:text-3xl lg:text-4xl">
            Best Seller Collection
          </h1>
          <div className="mt-3 h-[2px] w-20 bg-gradient-to-r from-[#cc071e] to-transparent"></div>
          <p className="mt-3 text-sm text-neutral-600 sm:mt-4 sm:text-base lg:text-lg">
            Shop the most-loved pieces picked by our community.
          </p>
        </div>

        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
          <p className="text-xs font-medium text-neutral-600 sm:text-sm">
            Showing {bestSellers.length} products
          </p>
          <div className="flex gap-3">
            <select className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#cc071e] sm:px-4 sm:text-sm">
              <option>Sort by Best Sellers</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {bestSellers.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-neutral-200 bg-white p-6 text-center sm:p-8 lg:p-10">
              <p className="text-sm font-semibold text-neutral-900 sm:text-base lg:text-lg">
                No best sellers yet
              </p>
              <p className="mt-2 text-xs text-neutral-600 sm:text-sm lg:text-base">
                Check back soon for the most-loved picks from our community.
              </p>
            </div>
          ) : (
            bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                category={product.category}
              />
            ))
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
