import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import type { Metadata } from "next";

const privacySections = [
  {
    title: "1. Information We Collect",
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
    title: "2. How We Use Your Information",
    description:
      "Every data point is tied to a specific service outcome—no fluff, no spam.",
    points: [
      "Processing orders, arranging deliveries, and triggering support workflows.",
      "Improving fit guidance, product storytelling, and on-site performance through aggregated insights.",
      "Sending order confirmations, shipping updates, and relevant brand drops you opt into.",
    ],
  },
  {
    title: "3. Data Protection",
    description:
      "Security is part of the build process. We defend your information with modern safeguards.",
    points: [
      "Checkout data is encrypted end-to-end via PCI-compliant partners.",
      "Sensitive payment credentials are tokenized by gateways—we do not store them on Neversore servers.",
      "Internal access is limited to authorized team members on a need-to-know basis.",
    ],
  },
  {
    title: "4. Sharing of Information",
    description:
      "Your data stays in-house except where logistics or compliance requires limited sharing.",
    points: [
      "Information is shared only with delivery partners, payment processors, or analytics providers needed to complete services.",
      "We do not sell, rent, or trade customer data with third parties.",
      "All partners are contractually bound to protect the information we provide.",
    ],
  },
  {
    title: "5. Your Rights",
    description:
      "You control how we store and use your personal information.",
    points: [
      "Request access to the data we hold about you at any time.",
      "Ask for corrections if details are incomplete or outdated.",
      "Request deletion subject to legal or financial record-keeping requirements.",
    ],
  },
] as const;

const lastUpdated = "March 4, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy | Neversore",
  description:
    "Understand how NEVERSORE collects, protects, and uses your personal data across orders, support, and brand communications.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white text-neutral-900">
      <Navbar />
      <main className="pt-12 md:pt-6">
        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-12 space-y-6 text-left sm:mb-16">
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
                Trust
              </span>
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold uppercase tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
                  Privacy Policy
                </h1>
                <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
                  We respect your privacy and are committed to protecting personal information with the same discipline we bring to product design.
                </p>
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                Last Updated — {lastUpdated}
              </p>
            </div>

            <div className="space-y-6">
              {privacySections.map((section) => (
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

            <div className="mt-12 rounded-2xl border border-neutral-200 bg-gradient-to-br from-red-50 via-white to-white p-6 sm:p-8">
              <h3 className="text-2xl font-semibold uppercase text-neutral-900">
                Need to exercise your rights?
              </h3>
              <p className="mt-3 text-base leading-relaxed text-neutral-600 sm:text-lg">
                Email <a className="text-red-500 transition hover:text-red-400" href="mailto:support@neversore.com">support@neversore.com</a> with your request for data access, correction, or deletion and we will respond within 2 business days.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
