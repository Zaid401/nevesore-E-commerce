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
    <section className="relative overflow-hidden bg-[#0e0f10] py-24 text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(255,255,255,0.05)_1px,_transparent_1px),linear-gradient(180deg,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:240px_240px] opacity-20" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-red-500">
            Why Neversore
          </span>
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase tracking-[0.08em] text-white sm:text-5xl">
              Built for Performance.
            </h2>
            <p className="text-3xl font-black uppercase tracking-[0.08em] text-red-500 sm:text-5xl">
              Designed for Power.
            </p>
          </div>
          <div className="h-px w-16 bg-red-600" />
          <p className="max-w-2xl text-sm text-neutral-300">
            Engineered gym wear that supports your strength, endurance, and intensity.
            No compromises. Just elite results.
          </p>
        </div>

        <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-left shadow-[0_25px_60px_rgba(0,0,0,0.45)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_60%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-red-200">
                {item.icon}
              </div>
              <h3 className="relative mt-5 text-sm font-bold uppercase tracking-[0.1em] text-white">
                {item.title}
              </h3>
              <p className="relative mt-3 text-sm text-neutral-400">{item.description}</p>
            </div>
          ))}
        </div>

        <a
          href="#"
          className="group inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.1em] text-red-500 transition-colors hover:text-red-400"
        >
          Experience the collection
          <span className="text-base transition-transform duration-200 group-hover:translate-x-1">→</span>
        </a>
      </div>
    </section>
  );
}
