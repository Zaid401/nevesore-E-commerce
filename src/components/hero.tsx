import Image from "next/image";
import Link from "next/link";
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden text-white">
      {/* Background Image */}
      <div className="absolute inset-0">
        {/* Desktop / tablet hero */}
        <Image
          src="/real_Hero.PNG"
          alt="Athlete posing confidently in activewear"
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-center md:object-[65%_30%] sm:block"
        />

        {/* Mobile hero */}
        <Image
          src="/new-mobile-image.PNG"
          alt="Model showcasing the seamless tee"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_20%] sm:hidden"
        />
      </div>

       {/* Gradient Overlay - desktop */}
      <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-black/50 via-black/30 to-transparent" />

      {/* Gradient Overlay - mobile: dark at bottom so text is readable */}
      <div className="absolute inset-0 sm:hidden bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
      {/* <div className="absolute inset-0 sm:hidden bg-gradient-to-t from-black/85 via-black/40 to-black/10" /> */}

      {/* Content */}
      <div className="relative mx-auto flex h-full max-w-[1100px] items-center px-6 pt-[250px] pb-20 sm:px-10 sm:py-20 lg:px-16 italic">
        <div className="max-w-xl space-y-5 sm:space-y-6">
          <h1 className="text-3xl font-bold uppercase leading-snug text-white sm:text-5xl sm:leading-tight md:text-6xl">
            <span className="block whitespace-nowrap sm:inline">
              The Most Defining,
            </span>
            <span className="inline-flex flex-wrap items-baseline gap-2 ">
              <span
                className={`${greatVibes.className} normal-case text-4xl leading-none sm:text-5xl md:text-6xl`}
              >
                Seamless
              </span>
              <span className="text-2xl font-semibold  sm:text-3xl">
                TEE
              </span>
            </span>
            <span className="block">
              Yet.
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