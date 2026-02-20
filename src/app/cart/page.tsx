"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useCart } from "@/context/cart-context";

const FREE_SHIPPING_THRESHOLD = 150;

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

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold uppercase tracking-[0.2em]">Your Cart</h1>
          <p className="mt-2 text-sm text-[#555555]">Premium essentials curated for peak performance.</p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e5e5e5] bg-white px-6 py-16 text-center shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <p className="text-lg font-semibold">Your cart is currently empty.</p>
            <p className="mt-2 text-sm text-[#555555]">Explore our latest drops and find your next set.</p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-full border border-[#cc071e] px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#cc071e] transition-all hover:bg-[#cc071e] hover:text-white"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.color}-${item.size}`}
                  className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-[#f1f1f1]">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold">{item.name}</h2>
                      <p className="mt-1 text-sm text-[#555555]">
                        Size: <span className="font-semibold">{item.size}</span> | Color:{" "}
                        <span className="font-semibold">{item.color}</span>
                      </p>
                      <p className="mt-2 text-sm text-[#555555]">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center rounded-full border border-[#e5e5e5] bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)}
                          className="h-10 w-10 text-sm font-semibold text-[#555555] hover:text-[#111111]"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)}
                          className="h-10 w-10 text-sm font-semibold text-[#555555] hover:text-[#111111]"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id, item.color, item.size)}
                        className="text-xs font-semibold uppercase tracking-[0.2em] text-[#cc071e]"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="text-right text-sm font-semibold text-[#111111]">
                      ${ (item.price * item.quantity).toFixed(2) }
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] lg:sticky lg:top-24">
                <div className="mb-6">
                  <div className="mb-3 flex items-center justify-between text-sm font-semibold text-[#555555]">
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
                      Add ${remainingForFreeShipping.toFixed(2)} to unlock free shipping.
                    </p>
                  ) : (
                    <p className="mt-2 text-xs font-semibold text-[#cc071e]">
                      You have unlocked free shipping.
                    </p>
                  )}
                </div>

                <h2 className="text-lg font-bold uppercase tracking-[0.15em]">Order Summary</h2>
                <div className="mt-4 space-y-3 text-sm text-[#555555]">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#111111]">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Discount</span>
                    <span>{discount > 0 ? `-$${discount.toFixed(2)}` : "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="my-4 h-px bg-[#e5e5e5]" />

                <div className="flex items-center justify-between text-base font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      value={couponCode}
                      onChange={(event) => setCouponCode(event.target.value)}
                      placeholder="Enter discount code"
                      className="h-12 flex-1 rounded-full border border-[#e5e5e5] bg-white px-4 text-sm focus:border-[#cc071e] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="h-12 rounded-full border border-[#cc071e] px-4 text-xs font-bold uppercase tracking-[0.2em] text-[#cc071e] transition-all hover:bg-[#cc071e] hover:text-white"
                    >
                      Apply
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-xs font-semibold text-[#cc071e]">Coupon applied successfully.</p>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    href="/checkout"
                    className="block w-full rounded-full bg-[#cc071e] py-4 text-center text-xs font-bold uppercase tracking-[0.25em] text-white transition-all hover:bg-red-700 hover:shadow-[0_12px_30px_rgba(204,7,30,0.3)]"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    href="/"
                    className="block w-full rounded-full border border-[#cc071e] py-4 text-center text-xs font-bold uppercase tracking-[0.25em] text-[#cc071e] transition-all hover:bg-[#cc071e] hover:text-white"
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
        <div className="fixed bottom-0 left-0 right-0 border-t border-[#e5e5e5] bg-white p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] lg:hidden">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-3 block w-full rounded-full bg-[#cc071e] py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-white"
          >
            Proceed to Checkout
          </Link>
        </div>
      )}

      <Footer />
    </main>
  );
}
