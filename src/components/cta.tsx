export default function CallToAction() {
  return (
    <section className="bg-neutral-100 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-white p-12 shadow-[0_20px_80px_rgba(204,7,30,0.15)] sm:p-16 lg:p-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2 className="text-4xl font-black uppercase tracking-[0.15em] text-neutral-900 sm:text-5xl lg:text-6xl">
            Join the Movement
          </h2>
          <p className="mt-6 text-base text-neutral-600 sm:text-lg">
            Become part of the elite. Get exclusive access to drops, workout protocols, and{" "}
            <span className="font-bold text-red-600">10% off your first order.</span>
          </p>
          <form className="mt-10 flex w-full max-w-2xl flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
            <label htmlFor="cta-email" className="sr-only">
              Email address
            </label>
            <input
              id="cta-email"
              type="email"
              placeholder="Enter your email address"
              className="h-14 flex-1 rounded-full border border-neutral-200 bg-neutral-50 px-6 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
            <button
              type="submit"
              className="h-14 min-w-[160px] rounded-full bg-red-600 px-8 text-sm font-bold uppercase tracking-[0.15em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-lg"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-6 text-xs uppercase tracking-[0.15em] text-neutral-400">
            Unsubscribe anytime. Premium Quality Guaranteed.
          </p>
        </div>
      </div>
    </section>
  );
}
