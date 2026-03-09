import Image from "next/image";
import Link from "next/link";
import { Inter, Montserrat } from "next/font/google";

const montserrat = Montserrat({
 
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
    <section className="border-y border-[#dedede] bg-white py-10 sm:py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="relative overflow-hidden bg-white shadow-[0_25px_60px_rgba(0,0,0,0.08)]">
          <Image
            src="/call-to-action.png"
            alt="Neversore campaign poster"
            width={900}
            height={1200}
            priority
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-1 text-left sm:gap-2 lg:gap-3">
          
          <h2
            className={`${montserrat.className} text-[18px] sm:text-[22px] lg:text-[27px] font-bold uppercase leading-tight text-[#101010]`}
          >
            Follow us on Instagram
          </h2>
          <p
            className={`${inter.className} text-[12px] sm:text-[14px] lg:text-[16px] text-[#666666]`}
          >
            Latest drops, style inspo & more.
          </p>
          <div className="space-y-1">
            
            <Link
              href="https://instagram.com/be.neversore"
              target="_blank"
              rel="noopener noreferrer"
              className={`${montserrat.className} text-[13px] sm:text-[15px] lg:text-[17px] font-semibold uppercase tracking-wide text-[#111111] underline underline-offset-4 transition-colors duration-200 `}
            >
              @be.neversore
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
