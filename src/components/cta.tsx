export default function CallToAction() {
  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-gradient-to-r from-red-600 via-red-700 to-red-900 p-10 text-white shadow-[0_30px_60px_rgba(139,0,0,0.35)] sm:p-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2 className="text-3xl font-extrabold uppercase tracking-[0.3em] sm:text-4xl">
            Join the Movement
          </h2>
          <p className="mt-4 text-base text-red-100 sm:text-lg">
            Become part of the elite. Get exclusive access to drops, workout protocols, and 10% off your first order.
          </p>
          <form className="mt-8 flex w-full flex-col gap-4 sm:flex-row sm:items-center">
            <label htmlFor="cta-email" className="sr-only">
              Email address
            </label>
            <input
              id="cta-email"
              type="email"
              placeholder="Enter your email"
              className="h-14 w-full rounded-full border border-white/15 bg-white/10 px-6 text-sm uppercase tracking-[0.2em] text-white placeholder:text-red-100/70 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button
              type="submit"
              className="h-14 min-w-[160px] rounded-full bg-white px-8 text-sm font-bold uppercase tracking-[0.2em] text-black transition-transform duration-200 hover:-translate-y-0.5 hover:bg-red-50"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
