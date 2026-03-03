import Image from "next/image";

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
      <div className="relative mx-auto flex h-full max-w-[1100px] items-center px-6 py-20 sm:px-10 lg:px-16">
        <div className="max-w-xl space-y-6">
         

          <h1 className="text-4xl text-gray-700 font-bold uppercase leading-tight sm:text-5xl md:text-6xl">
            Confidence,{" "}
            <span className="text-[#cc071e]">seamlessly</span> built
          </h1>

          <p className="max-w-lg text-base text-gray-700 sm:text-lg">
            Premium gym wear designed for the elite athlete. Built for maximum
            strength, durability, and intense movement.
          </p>

          <div className="pt-4">
            <button
              type="button"
              className="inline-flex items-center rounded text-white px-8 py-3 text-sm
              font-semibold uppercase transition-colors
              bg-[#cc071e] border-2 border-transparent
              hover:bg-transparent hover:border-[#cc071e]
              hover:text-gray-700 cursor-pointer"
            >
              <a href="/best-sellers"> 
              Explore Collection
              
              </a>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}