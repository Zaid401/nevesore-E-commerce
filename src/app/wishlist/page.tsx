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
  const { addItem: addToCart } = useCart();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      category: item.category,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      color: "#000000",
      size: "M",
    });
    
    setSuccessMessage(`${item.name} added to cart!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleMoveAllToCart = () => {
    items.forEach((item) => {
      addToCart({
        id: item.id,
        category: item.category,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        color: "#000000",
        size: "M",
      });
    });
    setSuccessMessage("All items moved to cart!");
    setTimeout(() => setSuccessMessage(null), 3000);
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

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-12 lg:px-8 lg:py-12">
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
        {successMessage && (
          <div className="mb-4 rounded border border-green-200 bg-green-50 px-3 py-2 text-xs font-medium text-green-700 sm:mb-6 sm:px-4 sm:py-3 sm:text-sm lg:mb-6 lg:text-sm">
            ✓ {successMessage}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:gap-6 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden border border-gray-100 bg-white transition hover:shadow-lg"
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
                <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-red-600 sm:right-3 sm:top-3 sm:h-8 sm:w-8 lg:right-3 lg:top-3 lg:h-8 lg:w-8">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5" fill="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-3 sm:p-4 lg:p-4">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400">
                  {item.category}
                </p>

                <Link href={`/products/${item.id}`}>
                  <h3 className="mt-1 line-clamp-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-900 hover:text-red-600 sm:mt-2 sm:text-sm lg:mt-2 lg:text-sm">
                    {item.name}
                  </h3>
                </Link>

                <p className="mt-1 text-sm font-bold text-red-600 sm:mt-2 sm:text-base lg:mt-2 lg:text-base">
                  ${item.price.toFixed(2)}
                </p>

                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-green-600 sm:mt-2 lg:mt-2">
                  In Stock
                </p>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(item)}
                  className="mt-3 w-full bg-red-600 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-red-700 sm:mt-4 sm:py-3 sm:text-sm lg:mt-4 lg:py-3 lg:text-base"
                >
                  Add to Cart
                </button>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="mt-2 w-full border-t border-gray-100 py-2 text-center text-xs font-semibold uppercase tracking-wider text-gray-400 transition hover:text-slate-900 sm:mt-3 lg:mt-3"
                >
                  Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
