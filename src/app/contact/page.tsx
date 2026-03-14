import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import type { Metadata } from "next";

type ContactHighlight = {
  label: string;
  value: string;
  description: string;
  link?: string;
};

const contactHighlights: ReadonlyArray<ContactHighlight> = [
  {
    label: "Email",
    value: "teams@neversore.com",
    description:
      "Our inbox is monitored daily for order updates, sizing questions, and product support.",
    link: "mailto:teams@neversore.com",
  },
  {
    label: "Business Hours",
    value: "Mon – Sat, 10 AM – 6 PM IST",
    description:
      "Drop your query any time—responses are prioritized during operating hours.",
  },
  {
    label: "Response Time",
    value: "24–48 working hours",
    description:
      "We aim to resolve most tickets within two business days depending on queue volume.",
  },
];

const assistanceTopics = [
  {
    title: "Order Support",
    num: "01",
    detail:
      "Status checks, address tweaks before dispatch, or consolidating shipments for training crews.",
  },
  {
    title: "Sizing Guidance",
    num: "02",
    detail:
      "Compare fits, fabric stretch, and compression levels to dial in the right size for your program.",
  },
  {
    title: "Product Feedback",
    num: "03",
    detail:
      "Share field intel so we can keep iterating on silhouettes, trims, and performance layers.",
  },
];

export const metadata: Metadata = {
  title: "Contact Us | Neversore",
  description:
    "Reach the NEVERSORE support crew for order help, sizing guidance, and product questions. Email teams@neversore.com for a 24–48 hour response.",
};

export default function ContactPage() {
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
              fontSize: "clamp(100px, 20vw, 280px)",
              WebkitTextStroke: "1.5px #e8e5e0",
            }}
          >
            CONTACT
          </span>

          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pb-14 md:pb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            {/* Left */}
            <div className="max-w-xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-[10px] font-medium tracking-[0.22em] uppercase rounded-full px-3.5 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Support
              </div>

              <h1
                className="leading-[0.92] tracking-wide text-[#111111] mb-5"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(52px, 10vw, 110px)",
                }}
              >
                Get In{" "}
                Touch.
              </h1>

              <p className="text-base sm:text-lg font-light text-[#444444] leading-relaxed">
                We're committed to assisting you with orders, sizing, and product
                support. Our crew gets back within 24–48 working hours.
              </p>
            </div>

            {/* Right stat */}
            <div className="md:text-right flex-shrink-0 pb-1">
              <p
                className="leading-none text-[#111111] tracking-wide"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(48px, 8vw, 72px)",
                }}
              >
                48H
              </p>
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#888888] mt-1.5">
                Max Response
              </p>
            </div>
          </div>
        </section>

        {/* ── BODY ── */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 md:py-20">

          {/* ── CONTACT CARDS ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 border border-[#e0ddd8] rounded-2xl overflow-hidden mb-14 md:mb-20 divide-y sm:divide-y-0 sm:divide-x divide-[#e0ddd8]">
            {contactHighlights.map((item) => (
              <article
                key={item.label}
                className="group relative bg-white hover:bg-[#fefcfb] transition-colors duration-200 p-7 sm:p-8"
              >
                <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#888888] mb-3">
                  {item.label}
                </p>

                {item.link ? (
                  <a
                    href={item.link}
                    className="block font-semibold text-black hover:opacity-70 transition-opacity mb-3 leading-snug"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "clamp(15px, 2vw, 20px)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {item.value}
                  </a>
                ) : (
                  <p
                    className="font-semibold text-[#111111] mb-3 leading-snug"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "clamp(15px, 2vw, 20px)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {item.value}
                  </p>
                )}

                <p className="text-sm font-light text-[#666666] leading-relaxed">
                  {item.description}
                </p>

                {item.link && (
                  <div className="absolute bottom-7 right-7 w-8 h-8 border border-[#e0ddd8] rounded-full flex items-center justify-center text-[#888888] text-xs opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                    ↗
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* ── BOTTOM GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

            {/* Left: Assistance Topics */}
            <div>
              <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-red-600 mb-4">
                How we can help
              </p>
              <h2
                className="leading-tight text-[#111111] mb-2"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(32px, 5vw, 46px)",
                  letterSpacing: "0.03em",
                }}
              >
                We&apos;ve Got<br />You Covered
              </h2>
              <p className="text-sm font-light text-[#888888] mb-8 leading-relaxed">
                Share order IDs, product names, or fit notes so we can prioritize
                your ticket and route it to the right specialist.
              </p>

              <div className="border-t border-[#e0ddd8]">
                {assistanceTopics.map((topic) => (
                  <div
                    key={topic.title}
                    className="group flex gap-5 py-5 border-b border-[#e0ddd8] hover:pl-2 transition-all duration-200 cursor-default"
                  >
                    <span
                      className="text-[13px] tracking-widest text-red-600 pt-0.5 flex-shrink-0"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      {topic.num}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[#111111] mb-1 tracking-wide">
                        {topic.title}
                      </p>
                      <p className="text-sm font-light text-[#888888] leading-relaxed">
                        {topic.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Email Template Card */}
            <div className="rounded-2xl border border-[#e0ddd8] overflow-hidden shadow-[0_2px_0px_#e0ddd8,0_12px_40px_rgba(0,0,0,0.06)]">
              {/* Mac-style header */}
              <div className="bg-[#111111] px-5 py-3.5 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-auto text-[11px] tracking-[0.18em] uppercase text-white/30">
                  Quick Note Template
                </span>
              </div>

              {/* Fields */}
              <div className="bg-white px-6 sm:px-7 pt-6 pb-2 space-y-5">
                {[
                  {
                    label: "To",
                    value: "teams@neversore.com",
                    placeholder: false,
                  },
                  {
                    label: "Subject",
                    value: "Order #NS12345 — Sizing Help",
                    placeholder: false,
                  },
                  {
                    label: "Message",
                    value:
                      "Hi team, I need help with my order…\n\nHeight: 5'10\" · Weight: 75kg\nPreferred fit: Compression / Relaxed",
                    placeholder: true,
                  },
                  {
                    label: "Attachments",
                    value: "Photos or screenshots (optional)",
                    placeholder: true,
                  },
                ].map((field) => (
                  <div key={field.label}>
                    <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#888888] mb-1.5">
                      {field.label}
                    </p>
                    <div
                      className={`text-sm border border-[#e0ddd8] rounded-lg px-3.5 py-2.5 bg-[#faf9f7] leading-relaxed whitespace-pre-line ${
                        field.placeholder
                          ? "text-[#aaaaaa] italic font-light"
                          : "text-[#111111]"
                      }`}
                    >
                      {field.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="bg-white border-t border-[#e0ddd8] px-6 sm:px-7 py-5 mt-5">
                <a
                  href="mailto:teams@neversore.com"
                  className="group inline-flex items-center gap-2.5 bg-gray-900 hover:bg-gray-700 text-white text-[11px] font-medium tracking-[0.15em] uppercase rounded-full px-6 py-3 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Send Email
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </a>
                <p className="text-xs font-light text-[#888888] mt-3.5 leading-relaxed">
                  The more details you include, the faster we can resolve your
                  query.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}