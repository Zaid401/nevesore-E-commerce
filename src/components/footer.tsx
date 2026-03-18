import Image from "next/image";
import Link from "next/link";
import { FaFacebookF } from "react-icons/fa";

const footerColumns = [
  {
    title: "Shop",
    links: [
      //{ label: "Active Wear", href: "/active" },
      { label: "Cart", href: "/cart" },
      { label: "Wishlist", href: "/wishlist" },

      { label: "Best Sellers", href: "/best-sellers" },

    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Returns & Exchanges", href: "/returns-and-exchanges" },
      { label: "Shipping and Delivery", href: "/shipping-and-delivery" },

    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      //{ label: "Athletes", href: "#" },
      //{ label: "Careers", href: "#" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },


     
    ],
  },
  {
    title: "Help",
    links: [
    
      { label: "FAQ", href: "/#faq" },
      //{ label: "Store Locator", href: "#" },
      { label: "Offers", href: "/offers" },
      { label: "Leave a Feedback", href: "/leave-feedback" },

    ],
  },
];

const socialIcons = [
  {
    label: "facebook",
    href: "https://www.facebook.com/people/Neversore/61561600970274/?mibextid=wwXIfr&rdid=enxQn05PzLFrYYOi&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18mDzay9F8%2F%3Fmibextid%3DwwXIfr",
    icon: (
      <FaFacebookF className="h-5 w-5" aria-hidden="true" />
    ),
  },
  
  {
    label: "Instagram",
    href: "https://www.instagram.com/be.neversore?igsh=MWF4cTRmNDN1c3dwNA%3D%3",
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

  { label: "Cookies", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#F5F5F5] text-neutral-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16 lg:gap-16">
        <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))]">
          <div className="col-span-2 flex flex-col gap-5 sm:gap-6 lg:col-span-1">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/" aria-label="Neversore Home">
                <Image src="/darklogo.png" alt="Neversore logo" width={400} height={400} className="h-7 w-auto sm:h-8" />
              </Link>
            </div>

            <p className="max-w-xs text-xs text-gray-700 sm:text-sm">
              The world isn&apos;t built for the weak. We build for the ones who keep going when it hurts.
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              {socialIcons.map((item) => (
                <Link
                  key={item.label}
                  aria-label={item.label}
                  target="_blank"
                  href={item.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-700 transition-colors hover:border-red-500/80 hover:text-red-400 sm:h-12 sm:w-12"
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>
          {footerColumns.map((column) => (
            <div
              key={column.title}
              className={`flex flex-col gap-3 sm:gap-4 ${column.title === "Shop"
                ? "order-1"
                : column.title === "Support"
                  ? "order-2"
                  : column.title === "Company"
                    ? "order-3"
                    : "order-4"
                } sm:order-none`}
            >
              <h3 className="text-xs font-semibold uppercase  text-gray-800 sm:text-sm">
                {column.title}
              </h3>
              <ul className="flex flex-col gap-2 text-xs text-gray-700 sm:gap-3 sm:text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-[#cc071e]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-5 text-center text-[10px] uppercase text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pt-6 sm:text-left sm:text-xs">
          <span>© {new Date().getFullYear()} Neversore All rights reserved.</span>
          {/* <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end sm:gap-4">
            {legalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
          </div> */}
        </div>
      </div>
    </footer>
  );
}
