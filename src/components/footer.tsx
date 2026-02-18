import Image from "next/image";
import Link from "next/link";

const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "#" },
      { label: "New Arrivals", href: "#" },
      { label: "Best Sellers", href: "#" },
      { label: "Activewear", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "#" },
      { label: "Shipping Info", href: "#" },
      { label: "Returns", href: "#" },
      { label: "Size Guide", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Athletes", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Track Order", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Store Locator", href: "#" },
    ],
  },
];

const socialIcons = [
  {
    label: "Community",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path
          fill="currentColor"
          d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4m-8 0a4 4 0 1 0-4-4 4 4 0 0 0 4 4m0 2c-3.33 0-10 1.67-10 5v2h8v-2.35A5.78 5.78 0 0 1 6 15m8 0c-.29 0-.61 0-.94.05A5.36 5.36 0 0 1 16 19.35V21h8v-2c0-3.33-6.67-5-10-5"
        />
      </svg>
    ),
  },
  {
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path
          fill="currentColor"
          d="M21.6 7.2a2.22 2.22 0 0 0-1.56-1.58C18.6 5.25 12 5.25 12 5.25s-6.6 0-8.04.37A2.22 2.22 0 0 0 2.4 7.2 23.23 23.23 0 0 0 2 12a23.23 23.23 0 0 0 .4 4.8 2.22 2.22 0 0 0 1.56 1.58c1.44.37 8.04.37 8.04.37s6.6 0 8.04-.37A2.22 2.22 0 0 0 21.6 16.8 23.23 23.23 0 0 0 22 12a23.23 23.23 0 0 0-.4-4.8M10 15.27V8.73L15.2 12z"
        />
      </svg>
    ),
  },
  {
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path
          fill="currentColor"
          d="M12 2.16c3.2 0 3.58 0 4.85.07a6.37 6.37 0 0 1 2.14.41 4 4 0 0 1 2.32 2.32 6.37 6.37 0 0 1 .41 2.14c.07 1.27.07 1.65.07 4.85s0 3.58-.07 4.85a6.37 6.37 0 0 1-.41 2.14 4 4 0 0 1-2.32 2.32 6.37 6.37 0 0 1-2.14.41c-1.27.07-1.65.07-4.85.07s-3.58 0-4.85-.07a6.37 6.37 0 0 1-2.14-.41 3.91 3.91 0 0 1-1.42-.92 3.91 3.91 0 0 1-.92-1.42 6.37 6.37 0 0 1-.41-2.14C2.16 15.58 2.16 15.2 2.16 12s0-3.58.07-4.85a6.37 6.37 0 0 1 .41-2.14A4 4 0 0 1 5 2.69a6.37 6.37 0 0 1 2.14-.41C8.42 2.21 8.8 2.16 12 2.16m0 1.44c-3.14 0-3.5 0-4.74.07a4.94 4.94 0 0 0-1.66.32 2.35 2.35 0 0 0-1.35 1.35 4.94 4.94 0 0 0-.32 1.66c-.07 1.24-.07 1.6-.07 4.74s0 3.5.07 4.74a4.94 4.94 0 0 0 .32 1.66 2.35 2.35 0 0 0 1.35 1.35 4.94 4.94 0 0 0 1.66.32c1.24.07 1.6.07 4.74.07s3.5 0 4.74-.07a4.94 4.94 0 0 0 1.66-.32 2.35 2.35 0 0 0 1.35-1.35 4.94 4.94 0 0 0 .32-1.66c.07-1.24.07-1.6.07-4.74s0-3.5-.07-4.74a4.94 4.94 0 0 0-.32-1.66 2.35 2.35 0 0 0-1.35-1.35 4.94 4.94 0 0 0-1.66-.32c-1.24-.07-1.6-.07-4.74-.07m0 3.24a5.16 5.16 0 1 1-5.16 5.16A5.16 5.16 0 0 1 12 6.84m0 8.52a3.36 3.36 0 1 0-3.36-3.36A3.36 3.36 0 0 0 12 15.36m5.42-8.92a1.2 1.2 0 1 1-1.2-1.2 1.2 1.2 0 0 1 1.2 1.2"
        />
      </svg>
    ),
  },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookies", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-black text-neutral-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 sm:px-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))]">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Image src="/logo.png" alt="Neversore logo" width={300} height={300} className="h-8 w-auto" />
            </div>
            <p className="max-w-xs text-sm text-neutral-400">
              The world isn&apos;t built for the weak. We build for the ones who keep going when it hurts.
            </p>
            <div className="flex items-center gap-4">
              {socialIcons.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  aria-label={item.label}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-red-500/80 hover:text-red-400"
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>
          {footerColumns.map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-white">
                {column.title}
              </h3>
              <ul className="flex flex-col gap-3 text-sm text-neutral-400">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.35em] text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Neversore Performance Apparel. All rights reserved.</span>
          <div className="flex flex-wrap items-center gap-4">
            {legalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
