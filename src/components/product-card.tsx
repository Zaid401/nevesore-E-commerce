"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  sale_price?: number | null;
  image: string;
  category: string;
  short_description?: string | null;
}

const FALLBACK_IMAGE = "/product/fallback.png";

export default function ProductCard({ id, name, price, sale_price, image, category, short_description }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(image || FALLBACK_IMAGE);

  const displayPrice = sale_price ?? price;
  const hasDiscount = sale_price != null && sale_price < price;

  return (
    <Link
      href={`/products/${id}`}
      className="group relative overflow-hidden border border-neutral-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
    >
      <div className="relative aspect-3/4 overflow-hidden bg-neutral-100">
        <Image
          src={imgSrc}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </div>
      <div className="p-4">
        <p className="text-xs font-medium uppercase  text-neutral-500">
          {category}
        </p>
        <h3 className="mt-1 text-sm font-semibold uppercase  text-neutral-900">
          {name}
        </h3>
        {short_description && (
          <p className="mt-1 text-xs text-neutral-500 line-clamp-2 leading-relaxed">
            {short_description}
          </p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <p className="text-base font-bold text-[#111111]">₹{displayPrice.toLocaleString("en-IN")}</p>
          {hasDiscount && (
            <p className="text-sm text-neutral-400 line-through">₹{price.toLocaleString("en-IN")}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
