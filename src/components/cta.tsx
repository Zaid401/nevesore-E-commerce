import Link from "next/link";
import { Inter, Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export default function CallToAction() {
  return (
    <section className="relative overflow-hidden border-y border-[#e5e5e5] bg-[#f8f8f8] py-12 sm:py-16 lg:py-20 xl:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
      >
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#cc071e]/[0.08] blur-3xl" />
        <div className="absolute right-[-80px] top-[-120px] h-[260px] w-[260px] rounded-full bg-[#cc071e]/[0.05] blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-[1100px] flex-col items-center gap-4 px-4 text-center sm:gap-6 sm:px-6 lg:gap-8 lg:px-16">
        <span
          className={`${inter.className} text-xs font-semibold uppercase tracking-[0.4em] text-[#666666]`}
        >
          Premium Performance Wear
        </span>
        <h2
          className={`${montserrat.className} text-xl font-bold uppercase tracking-[0.05em] text-[#111111] sm:text-2xl lg:text-4xl xl:text-5xl`}
        >
          Elevate Your Training. Upgrade Your Fit.
        </h2>
        <p
          className={`${inter.className} max-w-2xl text-xs text-[#666666] sm:text-sm lg:text-base xl:text-lg`}
        >
          Discover performance-driven gym outfits engineered for strength,
          comfort, and style.
        </p>
        <div className="flex w-full items-center justify-center gap-2 sm:gap-4">
          <Link
            href="/products"
            className="inline-flex flex-1 items-center justify-center rounded-full bg-[#cc071e] px-2 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white shadow-[0_14px_30px_rgba(204,7,30,0.18)] transition-all duration-300 hover:bg-[#a70618] hover:shadow-[0_18px_34px_rgba(204,7,30,0.25)] sm:flex-initial sm:px-8 sm:py-4 sm:text-[0.75rem] sm:tracking-[0.2em] lg:text-sm"
          >
            Explore Collections
          </Link>
          <Link
            href="/best-sellers"
            className="inline-flex flex-1 items-center justify-center rounded-full border border-[#cc071e] px-2 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-[#111111] transition-all duration-300 hover:bg-[#cc071e] hover:text-white sm:flex-initial sm:px-8 sm:py-4 sm:text-[0.75rem] sm:tracking-[0.2em] lg:text-sm"
          >
            Shop Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
}
