"use client";

import Link from "next/link";
import ProductCard from "./product-card";

const bestSellerProducts = [
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
];

export default function BestSellerProducts() {
  return (
    <section className="bg-white py-12 text-neutral-900 sm:py-16 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:gap-8 sm:px-6 lg:px-8">
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-neutral-900 sm:text-2xl">
              Best Seller Collection
            </h2>
            <div className="mt-2 h-[2px] w-16 bg-gradient-to-r from-[#cc071e] to-transparent sm:w-20"></div>
          </div>
          <Link
            href="/best-sellers"
            className="whitespace-nowrap px-3 py-2 sm:px-6 border-2 border-neutral-900 font-bold uppercase tracking-[0.15em] text-xs sm:text-base text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-200"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellerProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              category={product.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
