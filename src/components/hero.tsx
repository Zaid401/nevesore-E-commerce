import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden text-white">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/real_Hero.PNG"
          alt="Athlete posing confidently in activewear"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center md:object-[65%_30%]"
        />
      </div>

       {/* Gradient Overlay - desktop */}
      <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

      {/* Gradient Overlay - mobile: dark at bottom so text is readable */}
      <div className="absolute inset-0 sm:hidden bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

      {/* Content */}
      <div className="relative mx-auto flex h-full max-w-[1100px] items-center px-6 pt-[250px] pb-20 sm:px-10 sm:py-20 lg:px-16">
        <div className="max-w-xl space-y-6">
         

           <h1 className="text-4xl font-bold uppercase leading-tight text-white sm:text-5xl md:text-6xl">

            <span className="block sm:hidden">
              The Most<br />Defining,
            </span>

            <span className="hidden sm:inline whitespace-nowrap">
              The Most Defining,
            </span>

            <span className="block text-red-600">
              Compression
            </span>

            <span className="block">
              Tee Yet.
            </span>

          </h1>

          <p className="max-w-lg text-base text-gray-200 sm:text-lg">
            A tee that makes every lift feel superhuman.  
          </p>

          <div className="pt-2 sm:pt-4">
            <Link
              href="/best-sellers"
              className="inline-flex flex-col text-sm font-semibold uppercase tracking-wide group"
            >
              <span className="text-white">
                Explore Collection
              </span>

              <span className="mt-1 h-0.5 w-full bg-white transition-all duration-300 group-hover:w-10/12"></span>

            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}