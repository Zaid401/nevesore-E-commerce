"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useCart } from "@/context/cart-context";

const SHIPPING_STANDARD = 0;

const formatOrderNumber = () => {
  const base = Math.floor(100000 + Math.random() * 900000);
  return `NS-${base}`;
};

export default function ConfirmationPage() {
  const { items, subtotal } = useCart();
  const orderNumber = useMemo(() => formatOrderNumber(), []);
  const discount = 0;
  const shipping: number = SHIPPING_STANDARD;
  const tax = 0;
  const total = Math.max(0, subtotal + shipping + tax - discount);

  return (
    <main className="min-h-screen bg-[#f8f8f8] text-[#111111]">
      <Navbar />

      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-8 sm:py-10 lg:py-12">
        <div className="w-full rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-6 lg:p-8 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 lg:h-16 lg:w-16 items-center justify-center rounded-full bg-[#16a34a]/10 text-[#16a34a]">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 sm:h-8 sm:w-8 lg:h-8 lg:w-8">
                <path
                  fill="currentColor"
                  d="M9.55 17.3 4.9 12.65l1.4-1.4 3.25 3.25 7.55-7.55 1.4 1.4z"
                />
              </svg>
            </div>
            <h1 className="mt-3 sm:mt-4 lg:mt-4 text-xl sm:text-2xl lg:text-2xl font-extrabold uppercase tracking-[0.2em]">
              Order Confirmed!
            </h1>
            <p className="mt-2 text-xs sm:text-sm lg:text-sm text-[#555555]">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            <div className="mt-3 sm:mt-4 lg:mt-4 flex flex-col gap-1 text-xs sm:text-sm lg:text-sm text-[#555555]">
              <span>
                Order Number: <span className="font-semibold text-[#111111]">#{orderNumber}</span>
              </span>
              <span>Estimated delivery: 3-7 business days</span>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 lg:mt-8 space-y-4 sm:space-y-5 lg:space-y-6">
            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6">
              <h2 className="text-xs sm:text-xs lg:text-xs font-bold uppercase tracking-[0.2em] text-[#555555]">
                Order Details
              </h2>
              <div className="mt-3 sm:mt-4 lg:mt-4 space-y-3 sm:space-y-4 lg:space-y-4">
                {items.length === 0 ? (
                  <p className="text-xs sm:text-sm lg:text-sm text-[#555555]">Your cart is currently empty.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.variant_id} className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-[#f1f1f1]">
                        <Image src={item.image} alt={item.product_name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{item.product_name}</p>
                        <p className="text-xs text-[#555555]">
                          Size {item.size_label} | Qty {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="my-3 sm:my-4 lg:my-4 h-px bg-[#e5e5e5]" />

              <div className="space-y-2 sm:space-y-2 lg:space-y-2 text-xs sm:text-sm lg:text-sm text-[#555555]">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#111111]">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping.toLocaleString("en-IN")}`}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <span>{discount > 0 ? `-₹${discount.toLocaleString("en-IN")}` : "-"}</span>
                </div>
              </div>

              <div className="my-3 sm:my-4 lg:my-4 h-px bg-[#e5e5e5]" />

              <div className="flex items-center justify-between text-sm sm:text-base lg:text-base font-bold">
                <span>Total Paid</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6">
              <h2 className="text-xs sm:text-xs lg:text-xs font-bold uppercase tracking-[0.2em] text-[#555555]">
                Shipping Address
              </h2>
              <div className="mt-3 text-sm text-[#555555]">
                <p className="text-[#777]">Shipping details provided at checkout.</p>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6">
              <p className="text-xs sm:text-sm lg:text-sm text-[#555555]">
                A confirmation email has been sent to your email address.
              </p>
            </section>

            <div className="space-y-2 sm:space-y-3 lg:space-y-3">
              <Link
                href="/track-order"
                className="block w-full rounded-full bg-[#cc071e] py-3 sm:py-4 lg:py-4 text-center text-xs font-bold uppercase tracking-[0.25em] text-white transition-all hover:bg-red-700 hover:shadow-[0_12px_30px_rgba(204,7,30,0.3)]"
              >
                Track Order
              </Link>
              <Link
                href="/"
                className="block w-full rounded-full border border-[#cc071e] py-3 sm:py-4 lg:py-4 text-center text-xs font-bold uppercase tracking-[0.25em] text-[#cc071e] transition-all hover:bg-[#cc071e] hover:text-white"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
