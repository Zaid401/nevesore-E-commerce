import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import type { Metadata } from "next";

const termsSections = [
  {
    title: "1. General",
    description:
      "These Terms of Service apply to every visitor, customer, and partner interacting with the NEVERSORE platform.",
    points: [
      "Use of the website confirms you are at least 18 years old or accessing it with parental/guardian supervision.",
      "You agree to comply with all local laws and regulations governing online conduct and acceptable content.",
    ],
  },
  {
    title: "2. Products & Availability",
    description:
      "Our collections are crafted in limited runs to ensure quality and progression. Inventory may shift quickly.",
    points: [
      "Product availability can change without notice and certain sizes or colorways may sell out rapidly.",
      "We may discontinue, update, or re-release products at our discretion to reflect performance insights and athlete feedback.",
    ],
  },
  {
    title: "3. Pricing",
    description:
      "We price in INR (₹) and include applicable taxes unless noted otherwise.",
    points: [
      "Pricing adjustments or corrections may occur if typographical or system errors are identified.",
      "Promotional offers, bundles, or membership pricing may be time-bound and subject to eligibility criteria.",
    ],
  },
  {
    title: "4. Accuracy of Information",
    description:
      "We build products to move with you, but minor variations can occur across screens and lighting setups.",
    points: [
      "Color, fit, or finish may look slightly different in person versus digital previews.",
      "Product descriptions and material callouts are updated as we refine fabrication and construction details.",
    ],
  },
  {
    title: "5. Prohibited Use",
    description:
      "Respect the grind—misusing the platform disrupts the community we are building.",
    points: [
      "Using the site for unlawful or fraudulent activity.",
      "Infringing on intellectual property, privacy, or publicity rights.",
      "Uploading malicious code, spam, or any content designed to compromise performance or data.",
    ],
  },
  {
    title: "6. Limitation of Liability",
    description:
      "NEVERSORE is not liable for indirect, incidental, or consequential damages that result from using our products or platform.",
    points: [
      "You assume responsibility for how products are used during training or competition.",
      "We do not guarantee uninterrupted access to the site, though we work to resolve downtime quickly.",
    ],
  },
  {
    title: "7. Changes to Terms",
    description:
      "Terms can be updated as the brand evolves. Staying on the site means you accept the latest version.",
    points: [
      "We will post revisions here and adjust the \"Last Updated\" date accordingly.",
      "If a change is material, we may communicate it through email or prominent onsite messaging.",
    ],
  },
] as const;

const lastUpdated = "March 4, 2026";

export const metadata: Metadata = {
  title: "Terms of Service | Neversore",
  description:
    "Review the official Terms of Service for NEVERSORE performance apparel, covering usage, products, pricing, and liability considerations.",
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-white text-neutral-900">
      <Navbar />
      <main className="pt-12 md:pt-6">
        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-12 space-y-5 text-left sm:mb-16">
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
                Legal
              </span>
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold uppercase tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
                  Terms of Service
                </h1>
                <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
                  Welcome to NEVERSORE. By accessing or purchasing from our platform you agree to the commitments and expectations outlined below. These guardrails keep the community fair, transparent, and focused on progression.
                </p>
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                Last Updated — {lastUpdated}
              </p>
            </div>

            <div className="space-y-6">
              {termsSections.map((section) => (
                <article
                  key={section.title}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] transition hover:border-red-500/40 hover:bg-white sm:p-8"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-semibold uppercase tracking-wide text-neutral-900 sm:text-xl">
                      {section.title}
                    </h2>
                    <span className="text-xs uppercase tracking-[0.3em] text-red-500/70">
                      Policy
                    </span>
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
                    {section.description}
                  </p>
                  <ul className="mt-5 list-disc space-y-2 pl-5 text-base text-neutral-700 sm:text-lg">
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="mt-12 grid gap-6 rounded-2xl border border-neutral-200 bg-gradient-to-br from-red-50 via-white to-white p-6 sm:grid-cols-2 sm:p-8">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Need Clarity?</p>
                <h3 className="mt-3 text-2xl font-semibold uppercase text-neutral-900">
                  We are here to help
                </h3>
                <p className="mt-3 text-base leading-relaxed text-neutral-600 sm:text-lg">
                  Reach out to the support crew if you have questions about these terms or how they apply to your order, training group, or partnership inquiry.
                </p>
              </div>
              <div className="self-center rounded-xl border border-neutral-200 bg-white/80 p-5 text-base text-neutral-700 shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:text-lg">
                <p>
                  Email: <a className="text-red-500 transition hover:text-red-400" href="mailto:support@neversore.com">support@neversore.com</a>
                </p>
                <p className="mt-2">Hours: Monday – Friday, 10:00–18:00 IST</p>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-neutral-500">Response within 2 business days</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
