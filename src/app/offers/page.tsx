import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import type { Metadata } from "next";

const offerHighlights = [
  {
    title: "Limited Windows",
    detail:
      "Drops, bundles, and launch-week codes are time boxed. Once the timer expires the pricing reverts to standard retail.",
  },
  {
    title: "No Stacking",
    detail:
      "Only the stated promotion applies to an order unless we explicitly mention stackable perks in the announcement.",
  },
  {
    title: "Code Discipline",
    detail:
      "Enter discount codes at checkout before payment. We cannot retroactively adjust invoices after capture.",
  },
  {
    title: "Offer Control",
    detail:
      "We reserve the right to tweak or cancel any promo if inventory thresholds change or misuse is detected.",
  },
  {
    title: "Bulk Exceptions",
    detail:
      "Reseller or bulk orders may be excluded from consumer-facing offers unless approved in writing by the team.",
  },
] as const;

export const metadata: Metadata = {
  title: "Offers & Promotions | Neversore",
  description:
    "Stay updated on how NEVERSORE handles promotional offers, discount codes, and eligibility rules for every drop.",
};

export default function OffersPage() {
  return (
    <div className="bg-white text-neutral-900">
      <Navbar />
      <main className="pt-12 md:pt-6">
        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-12 space-y-6 text-left sm:mb-16">
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
                Promotions
              </span>
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold uppercase tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
                  Offers & Promotions
                </h1>
                <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
                  From member-only codes to seasonal bundles, here are the ground rules that keep every offer transparent and fair for the community.
                </p>
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                Updated — March 4, 2026
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {offerHighlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition hover:border-red-500/40 hover:bg-white"
                >
                  <h2 className="text-lg font-semibold uppercase tracking-wide text-neutral-900">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-neutral-600 sm:text-lg">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-neutral-200 bg-gradient-to-br from-red-50 via-white to-white p-6 sm:p-8">
              <h3 className="text-2xl font-semibold uppercase text-neutral-900">
                How to activate codes
              </h3>
              <div className="mt-4 grid gap-4 text-base text-neutral-700 sm:grid-cols-3 sm:text-lg">
                <div className="rounded-xl border border-neutral-200 bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Step 1</p>
                  <p className="mt-2 font-medium">Copy the latest code from email, SMS, or the banner on site.</p>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Step 2</p>
                  <p className="mt-2 font-medium">Apply it in the checkout discount field before selecting payment.</p>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Step 3</p>
                  <p className="mt-2 font-medium">Verify the adjusted subtotal and place the order while the window is live.</p>
                </div>
              </div>
              <p className="mt-6 text-base text-neutral-600 sm:text-lg">
                Need help redeeming an offer? Send your code and cart screenshot to <a className="text-red-500 transition hover:text-red-400" href="mailto:teams@neversore.com">teams@neversore.com</a> before checkout so we can confirm eligibility.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
