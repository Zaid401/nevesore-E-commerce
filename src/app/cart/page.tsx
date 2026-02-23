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

  const discount = useMemo(() => {
    if (!couponApplied) {
      return 0;
    }
    return subtotal * 0.1;
  }, [couponApplied, subtotal]);

  const total = Math.max(0, subtotal - discount);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const applyCoupon = () => {
    const normalized = couponCode.trim().toUpperCase();
    setCouponApplied(normalized === "NEVER10");
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8] text-[#111111]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:py-12 lg:px-8">
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-2xl font-extrabold uppercase tracking-[0.2em] sm:text-3xl lg:text-3xl">Your Cart</h1>
          <p className="mt-1 text-xs text-[#555555] sm:mt-2 sm:text-sm lg:text-sm">Premium essentials curated for peak performance.</p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e5e5e5] bg-white px-4 py-12 text-center shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:px-6 sm:py-16 lg:px-6 lg:py-16">
            <p className="text-base font-semibold sm:text-lg lg:text-lg">Your cart is currently empty.</p>
            <p className="mt-1 text-xs text-[#555555] sm:mt-2 sm:text-sm lg:text-sm">Explore our latest drops and find your next set.</p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center justify-center rounded-full border border-[#cc071e] px-6 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#cc071e] transition-all hover:bg-[#cc071e] hover:text-white sm:mt-6 sm:px-8 sm:py-3 lg:px-8 lg:py-3"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-4 sm:space-y-5 lg:space-y-6">
              {items.map((item) => (
                <div
                  key={item.variant_id}
                  className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-[#f1f1f1]">
                      <Image src={item.image} alt={item.product_name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold">{item.product_name}</h2>
                      <p className="mt-1 text-sm text-[#555555]">
                        Size: <span className="font-semibold">{item.size_label}</span> | Color:{" "}
                        <span className="font-semibold">{item.color_name}</span>
                      </p>
                      <p className="mt-2 text-sm text-[#555555]">&#8377;{item.price.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 sm:gap-3 lg:gap-4 lg:flex-row lg:items-center">
                      <div className="flex items-center rounded-full border border-[#e5e5e5] bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                          className="h-10 w-10 text-sm font-semibold text-[#555555] hover:text-[#111111]"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-semibold sm:w-10 sm:text-sm lg:w-10">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                          className="h-10 w-10 text-sm font-semibold text-[#555555] hover:text-[#111111]"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.variant_id)}
                        className="text-xs font-semibold uppercase tracking-[0.2em] text-[#cc071e]"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="text-right text-sm font-semibold text-[#111111]">
                      &#8377;{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-[#e5e5e5] bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:p-6 lg:sticky lg:top-24 lg:p-6">
                <div className="mb-4 sm:mb-6 lg:mb-6">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#555555] sm:mb-3 sm:text-sm lg:mb-3 lg:text-sm">
                    <span>Free shipping progress</span>
                    <span>{Math.round(freeShippingProgress)}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#f1f1f1]">
                    <div
                      className="h-2 rounded-full bg-[#cc071e] transition-all"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                  {remainingForFreeShipping > 0 ? (
                    <p className="mt-2 text-xs text-[#555555]">
                      Add &#8377;{remainingForFreeShipping.toLocaleString("en-IN")} to unlock free shipping.
                    </p>
                  ) : (
                    <p className="mt-1 text-xs font-semibold text-[#cc071e] sm:mt-2 lg:mt-2">
                      You have unlocked free shipping.
                    </p>
                  )}
                </div>

                <h2 className="text-base font-bold uppercase tracking-[0.15em] sm:text-lg lg:text-lg">Order Summary</h2>
                <div className="mt-3 space-y-2 text-xs text-[#555555] sm:mt-4 sm:space-y-3 sm:text-sm lg:mt-4">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#111111]">&#8377;{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Discount</span>
                    <span>{discount > 0 ? `-&#8377;${discount.toLocaleString("en-IN")}` : "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="my-3 h-px bg-[#e5e5e5] sm:my-4 lg:my-4" />

                <div className="flex items-center justify-between text-sm font-bold sm:text-base lg:text-base">
                  <span>Total</span>
                  <span>&#8377;{total.toLocaleString("en-IN")}</span>
                </div>

                <div className="mt-4 space-y-2 sm:mt-6 sm:space-y-3 lg:mt-6">
                  <div className="flex items-center gap-2">
                    <input
                      value={couponCode}
                      onChange={(event) => setCouponCode(event.target.value)}
                      placeholder="Enter discount code"
                      className="h-10 flex-1 rounded-full border border-[#e5e5e5] bg-white px-3 text-xs focus:border-[#cc071e] focus:outline-none sm:h-12 sm:px-4 sm:text-sm lg:h-12"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="h-10 rounded-full border border-[#cc071e] px-3 text-xs font-bold uppercase tracking-[0.2em] text-[#cc071e] transition-all hover:bg-[#cc071e] hover:text-white sm:h-12 sm:px-4 sm:text-sm lg:h-12"
                    >
                      Apply
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-xs font-semibold text-[#cc071e] sm:text-sm lg:text-sm">Coupon applied successfully.</p>
                  )}
                </div>

                <div className="mt-4 space-y-2 sm:mt-6 sm:space-y-3 lg:mt-6">
                  <Link
                    href="/checkout"
                    className="block w-full rounded-full bg-[#cc071e] py-3 text-center text-xs font-bold uppercase tracking-[0.25em] text-white transition-all hover:bg-red-700 hover:shadow-[0_12px_30px_rgba(204,7,30,0.3)] sm:py-4 sm:text-xs lg:py-4 lg:text-xs"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    href="/"
                    className="block w-full rounded-full border border-[#cc071e] py-3 text-center text-xs font-bold uppercase tracking-[0.25em] text-[#cc071e] transition-all hover:bg-[#cc071e] hover:text-white sm:py-4 sm:text-xs lg:py-4 lg:text-xs"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-[#e5e5e5] bg-white p-3 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] sm:p-4 lg:hidden">
          <div className="flex items-center justify-between text-xs font-semibold sm:text-sm">
            <span>Total</span>
            <span>&#8377;{total.toLocaleString("en-IN")}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-2 block w-full rounded-full bg-[#cc071e] py-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-white sm:mt-3 sm:py-3 sm:text-xs"
          >
            Proceed to Checkout
          </Link>
        </div>
      )}

      <Footer />
    </main>
  );
}
