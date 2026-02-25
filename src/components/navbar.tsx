"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useAuth } from "@/context/auth-context";

const navLinks = [
  { label: "Upper", href: "/upper" },
  { label: "Bottom", href: "/bottom" },
  { label: "Active", href: "/active" },
  { label: "Casual", href: "/casual" },
];

const drawerLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/upper" },
  { label: "Categories", href: "/" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "My Account", href: "/account" },
  { label: "Track Order", href: "/account?tab=orders" },
  { label: "Contact Us", href: "/" },
];

export default function Navbar() {
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { user, profile, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuToggle = () => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      setTimeout(() => {
        setMenuVisible(false);
      }, 300);
    } else {
      setMenuVisible(true);
      requestAnimationFrame(() => {
        setMobileMenuOpen(true);
      });
      setSearchOpen(false);
    }
  };

  const handleCloseMenu = () => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      setMenuVisible(false);
    }, 300);
  };

  return (
    <>
      {/* Desktop & Tablet Navbar */}
      <header className={`hidden md:block w-full bg-white z-40 transition-shadow duration-200 ${scrolled ? "shadow-[0_4px_12px_rgba(0,0,0,0.08)]" : "shadow-[0_2px_8px_rgba(0,0,0,0.04)]"}`}>
        <nav className="flex w-full flex-wrap items-center justify-between gap-6 px-6 py-4 text-[#111111] sm:px-10 lg:px-14">
          {/* Left: Logo and Products */}
          <div className="flex items-center gap-6">
            <Link href="/" className="h-9 w-auto">
              <Image
                src="/newLogo.jpeg"
                alt="Neversore logo"
                width={300}
                height={300}
                priority
                className="h-9 w-auto"
              />
            </Link>
            <div className="relative hidden lg:block">
              <div className="group relative inline-flex items-center">
                <button
                  type="button"
                  className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#111111] transition-colors hover:text-[#cc071e]"
                >
                  Products
                </button>
                <div className="absolute left-0 top-full z-50 w-130 translate-y-2 rounded-2xl border border-[#e5e5e5] bg-white p-6 text-left shadow-[0_12px_30px_rgba(0,0,0,0.08)] opacity-0 transition-all duration-200 ease-out pointer-events-none group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <ul className="grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-[0.2em] text-[#666666]">
                    {navLinks.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="inline-flex w-full items-center justify-between rounded-xl border border-transparent px-4 py-3 transition-all hover:border-[#e5e5e5] hover:text-[#cc071e] hover:bg-[#f9f9f9]"
                        >
                          {link.label}
                          <span className="text-[0.6rem] tracking-[0.3em] text-[#666666]">→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Search Bar */}
          <div className="relative hidden lg:flex items-center flex-1 max-w-sm mx-6">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-[#e5e5e5] rounded-3xl bg-[#f9f9f9] text-sm placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#cc071e] focus:border-transparent focus:bg-white transition-all"
            />
            <button
              type="button"
              className="absolute right-3 p-2 text-[#666666] hover:text-[#111111] transition-colors"
              aria-label="Search"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27A6 6 0 1 0 14 15.5l.27.28v.79l5 5L20.49 19zm-6 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8"
                />
              </svg>
            </button>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-2 lg:gap-4 text-[#111111]">
            <Link
              href="/wishlist"
              className="relative rounded-full p-2.5 lg:p-2 transition-colors hover:bg-[#f3f3f3]"
              aria-label="Wishlist"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 lg:h-6 lg:w-6">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
              {mounted && wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#cc071e] px-1 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="relative rounded-full p-2.5 lg:p-2 transition-colors hover:bg-[#f3f3f3]"
              aria-label="Cart"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 lg:h-6 lg:w-6">
                <path
                  fill="currentColor"
                  d="M7 4h-2l-1 2v2h2l3 9h9l3-11H8.42zM10 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0m8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
                />
              </svg>
              {mounted && itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#cc071e] px-1 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
            {/* Auth: Login Button or Avatar */}
            {mounted && user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="rounded-full p-2.5 lg:p-2 transition-colors hover:bg-[#f3f3f3] flex items-center gap-2"
                  aria-label="Account"
                >
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name || "User"}
                      width={24}
                      height={24}
                      className="h-5 w-5 lg:h-6 lg:w-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-5 w-5 lg:h-6 lg:w-6 rounded-full bg-[#cc071e] flex items-center justify-center text-white text-xs font-bold">
                      {(profile?.full_name || user?.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                {profileMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setProfileMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-[#e5e5e5] shadow-[0_12px_30px_rgba(0,0,0,0.12)] z-40 overflow-hidden">
                      <div className="px-4 py-3 border-b border-[#f3f3f3]">
                        <p className="text-sm font-bold text-[#111111] truncate">
                          {profile?.full_name || "User"}
                        </p>
                        <p className="text-xs text-[#666666] truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-3 text-sm text-[#111111] hover:bg-[#f3f3f3] transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      <Link
                        href="/account?tab=orders"
                        className="block px-4 py-3 text-sm text-[#111111] hover:bg-[#f3f3f3] transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Track Order
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-[#cc071e] hover:bg-[#f3f3f3] transition-colors border-t border-[#f3f3f3]"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-full px-4 py-2 bg-[#cc071e] text-white font-bold text-xs uppercase tracking-[0.15em] hover:bg-[#a80618] transition-colors shadow-sm"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                  <path
                    fill="currentColor"
                    d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5m0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5"
                  />
                </svg>
                <span className="hidden lg:inline">Login</span>
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Navbar - Premium 2-Row Layout */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white z-40 w-full border-b border-[#e5e5e5]" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        {/* ROW 1: Main Navigation */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#f3f3f3]">
          {/* Left: Hamburger Menu */}
          <button
            onClick={handleMenuToggle}
            className="rounded-full p-2.5 -ml-2.5 transition-all hover:bg-[#f3f3f3]"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 text-[#111111]">
              {mobileMenuOpen ? (
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                />
              ) : (
                <path
                  fill="currentColor"
                  d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
                />
              )}
            </svg>
          </button>

          {/* Center: Logo */}
          <Link href="/" className="h-8 w-auto flex-1 flex justify-center">
            <Image
              src="/newLogo.jpeg"
              alt="Neversore"
              width={300}
              height={300}
              priority
              className="h-8 w-auto"
            />
          </Link>

          {/* Right: Search Icon + Cart Icon + Account Icon */}
          <div className="flex items-center gap-1">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="rounded-full p-2.5 transition-all hover:bg-[#f3f3f3]"
              aria-label="Search"
              aria-expanded={searchOpen}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 text-[#111111]">
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27A6 6 0 1 0 14 15.5l.27.28v.79l5 5L20.49 19zm-6 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8"
                />
              </svg>
            </button>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative rounded-full p-2.5 transition-all hover:bg-[#f3f3f3]"
              aria-label="Cart"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 text-[#111111]">
                <path
                  fill="currentColor"
                  d="M7 4h-2l-1 2v2h2l3 9h9l3-11H8.42zM10 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0m8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
                />
              </svg>
              {mounted && itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#cc071e] px-1.5 text-xs font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth: Login Button or Avatar (Mobile) */}
            {mounted && user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="relative rounded-full p-2.5 -mr-2.5 transition-all hover:bg-[#f3f3f3]"
                  aria-label="Account"
                >
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name || "User"}
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-[#cc071e] flex items-center justify-center text-white text-xs font-bold">
                      {(profile?.full_name || user?.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                </button>

                {/* Mobile Dropdown Menu */}
                {profileMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setProfileMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-[#e5e5e5] shadow-[0_12px_30px_rgba(0,0,0,0.12)] z-40 overflow-hidden">
                      <div className="px-4 py-3 border-b border-[#f3f3f3]">
                        <p className="text-sm font-bold text-[#111111] truncate">
                          {profile?.full_name || "User"}
                        </p>
                        <p className="text-xs text-[#666666] truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-3 text-sm text-[#111111] hover:bg-[#f3f3f3] transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      <Link
                        href="/account?tab=orders"
                        className="block px-4 py-3 text-sm text-[#111111] hover:bg-[#f3f3f3] transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Track Order
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-[#cc071e] hover:bg-[#f3f3f3] transition-colors border-t border-[#f3f3f3]"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-full px-3 py-2 -mr-2.5 bg-[#cc071e] text-white font-bold text-xs uppercase tracking-[0.15em] hover:bg-[#a80618] transition-colors"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                  <path
                    fill="currentColor"
                    d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5m0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* ROW 2: Search Bar - Animated Dropdown */}
        {searchOpen && (
          <div className="px-4 py-3 border-b border-[#f3f3f3] animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="relative w-full">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#666666]">
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27A6 6 0 1 0 14 15.5l.27.28v.79l5 5L20.49 19zm-6 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8"
                />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-3 border border-[#e5e5e5] rounded-3xl bg-[#f9f9f9] text-sm placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#cc071e] focus:border-transparent focus:bg-white transition-all"
              />
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer - Premium Sliding Drawer */}
      {menuVisible && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-30 md:hidden"
            onClick={handleCloseMenu}
            style={{
              top: searchOpen ? "170px" : "10px",
              opacity: mobileMenuOpen ? 1 : 0,
              transition: "opacity 300ms ease-out",
              pointerEvents: mobileMenuOpen ? "auto" : "none",
            }}
          />

          {/* Drawer */}
          <div
            className="fixed left-0 top-0 bottom-0 bg-white z-40 w-72 max-w-[85vw] shadow-lg md:hidden flex flex-col border-r border-[#e5e5e5]"
            style={{
              paddingTop: searchOpen ? "170px" : "10px",
              transform: mobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
              opacity: mobileMenuOpen ? 1 : 0,
              transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease-out",
            }}
          >
            {/* Drawer Header with Close Button - Fixed at top */}
            <div className="shrink-0 bg-white border-b border-[#f3f3f3] p-4 flex items-center justify-between" >
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#666666]">SHOP</h3>
              <button
                onClick={handleCloseMenu}
                className="rounded-full p-2 transition-all hover:bg-[#f3f3f3]"
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 text-[#111111]">
                  <path
                    fill="currentColor"
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                  />
                </svg>
              </button>
            </div>

            {/* Drawer Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-2">
                {/* Categories Section */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#666666] mb-4">Categories</h3>
                  <div className="space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="block px-4 py-3 rounded-lg text-sm font-semibold text-[#111111] transition-all hover:text-[#cc071e] hover:bg-[#f3f3f3]"
                        onClick={handleCloseMenu}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#e5e5e5] my-6" />

                {/* Main Menu Section */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#666666] mb-4">Menu</h3>
                  <div className="space-y-1">
                    {drawerLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="block px-4 py-3 rounded-lg text-sm font-semibold text-[#111111] transition-all hover:text-[#cc071e] hover:bg-[#f3f3f3]"
                        onClick={handleCloseMenu}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#e5e5e5] my-6" />

                {/* Wishlist Quick Access */}
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-[#111111] transition-all hover:text-[#cc071e] hover:bg-[#f3f3f3]"
                  onClick={handleCloseMenu}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                    <path
                      fill="currentColor"
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    />
                  </svg>
                  Wishlist
                  {mounted && wishlistCount > 0 && (
                    <span className="ml-auto bg-[#cc071e] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Spacer for fixed navbar */}
      <div className={`md:hidden transition-all duration-300 ${searchOpen ? "h-35" : "h-2.5"}`} />
    </>
  );
}
