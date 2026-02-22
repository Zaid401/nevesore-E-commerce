"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useWishlist } from "@/context/wishlist-context";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  sale_price?: number | null;
  image: string;
  category: string;
}

export default function ProductCard({ id, name, price, sale_price, image, category }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, addItem } = useWishlist();
  const isFavorited = isInWishlist(id);

  const displayPrice = sale_price ?? price;
  const hasDiscount = sale_price != null && sale_price < price;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price: displayPrice, image, category });
  };

  return (
    <Link
      href={`/products/${id}`}
      className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-3/4 overflow-hidden bg-neutral-100">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </div>
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
          {category}
        </p>
        <h3 className="mt-1 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-900">
          {name}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <p className="text-base font-bold text-red-600">₹{displayPrice.toLocaleString("en-IN")}</p>
          {hasDiscount && (
            <p className="text-sm text-neutral-400 line-through">₹{price.toLocaleString("en-IN")}</p>
          )}
        </div>
      </div>
      {isHovered ? (
        <button
          type="button"
          onClick={handleWishlistClick}
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white opacity-100 transition-all duration-200"
          aria-label="Add to wishlist"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
            <path
              fill={isFavorited ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            />
          </svg>
        </button>
      ) : null}
    </Link>
  );
}
