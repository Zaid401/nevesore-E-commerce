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
    description: "Our inbox is monitored daily for order updates, sizing questions, and product support.",
    link: "mailto:teams@neversore.com",
  },
  {
    label: "Business Hours",
    value: "Monday – Saturday, 10 AM – 6 PM IST",
    description: "Drop your query any time—responses are prioritized during operating hours.",
  },
  {
    label: "Response Time",
    value: "24–48 working hours",
    description: "We aim to resolve most tickets within two business days depending on queue volume.",
  },
] ;

const assistanceTopics = [
  {
    title: "Order Support",
    detail: "Status checks, address tweaks before dispatch, or consolidating shipments for training crews.",
  },
  {
    title: "Sizing Guidance",
    detail: "Compare fits, fabric stretch, and compression levels to dial in the right size for your program.",
  },
  {
    title: "Product Feedback",
    detail: "Share field intel so we can keep iterating on silhouettes, trims, and performance layers.",
  },
];

export const metadata: Metadata = {
  title: "Contact Us | Neversore",
  description:
    "Reach the NEVERSORE support crew for order help, sizing guidance, and product questions. Email teams@neversore.com for a 24–48 hour response.",
};

export default function ContactPage() {
  return (
    <div className="bg-white text-neutral-900">
      <Navbar />
      <main className="pt-12 md:pt-6">
        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-12 space-y-6 text-left sm:mb-16">
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
                Support
              </span>
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold uppercase tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
                  Contact Us
                </h1>
                <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
                  We are committed to assisting you with orders, sizing, and product support. Reach out and our crew will get back within 24–48 working hours.
                </p>
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                Direct line to the team
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {contactHighlights.map((item) => (
                <article
                  key={item.label}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition hover:border-red-500/40 hover:bg-white"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">{item.label}</p>
                  {item.link ? (
                    <a href={item.link} className="mt-2 block text-xl font-semibold text-red-500 transition hover:text-red-400">
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-2 text-xl font-semibold text-neutral-900">{item.value}</p>
                  )}
                  <p className="mt-3 text-base leading-relaxed text-neutral-600 sm:text-lg">{item.description}</p>
                </article>
              ))}
            </div>

            <div className="mt-12 grid gap-6 rounded-2xl border border-neutral-200 bg-gradient-to-br from-red-50 via-white to-white p-6 sm:p-8 lg:grid-cols-2">
              <div className="space-y-5">
                <h2 className="text-2xl font-semibold uppercase text-neutral-900">How we can help</h2>
                <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
                  Share order IDs, product names, or fit notes so we can prioritize your ticket and route it to the right specialist.
                </p>
                <ul className="space-y-4">
                  {assistanceTopics.map((topic) => (
                    <li key={topic.title} className="rounded-xl border border-neutral-200 bg-white/80 p-4 shadow-[0_10px_25px_rgba(15,23,42,0.06)]">
                      <p className="text-base font-semibold uppercase tracking-wide text-neutral-900 sm:text-lg">{topic.title}</p>
                      <p className="mt-2 text-base text-neutral-600 sm:text-lg">{topic.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-dashed border-red-200 bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Quick note template</p>
                <ul className="mt-4 space-y-3 text-base text-neutral-700 sm:text-lg">
                  <li className="rounded-lg bg-neutral-50 p-3">1. Subject: Order #NS12345 — Sizing Help</li>
                  <li className="rounded-lg bg-neutral-50 p-3">2. Message: Include height, weight, and preferred fit.</li>
                  <li className="rounded-lg bg-neutral-50 p-3">3. Attach: Photos or screenshots if it speeds up troubleshooting.</li>
                </ul>
                <p className="mt-4 text-base text-neutral-600 sm:text-lg">
                  Email everything to <a className="text-red-500 transition hover:text-red-400" href="mailto:teams@neversore.com">teams@neversore.com</a> so the right specialist can respond within 24–48 working hours.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
