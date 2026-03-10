import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden text-white">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/finalHeroImage.jpeg"
          alt="Athlete posing confidently in activewear"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center md:object-right"
        />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex h-full max-w-[1100px] items-center px-6 pt-[250px] pb-20 sm:px-10 sm:py-20 lg:px-16">
        <div className="max-w-xl space-y-6">
         

          <h1 className="text-4xl text-gray-700 font-bold uppercase leading-tight sm:text-5xl md:text-6xl">
            <span className="block sm:hidden">The most<br />Defining,</span>
            <span className="hidden sm:inline whitespace-nowrap">The most Defining,</span>
            <span className="block text-[#cc071e]">Compression</span>
            <span className="block">Tee Yet.</span>
          </h1>

          <p className="max-w-lg text-base text-gray-700 sm:text-lg">
            A tee that makes every lift feel superhuman.  
          </p>

          <div className="pt-4">
            <Link
              href="/best-sellers"
              className="inline-flex flex-col text-white text-sm font-semibold uppercase tracking-wide group "
            >
              <span className="text-gray-700">Explore Collection</span>
              <span className="mt-1 h-0.5 w-full bg-black transition-all duration-200 group-hover:w-11/12" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}