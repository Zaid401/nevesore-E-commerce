import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import type { Metadata } from "next";

const shareIdeas = [
  "Product reviews covering build quality, comfort, or durability.",
  "Fit and performance feedback so we can dial in compression, stretch, and support.",
  "Website or checkout experience suggestions that keep the journey frictionless.",
] as const;

const submissionSteps = [
  {
    title: "Step 1",
    detail: "Collect notes, photos, or short clips that highlight what worked or what needs refinement.",
  },
  {
    title: "Step 2",
    detail: "Email everything to support@neversore.com with your order ID or product name for context.",
  },
  {
    title: "Step 3",
    detail: "Stay tuned — our team may reach out for clarification or to feature your feedback in future drops.",
  },
] as const;

export const metadata: Metadata = {
  title: "Leave a Feedback | Neversore",
  description:
    "Share product reviews, fit insights, and digital experience suggestions so NEVERSORE can keep building better gear.",
};

export default function LeaveFeedbackPage() {
  return (
    <div className="bg-white text-neutral-900">
      <Navbar />
      <main className="pt-28 md:pt-10">
        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-12 space-y-6 text-left sm:mb-16">
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
                Community
              </span>
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold uppercase tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
                  Leave a Feedback
                </h1>
                <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
                  Your feedback helps us build better products and experiences. Tell us what hits, what misses, and how we can keep you moving forward.
                </p>
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                We listen. We iterate.
              </p>
            </div>

            <div className="grid gap-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-8">
              <h2 className="text-2xl font-semibold uppercase text-neutral-900">Share anything that matters</h2>
              <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
                Here are a few prompts if you need to get started:
              </p>
              <ul className="list-disc space-y-3 pl-5 text-base text-neutral-700 sm:text-lg">
                {shareIdeas.map((idea) => (
                  <li key={idea}>{idea}</li>
                ))}
              </ul>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                By sending feedback you grant us permission to use it for improvement and marketing.
              </p>
            </div>

            <div className="mt-12 rounded-2xl border border-neutral-200 bg-gradient-to-br from-red-50 via-white to-white p-6 sm:p-8">
              <h3 className="text-2xl font-semibold uppercase text-neutral-900">How to submit</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {submissionSteps.map((step) => (
                  <div
                    key={step.title}
                    className="rounded-xl border border-neutral-200 bg-white/80 p-4 text-base text-neutral-700 shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:text-lg"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">{step.title}</p>
                    <p className="mt-2 leading-relaxed">{step.detail}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-dashed border-red-200 bg-white p-5 text-base text-neutral-700 shadow-[0_14px_30px_rgba(15,23,42,0.08)] sm:text-lg">
                <p>
                  Email: <a className="text-red-500 transition hover:text-red-400" href="mailto:support@neversore.com">support@neversore.com</a>
                </p>
                <p className="mt-2">Response Time: 24–48 working hours</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
