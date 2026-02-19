import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white sm:min-h-[640px]">
      <div className="absolute inset-0">
        <Image
          src="/hero2.png"
          alt="Athlete posing confidently in activewear"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10" aria-hidden />
      </div>

      <div className="relative mx-auto flex h-full max-w-[1100px] items-center px-6 py-20 sm:px-10 lg:px-16">
        <div className="max-w-xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.5em] text-white/80">
            Sculpted Support
          </p>
          <h1 className="text-4xl font-bold uppercase leading-tight sm:text-5xl md:text-6xl">
            Confidence, <span className="text-[#cc071e]">seamlessly</span> built
          </h1>
          <p className="max-w-lg text-base text-white/80 sm:text-lg">
            Premium gym wear designed for the elite athlete. Built for maximum strength, durability, and intense movement.
          </p>
          <div className="pt-4">
            <button
              type="button"
              className="inline-flex items-center rounded-1xl text-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-neutral-900 transition-colors
               bg-[#cc071e] hover:bg-white/90 hover:text-black cursor-pointer" 
            >
             Explore Collection
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
