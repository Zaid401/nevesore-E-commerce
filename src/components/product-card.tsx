import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function ProductCard({ id, name, price, image, category }: ProductCardProps) {
  return (
    <Link
      href={`/products/${id}`}
      className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
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
        <p className="mt-2 text-base font-bold text-red-600">${price.toFixed(2)}</p>
      </div>
      <button
        type="button"
        className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white opacity-0 transition-all duration-200 group-hover:opacity-100"
        aria-label="Add to cart"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
          <path
            fill="currentColor"
            d="M7 4h-2l-1 2v2h2l3 9h9l3-11H8.42zM10 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0m8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
          />
        </svg>
      </button>
    </Link>
  );
}
