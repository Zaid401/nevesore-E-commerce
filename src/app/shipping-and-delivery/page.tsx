import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import type { Metadata } from "next";

const shippingSections = [
  {
    title: "1. Order Processing",
    description:
      "We prep every order with the same focus we put into training. Expect a quick handoff from confirmation to dispatch.",
    points: [
      "Orders are processed within 24–48 working hours once payment is confirmed.",
      "Weekend or public-holiday orders move into the queue the next business day.",
    ],
  },
  {
    title: "2. Delivery Timeline",
    description:
      "Transit times vary by region. The closer you are to a metro hub, the quicker the drip hits your doorstep.",
    points: [
      "Metro cities: 3–5 business days.",
      "Other serviceable locations: 5–8 business days.",
      "Remote or hard-to-reach areas: up to 10 business days depending on courier accessibility.",
    ],
  },
  {
    title: "3. Shipping Charges",
    description:
      "Shipping costs stay transparent so you always know what you are paying for.",
    points: [
      "Select drops include complimentary shipping—watch for banners or email announcements.",
      "Standard rates, when applicable, are surfaced at checkout before you confirm payment.",
    ],
  },
  {
    title: "4. Tracking",
    description:
      "Once we hand off the package, we send the intel you need to follow every checkpoint.",
    points: [
      "Tracking links are shared via email and SMS immediately after dispatch.",
      "Updates refresh automatically as the courier scans your shipment through each facility.",
    ],
  },
  {
    title: "5. Delivery Delays",
    description:
      "External factors can slow the route, but we stay in your corner until it lands.",
    points: [
      "Weather events, local restrictions, or courier network issues may extend timelines beyond our control.",
      "Our support crew will coordinate with partners to resolve setbacks and keep you updated.",
    ],
  },
] as const;

const lastUpdated = "March 4, 2026";

export const metadata: Metadata = {
  title: "Shipping & Delivery | Neversore",
  description:
    "Understand how NEVERSORE processes orders, shipping timelines, charges, and tracking so you can plan training drops with confidence.",
};

export default function ShippingAndDeliveryPage() {
  return (
    <div className="bg-white text-neutral-900">
      <Navbar />
      <main className="pt-12 md:pt-6">
        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-12 space-y-5 text-left sm:mb-16">
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
                Logistics
              </span>
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold uppercase tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
                  Shipping & Delivery
                </h1>
                <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
                  These guidelines cover how we process, dispatch, and track every NEVERSORE order so you know exactly when to gear up.
                </p>
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                Last Updated — {lastUpdated}
              </p>
            </div>

            <div className="space-y-6">
              {shippingSections.map((section) => (
                <article
                  key={section.title}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] transition hover:border-red-500/40 hover:bg-white sm:p-8"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-semibold uppercase tracking-wide text-neutral-900 sm:text-xl">
                      {section.title}
                    </h2>
                    <span className="text-xs uppercase tracking-[0.3em] text-red-500/70">
                      Update
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
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Need Support?</p>
                <h3 className="mt-3 text-2xl font-semibold uppercase text-neutral-900">
                  Talk to the crew
                </h3>
                <p className="mt-3 text-base leading-relaxed text-neutral-600 sm:text-lg">
                  If your tracking stalls or you need to reroute a delivery, message us with your order ID so we can intervene fast.
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
