import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Upper", href: "/upper" },
  { label: "Bottom", href: "/bottom" },
  { label: "Active", href: "/active" },
  { label: "Casual", href: "/casual" },
];

export default function Navbar() {
  return (
    <header className="w-full bg-white shadow-[0_6px_25px_rgba(0,0,0,0.08)] z-10">
      <nav className="flex w-full flex-wrap items-center justify-between gap-6 px-6 py-4 text-neutral-900 sm:px-10 lg:px-14">
        <div className="flex items-center gap-6">
            <Link href="/" className="h-9 w-auto">
          <Image
            src="/logo.png"
            alt="Neversore logo"
            width={300}
            height={300}
            priority
            className="h-9 w-auto"
          />
          </Link>
          <div className="relative hidden md:block">
            <div className="group relative inline-flex items-center">
              <button
                type="button"
                className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-900 transition-colors hover:text-neutral-600"
              >
                Products
              </button>
              <div className="absolute left-0 top-full z-50 w-[520px] translate-y-2 rounded-1xl border border-neutral-200/70 bg-white p-6 text-left shadow-[0_30px_60px_rgba(15,23,42,0.16)] opacity-0 transition-all duration-200 ease-out pointer-events-none group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <ul className="grid grid-cols-2 gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-700">
                  {navLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className={`inline-flex w-full items-center justify-between rounded-2xl border border-transparent px-4 py-3 transition-colors hover:border-neutral-200  hover:text-[#cc071e] ${
                          link.highlight ? "text-red-500" : ""
                        }`}
                      >
                        {link.label}
                        <span className="text-[0.6rem] tracking-[0.4em] text-neutral-400">&gt;</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-neutral-900">
          <button type="button" className="rounded-full p-2 transition-colors hover:bg-neutral-100" aria-label="Search">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              <path
                fill="currentColor"
                d="M15.5 14h-.79l-.28-.27A6 6 0 1 0 14 15.5l.27.28v.79l5 5L20.49 19zm-6 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8"
              />
            </svg>
          </button>
          <button
            type="button"
            className="relative rounded-full p-2 transition-colors hover:bg-neutral-100"
            aria-label="Cart"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              <path
                fill="currentColor"
                d="M7 4h-2l-1 2v2h2l3 9h9l3-11H8.42zM10 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0m8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
              />
            </svg>
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              3
            </span>
          </button>
          <Link href="/login" className="rounded-full p-2 transition-colors hover:bg-neutral-100" aria-label="Account">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              <path
                fill="currentColor"
                d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5m0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5"
              />
            </svg>
          </Link>
        </div>

        <div className="flex w-full items-center gap-4 overflow-x-auto border-t border-neutral-100 pt-4 text-sm font-medium uppercase tracking-[0.1em] text-neutral-700 md:hidden">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className={`whitespace-nowrap border border-transparent px-4 py-2 transition-colors hover:border-neutral-200 hover:text-neutral-900 ${link.highlight ? "text-red-500" : ""}`}>
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
