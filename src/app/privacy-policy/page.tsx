import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import type { Metadata } from "next";

const privacySections = [
  {
    title: "Information We Collect",
    num: "01",
    tag: "Data",
    description:
      "We gather only the details required to fulfill orders, improve the experience, and keep you in the loop.",
    points: [
      "Profile basics such as name, email, and contact number.",
      "Shipping and billing addresses so parcels get to you without friction.",
      "Payment information processed via trusted third-party gateways—Neversore never stores your card data.",
      "Website usage data (analytics, device context) to refine performance and content.",
    ],
  },
  {
    title: "How We Use Your Information",
    num: "02",
    tag: "Usage",
    description:
      "Every data point is tied to a specific service outcome—no fluff, no spam.",
    points: [
      "Processing orders, arranging deliveries, and triggering support workflows.",
      "Improving fit guidance, product storytelling, and on-site performance through aggregated insights.",
      "Sending order confirmations, shipping updates, and relevant brand drops you opt into.",
    ],
  },
  {
    title: "Data Protection",
    num: "03",
    tag: "Security",
    description:
      "Security is part of the build process. We defend your information with modern safeguards.",
    points: [
      "Checkout data is encrypted end-to-end via PCI-compliant partners.",
      "Sensitive payment credentials are tokenized by gateways—we do not store them on Neversore servers.",
      "Internal access is limited to authorized team members on a need-to-know basis.",
    ],
  },
  {
    title: "Sharing of Information",
    num: "04",
    tag: "Disclosure",
    description:
      "Your data stays in-house except where logistics or compliance requires limited sharing.",
    points: [
      "Information is shared only with delivery partners, payment processors, or analytics providers needed to complete services.",
      "We do not sell, rent, or trade customer data with third parties.",
      "All partners are contractually bound to protect the information we provide.",
    ],
  },
  {
    title: "Your Rights",
    num: "05",
    tag: "Control",
    description:
      "You control how we store and use your personal information.",
    points: [
      "Request access to the data we hold about you at any time.",
      "Ask for corrections if details are incomplete or outdated.",
      "Request deletion subject to legal or financial record-keeping requirements.",
    ],
  },
] as const;

const trustStats = [
  { label: "Data Sold", value: "Zero" },
  { label: "Encryption", value: "PCI" },
  { label: "Response Time", value: "48H" },
] as const;

const lastUpdated = "March 4, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy | Neversore",
  description:
    "Understand how NEVERSORE collects, protects, and uses your personal data across orders, support, and brand communications.",
};

