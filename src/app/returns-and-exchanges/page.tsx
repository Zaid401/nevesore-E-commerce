import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import type { Metadata } from "next";

const returnsSections = [
  {
    title: "1. Exchange Eligibility",
    description:
      "We back every release, but swapping sizes or fixing fulfillment errors keeps performance dialed in.",
    points: [
      "Eligible reasons include size mismatches, manufacturing defects, or receiving an incorrect item.",
      "Submit your request within 48 hours of delivery so we can move fast on resolutions.",
    ],
  },
  {
    title: "2. Conditions",
    description:
      "Returned gear must look and feel brand new so we can inspect or restock without compromising hygiene.",
    points: [
      "Products must be unworn, unwashed, and unused.",
      "Original tags, protective films, and premium packaging need to be intact.",
    ],
  },
  {
    title: "3. Non-Returnable Items",
    description:
      "Certain layers stay personal-use only for sanitary and performance reasons.",
    points: [
      "Compression wear, inner-layer garments, socks, and accessories are non-returnable unless they arrive defective.",
      "If there is a proven defect, our team will guide you through the appropriate remedy.",
    ],
  },
  {
    title: "4. Cancellation",
    description:
      "Need to cancel? It has to happen before we hand over the parcel to our courier.",
    points: [
      "Once an order is dispatched, we cannot cancel it, but you can initiate an exchange if eligible.",
    ],
  },
  {
    title: "5. Exchange Process",
    description:
      "After we green-light the request, the rest is plug-and-play.",
    points: [
      "We arrange a reverse pickup or share drop-off details where available.",
      "Replacement units are shipped after the returned item clears quality inspection.",
    ],
  },
] as const;

const lastUpdated = "March 4, 2026";

export const metadata: Metadata = {
  title: "Returns & Exchanges | Neversore",
  description:
    "Learn how NEVERSORE handles exchanges, cancellations, and non-returnable items so you can shop with confidence.",
};

export default function ReturnsAndExchangesPage() {
  return (
    <div className="bg-white text-neutral-900">
      <Navbar />
      <main className="pt-12 md:pt-6">
        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-12 space-y-5 text-left sm:mb-16">
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
                Support
              </span>
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold uppercase tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
                  Returns & Exchanges
                </h1>
                <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
                  Our exchange framework keeps you dialed into the right fit while protecting hygienic standards for every athlete in the community.
                </p>
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                Last Updated — {lastUpdated}
              </p>
            </div>

            <div className="space-y-6">
              {returnsSections.map((section) => (
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
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Need Assistance?</p>
                <h3 className="mt-3 text-2xl font-semibold uppercase text-neutral-900">
                  Talk to Support
                </h3>
                <p className="mt-3 text-base leading-relaxed text-neutral-600 sm:text-lg">
                  Share your order ID, photos (if defective), and preferred outcome. We will respond with the fastest path forward.
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
