"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useCart } from "@/context/cart-context";

const FREE_SHIPPING_THRESHOLD = 999;

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState(false);

  const discount = useMemo(() => {
    if (!couponApplied) return 0;
    return subtotal * 0.1;
  }, [couponApplied, subtotal]);

  const total = Math.max(0, subtotal - discount);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const applyCoupon = () => {
    const normalized = couponCode.trim().toUpperCase();
    if (normalized === "NEVER10") {
      setCouponApplied(true);
      setCouponError(false);
    } else {
      setCouponApplied(false);
      setCouponError(true);
    }
  };

  return (
    <div className="bg-[#faf9f7] text-[#111111] min-h-screen">
      <Navbar />

      <main>
        {/* ── HERO HEADER ── */}
        <section className="relative overflow-hidden border-b border-[#e0ddd8] pt-24 md:pt-28">
          <span
            className="pointer-events-none select-none absolute bottom-[-0.15em] right-[-0.04em] text-transparent font-black leading-none tracking-wide hidden sm:block"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(80px, 16vw, 240px)",
              WebkitTextStroke: "1.5px #e8e5e0",
            }}
          >
            CART
          </span>

          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pb-14 md:pb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-[10px] font-medium tracking-[0.22em] uppercase rounded-full px-3.5 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Your Bag
              </div>
              <h1
                className="leading-[0.92] tracking-wide text-[#111111] mb-4"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(48px, 9vw, 100px)",
                }}
              >
                Your Cart
              </h1>
              <p className="text-base font-light text-[#444444]">
                Premium essentials curated for peak performance.
              </p>
            </div>

            <div className="md:text-right flex-shrink-0 pb-1 space-y-2">
              <p
                className="leading-none text-[#111111] tracking-wide"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(40px, 6vw, 64px)",
                }}
              >
                {items.length}
              </p>
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#888888]">
                {items.length === 1 ? "Item" : "Items"}
              </p>
            </div>
          </div>
        </section>

        {/* ── BODY ── */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 md:py-14 pb-32 lg:pb-14">

          {/* ── EMPTY STATE ── */}
          {items.length === 0 ? (
            <div className="rounded-2xl border border-[#e0ddd8] bg-white overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <div className="bg-[#111111] px-6 py-3.5 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-auto text-[11px] tracking-[0.18em] uppercase text-white/30">
                  Empty Bag
                </span>
              </div>
              <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                <p
                  className="text-[#111111] mb-2 leading-tight"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(32px, 5vw, 48px)",
                    letterSpacing: "0.04em",
                  }}
                >
                  Your Cart is <span className="text-red-600">Empty</span>
                </p>
                <p className="text-sm font-light text-[#888888] mb-8 max-w-sm">
                  Explore our latest drops and find your next set of performance gear.
                </p>
                <Link
                  href="/"
                  className="group inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-medium tracking-[0.15em] uppercase rounded-full px-7 py-3.5 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Continue Shopping
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

              {/* ── CART ITEMS ── */}
              <div className="lg:col-span-8 space-y-4">
                {/* Free shipping bar */}
                <div className="rounded-2xl border border-[#e0ddd8] bg-white px-6 py-5">
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-[#888888]">
                      Free Shipping Progress
                    </p>
                    <p className="text-[11px] font-medium tracking-[0.1em] uppercase text--[#111111]">
                      {Math.round(freeShippingProgress)}%
                    </p>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#f0edea]">
                    <div
                      className="h-1.5 rounded-full bg-red-600 transition-all duration-500"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                  <p className="mt-2.5 text-xs font-light text-[#888888]">
                    {remainingForFreeShipping > 0 ? (
                      <>Add <span className="text-[#111111] font-medium">&#8377;{remainingForFreeShipping.toLocaleString("en-IN")}</span> more to unlock free shipping.</>
                    ) : (
                      <span className="text-[#111111] font-medium">🎉 You've unlocked free shipping!</span>
                    )}
                  </p>
                </div>

                {/* Items */}
                {items.map((item) => (
                  <article
                    key={item.variant_id}
                    className="group rounded-2xl border border-[#e0ddd8] bg-white hover:border-red-200 hover:shadow-[0_8px_32px_rgba(212,0,31,0.06)] transition-all duration-300 overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-5 sm:p-6">
                      {/* Product image */}
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-[#f0edea] border border-[#e0ddd8]">
                        <Image
                          src={item.image}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <h2
                          className="text-[#111111] tracking-wide truncate"
                          style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: "clamp(17px, 2.5vw, 21px)",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {item.product_name}
                        </h2>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#888888] bg-[#f0edea] border border-[#e0ddd8] rounded-full px-2.5 py-1">
                            Size: {item.size_label}
                          </span>
                          <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#888888] bg-[#f0edea] border border-[#e0ddd8] rounded-full px-2.5 py-1">
                            {item.color_name}
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-light text-[#888888]">
                          &#8377;{item.price.toLocaleString("en-IN")} each
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-3">
                        {/* Quantity stepper */}
                        <div className="flex items-center border border-[#e0ddd8] rounded-full overflow-hidden bg-[#faf9f7]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                            className="w-9 h-9 text-base text-[#888888] hover:text-[#111111] hover:bg-[#f0edea] transition-colors duration-150 flex items-center justify-center"
                          >
                            −
                          </button>
                          <span
                            className="w-8 text-center text-sm font-medium text-[#111111]"
                            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                            className="w-9 h-9 text-base text-[#888888] hover:text-[#111111] hover:bg-[#f0edea] transition-colors duration-150 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.variant_id)}
                          className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#cccccc] hover:text-red-600 transition-colors duration-150"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Line total */}
                      <div
                        className="text-right flex-shrink-0 hidden sm:block"
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "clamp(18px, 2vw, 22px)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        &#8377;{(item.price * item.quantity).toLocaleString("en-IN")}
                      </div>
                    </div>

                    {/* Mobile line total */}
                    <div className="sm:hidden flex items-center justify-between px-5 py-3 border-t border-[#e0ddd8] bg-[#faf9f7]">
                      <span className="text-[10px] tracking-[0.18em] uppercase text-[#888888]">Subtotal</span>
                      <span
                        className="text-[#111111]"
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "18px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        &#8377;{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              {/* ── ORDER SUMMARY ── */}
              <div className="lg:col-span-4">
                <div className="rounded-2xl border border-[#e0ddd8] bg-white overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] lg:sticky lg:top-24">
                  {/* Mac-style header */}
                  <div className="bg-[#111111] px-6 py-3.5 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    <span className="ml-auto text-[11px] tracking-[0.18em] uppercase text-white/30">
                      Order Summary
                    </span>
                  </div>

                  <div className="p-6">
                    {/* Summary rows */}
                    <div className="space-y-3 mb-5">
                      {[
                        {
                          label: "Subtotal",
                          value: `₹${subtotal.toLocaleString("en-IN")}`,
                          highlight: true,
                        },
                        {
                          label: "Shipping",
                          value: "At checkout",
                          highlight: false,
                        },
                        {
                          label: "Discount",
                          value: discount > 0 ? `−₹${discount.toLocaleString("en-IN")}` : "—",
                          highlight: false,
                          red: discount > 0,
                        },
                        {
                          label: "Tax",
                          value: "At checkout",
                          highlight: false,
                        },
                      ].map((row) => (
                        <div key={row.label} className="flex items-center justify-between">
                          <p className="text-[11px] tracking-[0.15em] uppercase text-[#888888]">
                            {row.label}
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              row.red
                                ? "text-red-600"
                                : row.highlight
                                ? "text-[#111111]"
                                : "text-[#888888]"
                            }`}
                          >
                            {row.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="h-px bg-[#e0ddd8] mb-5" />

                    {/* Total */}
                    <div className="flex items-center justify-between mb-6">
                      <p className="text-[11px] tracking-[0.2em] uppercase text-[#888888]">Total</p>
                      <p
                        className="text-[#111111] tracking-wide"
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "clamp(22px, 3vw, 28px)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        &#8377;{total.toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* Coupon */}
                    <div className="mb-5">
                      <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#888888] mb-2">
                        Discount Code
                      </p>
                      <div className="flex gap-2">
                        <input
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            setCouponError(false);
                          }}
                          placeholder="e.g. NEVER10"
                          className="flex-1 h-10 rounded-full border border-[#e0ddd8] bg-[#faf9f7] px-4 text-xs text-[#111111] placeholder:text-[#bbbbbb] focus:border-red-400 focus:outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={applyCoupon}
                          className="h-10 px-4 rounded-full border border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-[10px] font-medium tracking-[0.15em] uppercase transition-all duration-200 flex-shrink-0"
                        >
                          Apply
                        </button>
                      </div>
                      {couponApplied && (
                        <p className="mt-2 text-[11px] font-medium text-red-600 tracking-wide">
                          ✓ 10% discount applied
                        </p>
                      )}
                      {couponError && (
                        <p className="mt-2 text-[11px] font-medium text-[#888888] tracking-wide">
                          Invalid code. Try NEVER10.
                        </p>
                      )}
                    </div>

                    <div className="h-px bg-[#e0ddd8] mb-5" />

                    {/* CTAs */}
                    <div className="space-y-3">
                      <Link
                        href="/checkout"
                        className="group flex items-center justify-center gap-2.5 w-full bg-red-600 hover:bg-red-700 text-white text-[11px] font-medium tracking-[0.15em] uppercase rounded-full py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(212,0,31,0.3)]"
                      >
                        Proceed to Checkout
                        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                      </Link>
                      <Link
                        href="/"
                        className="flex items-center justify-center w-full border border-[#e0ddd8] hover:border-red-200 text-[#888888] hover:text-red-600 text-[11px] font-medium tracking-[0.15em] uppercase rounded-full py-3.5 transition-all duration-200"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      {/* ── MOBILE STICKY CHECKOUT BAR ── */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-[#e0ddd8] bg-white/95 backdrop-blur-sm px-5 py-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] lg:hidden z-50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#888888]">Total</p>
            <p
              className="text-[#111111] tracking-wide"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "22px",
                letterSpacing: "0.04em",
              }}
            >
              &#8377;{total.toLocaleString("en-IN")}
            </p>
          </div>
          <Link
            href="/checkout"
            className="group flex items-center justify-center gap-2.5 w-full bg-red-600 hover:bg-red-700 text-white text-[11px] font-medium tracking-[0.15em] uppercase rounded-full py-3.5 transition-all duration-200"
          >
            Proceed to Checkout
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
}