export default function PrivacyPolicyPage() {
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
            PRIVACY
          </span>

          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pb-14 md:pb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            {/* Left */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-[10px] font-medium tracking-[0.22em] uppercase rounded-full px-3.5 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Trust
              </div>

              <h1
                className="leading-[0.92] tracking-wide text-[#111111] mb-5"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(48px, 9vw, 100px)",
                }}
              >
                Privacy<br />
                <span className="text-red-600">Policy</span>
              </h1>

              <p className="text-base sm:text-lg font-light text-[#444444] leading-relaxed max-w-lg">
                We respect your privacy and are committed to protecting personal
                information with the same discipline we bring to product design.
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
                  5
                </p>
                <p className="text-[11px] tracking-[0.18em] uppercase text-[#888888] mt-1">
                  Policy Sections
                </p>
              </div>
              <div className="h-px bg-[#e0ddd8] md:w-32 md:ml-auto" />
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#888888]">
                Last updated — {lastUpdated}
              </p>
            </div>
          </div>

          {/* ── TRUST STATS STRIP ── */}
          <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
            <div className="grid grid-cols-3 border border-[#e0ddd8] border-b-0 rounded-t-2xl overflow-hidden divide-x divide-[#e0ddd8] bg-white">
              {trustStats.map((stat) => (
                <div key={stat.label} className="px-5 sm:px-8 py-4 sm:py-5">
                  <p
                    className="leading-none text-[#111111] tracking-wide"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "clamp(20px, 4vw, 34px)",
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
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-16 items-start">

            {/* ── STICKY SIDEBAR ── */}
            <aside className="hidden lg:block sticky top-24">
              <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#888888] mb-5">
                Sections
              </p>
              <nav className="space-y-1 border-l border-[#e0ddd8]">
                {privacySections.map((section) => (
                  <a
                    key={section.num}
                    href={`#section-${section.num}`}
                    className="flex items-center gap-3 pl-4 py-2 text-sm text-[#888888] hover:text-red-600 hover:border-l-2 hover:border-red-500 hover:-ml-px transition-all duration-150"
                  >
                    <span
                      className="text-[11px] tracking-widest text-red-400 flex-shrink-0"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      {section.num}
                    </span>
                    {section.title}
                  </a>
                ))}
              </nav>

              {/* Sidebar CTA */}
              <div className="mt-10 rounded-xl border border-[#e0ddd8] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#888888] mb-2">
                  Exercise Your Rights
                </p>
                <p className="text-sm font-light text-[#444444] leading-relaxed mb-4">
                  Request access, correction, or deletion of your data anytime.
                </p>
                <a
                  href="mailto:support@neversore.com"
                  className="group inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-[11px] font-medium tracking-[0.15em] uppercase rounded-full px-5 py-2.5 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Email Us
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </a>
              </div>
            </aside>

            {/* ── MAIN SECTIONS ── */}
            <div className="space-y-5">
              {privacySections.map((section) => (
                <article
                  key={section.num}
                  id={`section-${section.num}`}
                  className="group rounded-2xl border border-[#e0ddd8] bg-white hover:border-red-200 hover:shadow-[0_8px_32px_rgba(212,0,31,0.06)] transition-all duration-300 overflow-hidden"
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#e0ddd8] group-hover:border-red-100 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                      <span
                        className="text-[13px] tracking-widest text-red-500 flex-shrink-0"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                      >
                        {section.num}
                      </span>
                      <h2
                        className="text-[#111111] tracking-wide"
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "clamp(17px, 3vw, 23px)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {section.title}
                      </h2>
                    </div>
                    <span className="hidden sm:block text-[9px] font-medium tracking-[0.25em] uppercase text-red-400 bg-red-50 border border-red-100 rounded-full px-2.5 py-1 flex-shrink-0">
                      {section.tag}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="px-6 sm:px-8 py-6">
                    <p className="text-sm sm:text-base font-light text-[#555555] leading-relaxed mb-5">
                      {section.description}
                    </p>
                    <ul className="space-y-3">
                      {section.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-3 text-sm sm:text-base text-[#444444] font-light leading-relaxed"
                        >
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}

              {/* ── RIGHTS CARD ── */}
              <div className="rounded-2xl border border-[#e0ddd8] bg-white overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                {/* Mac-style header */}
                <div className="bg-[#111111] px-6 py-3.5 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-auto text-[11px] tracking-[0.18em] uppercase text-white/30">
                    Data Rights
                  </span>
                </div>

                <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#888888] mb-2">
                      Exercise Your Rights
                    </p>
                    <h3
                      className="text-[#111111] mb-3 leading-tight"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "clamp(28px, 4vw, 38px)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Your Data,<br />Your Call
                    </h3>
                    <p className="text-sm font-light text-[#666666] leading-relaxed">
                      Email us with your request for data access, correction, or
                      deletion and we will respond within 2 business days.
                    </p>
                  </div>

                  <div className="space-y-3 rounded-xl border border-[#e0ddd8] bg-[#faf9f7] p-5">
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-[#888888] mb-1">
                        Email
                      </p>
                      <a
                        href="mailto:support@neversore.com"
                        className="text-sm text-red-600 hover:opacity-70 transition-opacity font-medium"
                      >
                        support@neversore.com
                      </a>
                    </div>
                    <div className="h-px bg-[#e0ddd8]" />
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-[#888888] mb-1">
                        You Can Request
                      </p>
                      <p className="text-sm text-[#444444] font-light leading-relaxed">
                        Data access · Corrections · Deletion
                      </p>
                    </div>
                    <div className="h-px bg-[#e0ddd8]" />
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#888888]">
                      Response within 2 business days
                    </p>
                  </div>
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