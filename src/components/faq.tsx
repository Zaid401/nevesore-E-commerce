"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What sizes do you offer?",
    answer:
      "We offer sizes XS to XXL in most styles. Fit notes are listed on each product page to help you choose the right size.",
  },
  {
    question: "Are your gym outfits sweat-resistant?",
    answer:
      "Yes. Our performance fabrics are sweat-wicking, quick-drying, and designed to stay breathable during high-intensity training.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Orders are processed within 1-2 business days. Standard delivery typically arrives in 3-7 business days.",
  },
  {
    question: "Can I return or exchange a product?",
    answer:
      "Absolutely. Returns and exchanges are accepted within 14 days of delivery as long as items are unworn and in original condition.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order ships, you will receive a tracking link via email. You can also find it in your account dashboard.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship internationally. Shipping rates and delivery times are shown at checkout based on your location.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 sm:gap-8 sm:px-6 lg:gap-10 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.6em] text-red-600">
            FAQ
          </span>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.08em] text-neutral-900 sm:mt-3 sm:text-3xl lg:text-4xl">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto mt-2 h-1 w-12 bg-red-600 sm:mt-3" />
          <p className="mx-auto mt-3 max-w-2xl text-xs text-neutral-500 sm:text-sm">
            Everything you need to know about our products, shipping, and returns.
          </p>
        </div>

        <div className="flex flex-col">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={item.question} className="border-b border-neutral-200">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="group flex w-full items-center justify-between gap-3 py-4 text-left sm:gap-6 sm:py-6"
                >
                  <span className="relative text-xs font-semibold uppercase tracking-[0.1em] text-neutral-900 transition-colors duration-200 group-hover:text-red-600 after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-red-600 after:transition-all after:duration-200 group-hover:after:w-8 sm:text-sm sm:group-hover:after:w-10">
                    {item.question}
                  </span>
                  <span
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center text-red-600 transition-transform duration-200 sm:h-8 sm:w-8 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path fill="currentColor" d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-4 text-xs text-neutral-600 sm:pb-6 sm:text-sm">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
