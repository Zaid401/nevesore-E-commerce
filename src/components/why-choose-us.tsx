export default function WhyChooseUs() {
  const highlights = [
    {
      title: "Premium Fabric Technology",
      description:
        "Breathable, sweat-wicking, and stretch-optimized materials built for intense training.",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
          <path
            fill="currentColor"
            d="M12 2c-1.66 3.43-4.8 6.02-8.5 6.95C4.2 15.64 7.5 20 12 22c4.5-2 7.8-6.36 8.5-13.05C16.8 8.02 13.66 5.43 12 2m0 3.7c1.26 1.67 3.07 3.06 5.2 3.94C16.75 14.8 14.7 17.8 12 19.2c-2.7-1.4-4.75-4.4-5.2-9.56C8.93 8.76 10.74 7.37 12 5.7"
          />
        </svg>
      ),
    },
    {
      title: "Athletic Precision Fit",
      description:
        "Engineered cuts that enhance muscle definition and ensure unrestricted movement.",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
          <path
            fill="currentColor"
            d="M12 2a8 8 0 0 0-8 8v3a8 8 0 0 0 16 0v-3a8 8 0 0 0-8-8m0 2a6 6 0 0 1 6 6v1H6v-1a6 6 0 0 1 6-6m0 16a6 6 0 0 1-6-6v-1h12v1a6 6 0 0 1-6 6"
          />
        </svg>
      ),
    },
    {
      title: "Built for Intensity",
      description:
        "Durable construction designed to withstand heavy workouts and extreme sessions.",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
          <path
            fill="currentColor"
            d="M4 7h16v2H4V7m0 4h16v2H4v-2m0 4h16v2H4v-2"
          />
        </svg>
      ),
    },
    {
      title: "Performance Tested",
      description:
        "Tested by athletes to deliver comfort, strength, and long-lasting durability.",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
          <path
            fill="currentColor"
            d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4m-8 0a4 4 0 1 0-4-4 4 4 0 0 0 4 4m0 2c-3.33 0-6 1.67-6 5v2h8v-2.35A5.78 5.78 0 0 1 8 15m8 0c-.29 0-.61 0-.94.05A5.36 5.36 0 0 1 16 19.35V21h8v-2c0-3.33-4.67-5-8-5"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-12 text-neutral-900 sm:py-16 lg:py-20 xl:py-24">

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:gap-8 sm:px-6 lg:gap-10 lg:px-14">
        <div className="flex flex-col items-center gap-2 sm:gap-3 lg:gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-red-600">
            Why Neversore
          </span>
          <div className="space-y-1 sm:space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-[0.08em] text-neutral-900 sm:text-3xl lg:text-4xl xl:text-5xl">
              Built for Performance.
            </h2>
            <p className="text-xl font-black uppercase tracking-[0.08em] text-red-600 sm:text-2xl lg:text-3xl xl:text-5xl">
              Designed for Power.
            </p>
          </div>
          <div className="h-px w-16 bg-red-600" />
          <p className="max-w-2xl text-xs text-neutral-600 sm:text-sm">
            Engineered gym wear that supports your strength, endurance, and intensity.
            No compromises. Just elite results.
          </p>
        </div>

        <div className="grid w-full gap-4 grid-cols-1 sm:gap-5 sm:grid-cols-2 lg:gap-6 lg:grid-cols-4">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)] sm:p-6"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 sm:h-12 sm:w-12">
                {item.icon}
              </div>
              <h3 className="relative mt-3 text-xs font-bold uppercase tracking-[0.1em] text-neutral-900 sm:mt-5 sm:text-sm">
                {item.title}
              </h3>
              <p className="relative mt-2 text-xs text-neutral-600 sm:mt-3 sm:text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        <a
          href="/best-sellers"
          className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-red-600 transition-colors hover:text-red-700 sm:gap-3"
        >
          Experience the collection
          <span className="text-base transition-transform duration-200 group-hover:translate-x-1">→</span>
        </a>
      </div>
    </section>
  );
}
