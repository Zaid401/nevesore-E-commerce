"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import Link from "next/link";

const allFeaturedProducts = [
  {
    id: "active-1",
    name: "APEX COMPRESSION TEE",
    price: 68.0,
    image: "/images/categories/active.png",
    category: "PERFORMANCE CORE",
  },
  {
    id: "active-2",
    name: "ELITE PERFORMANCE SHORTS",
    price: 54.99,
    image: "/images/categories/bottom.png",
    category: "PERFORMANCE CORE",
  },
  {
    id: "active-3",
    name: "ULTRA COMFORT HOODIE",
    price: 89.99,
    image: "/images/categories/upper.png",
    category: "CASUAL WEAR",
  },
  {
    id: "casual-1",
    name: "FLEX TRAINING PANTS",
    price: 72.99,
    image: "/images/categories/bottom.png",
    category: "TRAINING",
  },
  {
    id: "casual-2",
    name: "BREATHABLE SPORTS BRA",
    price: 64.99,
    image: "/images/categories/active.png",
    category: "PERFORMANCE CORE",
  },
  {
    id: "casual-3",
    name: "PREMIUM JOGGERS",
    price: 79.99,
    image: "/images/categories/bottom.png",
    category: "CASUAL WEAR",
  },
  {
    id: "casual-4",
    name: "MOISTURE WICKING TANK",
    price: 45.99,
    image: "/images/categories/upper.png",
    category: "PERFORMANCE CORE",
  },
  {
    id: "casual-5",
    name: "PERFORMANCE LEGGINGS",
    price: 84.99,
    image: "/images/categories/bottom.png",
    category: "TRAINING",
  },
];

export default function FeaturedProductsPage() {
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
          <div className="mt-3 h-[2px] w-20 bg-gradient-to-r from-[#cc071e] to-transparent"></div>
          <p className="mt-3 text-sm text-neutral-600 sm:mt-4 sm:text-base lg:text-lg">
            Explore our curated selection of premium products designed for performance and style.
          </p>
        </div>

        {/* Filter/Sort Section (Optional) */}
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
          <p className="text-xs font-medium text-neutral-600 sm:text-sm">
            Showing {allFeaturedProducts.length} products
          </p>
          <div className="flex gap-3">
            <select className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#cc071e] sm:px-4 sm:text-sm">
              <option>Sort by Latest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Most Popular</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6 mb-10 sm:mb-12 lg:mb-16">
          {allFeaturedProducts.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-neutral-200 bg-white p-6 text-center sm:p-8 lg:p-10">
              <p className="text-sm font-semibold text-neutral-900 sm:text-base lg:text-lg">
                No featured products yet
              </p>
              <p className="mt-2 text-xs text-neutral-600 sm:text-sm lg:text-base">
                Check back soon for the latest curated drops.
              </p>
            </div>
          ) : (
            allFeaturedProducts.map((product) => (
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

        {/* CTA Section */}
        <div className="rounded-2xl bg-gradient-to-r from-[#cc071e] to-red-700 p-6 text-center text-white sm:p-10 lg:p-16">
          <h2 className="text-xl font-bold uppercase tracking-[0.2em] sm:text-2xl">
            Find Your Perfect Fit
          </h2>
          <p className="mt-3 text-xs sm:mt-4 sm:text-sm lg:text-base">
            Can't find what you're looking for? Explore all our collections or contact our support team.
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
