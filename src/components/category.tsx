import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Tops",
    href: "/upper",
    image: "/images/categories/top.png",
  },
  {
    name: "Bottoms",
    href: "/bottom",
    image: "/images/categories/bottom.png",
  },
  {
    name: "Activewear",
    href: "/active",
    image: "/images/categories/active.png",
  },
];

export default function CategoryGrid() {
  return (
    <section className="bg-white py-12 text-neutral-900 sm:py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:gap-8 sm:px-6 lg:px-14">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-neutral-900 sm:text-2xl">
            Shop by Category
          </h2>
        </div>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-[8px] border border-neutral-200 bg-neutral-50 shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)]"
            >
              <div className="absolute inset-0">
                <Image
                  src={category.image}
                  alt={`${category.name} category visual`}
                  fill
                  className="object-cover opacity-90 transition-opacity duration-200 group-hover:opacity-100"
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-neutral-900/20 to-transparent" aria-hidden />
              </div>
              <div className="relative flex h-full flex-col justify-between p-4 sm:p-6 lg:p-8">
                <div className="flex-1" />
                <div className="flex flex-col">
                  <span className="text-base font-bold uppercase tracking-[0.3em] text-white sm:text-lg">
                    {category.name}
                  </span>
                  <div className="mt-3 h-[6px] w-12 rounded-full bg-red-600 transition-transform duration-200 group-hover:translate-x-2 sm:w-16" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
