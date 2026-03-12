import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import type { Metadata } from "next";

const pillars = [
  {
    num: "01",
    title: "Discipline",
    description:
      "Built for athletes who show up every single day — not just when motivation strikes.",
  },
  {
    num: "02",
    title: "Function",
    description:
      "Every silhouette, trim, and fabric choice is engineered to perform under real training conditions.",
  },
  {
    num: "03",
    title: "Durability",
    description:
      "Gear that keeps up with high-volume training blocks, wash after wash, session after session.",
  },
  {
    num: "04",
    title: "Aesthetics",
    description:
      "Performance and design aren't a trade-off. We build gear that looks as sharp as it performs.",
  },
] as const;

export const metadata: Metadata = {
  title: "About Neversore",
  description:
    "Learn more about Neversore's performance-driven mission and brand heritage.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#faf9f7] text-[#111111]">
      <Navbar />

      <main>
        {/* ── HERO ── */}
        <section className="relative overflow-hidden border-b border-[#e0ddd8] pt-24 md:pt-28">
          {/* Ghost watermark */}
          <span
            className="pointer-events-none select-none absolute bottom-[-0.15em] right-[-0.04em] text-transparent font-black leading-none tracking-wide hidden sm:block"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(80px, 16vw, 240px)",
              WebkitTextStroke: "1.5px #e8e5e0",
            }}
          >
            NEVERSORE
          </span>

          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pb-14 md:pb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            {/* Left */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-[10px] font-medium tracking-[0.22em] uppercase rounded-full px-3.5 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                About Neversore
              </div>

              <h1
                className="leading-[0.92] tracking-wide text-[#111111] mb-5"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(52px, 9vw, 108px)",
                }}
              >
                Built For<br />
                <span className="text-red-600">The Work.</span>
              </h1>

              <p className="text-base sm:text-lg font-light text-[#444444] leading-relaxed max-w-lg">
                A performance-driven activewear brand for people who train with
                discipline, not excuses.
              </p>
            </div>

            {/* Right meta */}
            <div className="md:text-right flex-shrink-0 pb-1 space-y-3">
              <div>
                <p
                  className="leading-none text-[#111111] tracking-wide"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(40px, 6vw, 64px)",
                  }}
                >
                  EFHA
                </p>
                <p className="text-[11px] tracking-[0.18em] uppercase text-[#888888] mt-1">
                  Ventures
                </p>
              </div>
              <div className="h-px bg-[#e0ddd8] md:w-32 md:ml-auto" />
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#888888]">
                Est. India
              </p>
            </div>
          </div>

          {/* ── BRAND STATS STRIP ── */}
          <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
            <div className="grid grid-cols-3 border border-[#e0ddd8] border-b-0 rounded-t-2xl overflow-hidden divide-x divide-[#e0ddd8] bg-white">
              {[
                { label: "Mission", value: "Train Hard" },
                { label: "Standard", value: "No Quit" },
                { label: "Philosophy", value: "Every Day" },
              ].map((stat) => (
                <div key={stat.label} className="px-5 sm:px-8 py-4 sm:py-5">
                  <p
                    className="leading-none text-[#111111] tracking-wide"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "clamp(18px, 3.5vw, 30px)",
                    }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[10px] tracking-[0.18em] uppercase text-[#888888] mt-1.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BODY ── */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 md:py-20 space-y-14">

          {/* ── MISSION BLOCK ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: big quote */}
            <div>
              <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-red-600 mb-5">
                Our Mindset
              </p>
              <blockquote
                className="leading-tight text-[#111111] mb-6"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(36px, 6vw, 64px)",
                  letterSpacing: "0.02em",
                }}
              >
                "Push past discomfort.<br />
                Show up consistently.<br />
                <span className="text-red-600">Refuse to quit."</span>
              </blockquote>
              <p className="text-sm font-light text-[#888888] tracking-[0.15em] uppercase">
                — The Neversore Standard
              </p>
            </div>

            {/* Right: mission text */}
            <div className="space-y-5">
              <p className="text-base sm:text-lg font-light text-[#444444] leading-relaxed">
                NEVERSORE is a performance-driven activewear brand built for
                people who train with discipline, not excuses. The name
                represents a mindset — pushing past discomfort, showing up
                consistently, and refusing to quit when it gets hard.
              </p>
              <p className="text-base sm:text-lg font-light text-[#444444] leading-relaxed">
                Our products are designed to support real training, combining
                functionality, durability, and aesthetics for those committed
                to improving every day.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="h-px flex-1 bg-[#e0ddd8]" />
                <p className="text-[11px] tracking-[0.2em] uppercase text-[#888888] flex-shrink-0">
                  A brand under EFHA Ventures
                </p>
                <div className="h-px flex-1 bg-[#e0ddd8]" />
              </div>
            </div>
          </div>

          {/* ── PILLARS ── */}
          <div>
            <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-red-600 mb-4">
              What We Stand For
            </p>
            <h2
              className="leading-tight text-[#111111] mb-10"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(32px, 5vw, 48px)",
                letterSpacing: "0.03em",
              }}
            >
              The Four Pillars
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {pillars.map((pillar) => (
                <article
                  key={pillar.num}
                  className="group rounded-2xl border border-[#e0ddd8] bg-white hover:border-red-200 hover:shadow-[0_8px_32px_rgba(212,0,31,0.06)] transition-all duration-300 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0ddd8] group-hover:border-red-100 transition-colors duration-300">
                    <span
                      className="text-[13px] tracking-widest text-red-500"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      {pillar.num}
                    </span>
                    <h3
                      className="text-[#111111] tracking-wide"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "clamp(16px, 2.5vw, 20px)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {pillar.title}
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="px-6 py-5">
                    <p className="text-sm font-light text-[#555555] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* ── BOTTOM CTA CARD ── */}
          <div className="rounded-2xl border border-[#e0ddd8] bg-white overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            {/* Mac-style header */}
            <div className="bg-[#111111] px-6 py-3.5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-auto text-[11px] tracking-[0.18em] uppercase text-white/30">
                Join the Movement
              </span>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#888888] mb-2">
                  Ready to Train?
                </p>
                <h3
                  className="text-[#111111] mb-3 leading-tight"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(28px, 4vw, 40px)",
                    letterSpacing: "0.04em",
                  }}
                >
                  Gear Up.<br />
                  <span className="text-red-600">Get After It.</span>
                </h3>
                <p className="text-sm font-light text-[#666666] leading-relaxed">
                  Explore the full collection and find gear that keeps up with
                  your training — no matter how hard you push.
                </p>
              </div>

              <div className="space-y-3 rounded-xl border border-[#e0ddd8] bg-[#faf9f7] p-5">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#888888] mb-1">
                    Brand
                  </p>
                  <p className="text-sm text-[#111111] font-medium">
                    NEVERSORE
                  </p>
                </div>
                <div className="h-px bg-[#e0ddd8]" />
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#888888] mb-1">
                    Parent Company
                  </p>
                  <p className="text-sm text-[#444444] font-light">
                    EFHA Ventures
                  </p>
                </div>
                <div className="h-px bg-[#e0ddd8]" />
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#888888] mb-1">
                    Questions?
                  </p>
                  <a
                    href="mailto:teams@neversore.com"
                    className="text-sm text-red-600 hover:opacity-70 transition-opacity font-medium"
                  >
                    teams@neversore.com
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}