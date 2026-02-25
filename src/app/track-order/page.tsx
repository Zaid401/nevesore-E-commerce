"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const steps = [
  { label: "Order Confirmed", icon: "check" },
  { label: "Packed", icon: "box" },
  { label: "Shipped", icon: "truck" },
  { label: "Out for Delivery", icon: "route" },
  { label: "Delivered", icon: "home" },
];

const mockOrder = {
  orderNumber: "NS-458921",
  orderDate: "20 Feb 2026",
  paymentStatus: "Paid",
  estimatedDelivery: "25 Feb 2026",
  courier: "DHL Express",
  trackingId: "DHL-NEV-948201",
  shippingMethod: "Express Shipping (1-3 days)",
  address: "123 Performance Blvd, Apt 5C, Los Angeles, CA 90028",
  phone: "+1 555 234 8821",
  statusIndex: 2,
  statusMessage: "Your order is on the way.",
  items: [
    {
      id: "active-1",
      name: "APEX COMPRESSION TEE",
      size: "M",
      quantity: 1,
      price: 68.0,
      image: "/images/categories/active.png",
    },
    {
      id: "bottom-2",
      name: "POWER FLEX JOGGERS",
      size: "L",
      quantity: 1,
      price: 59.99,
      image: "/images/categories/bottom.png",
    },
  ],
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const subtotal = useMemo(
    () => mockOrder.items.reduce((total, item) => total + item.price * item.quantity, 0),
    []
  );

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowResult(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mockOrder.trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8] text-[#111111]">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10 lg:py-12">
        <div className="mb-6 sm:mb-8 lg:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold uppercase">Track Your Order</h1>
          <p className="mt-2 text-xs sm:text-sm lg:text-sm text-[#555555]">
            Enter your order number and email to view order status.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
        >
          <div className="grid gap-3 sm:gap-4 lg:gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase text-[#555555]" htmlFor="orderNumber">
                Order Number
              </label>
              <input
                id="orderNumber"
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                className="mt-2 h-10 sm:h-11 lg:h-12 w-full rounded-full border border-[#e5e5e5] px-4 text-xs sm:text-sm lg:text-sm focus:border-[#cc071e] focus:outline-none"
                placeholder="#NS-458921"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase  text-[#555555]" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 h-10 sm:h-11 lg:h-12 w-full rounded-full border border-[#e5e5e5] px-4 text-xs sm:text-sm lg:text-sm focus:border-[#cc071e] focus:outline-none"
                placeholder="you@neversore.com"
              />
            </div>
          </div>
          <button className="mt-4 sm:mt-5 lg:mt-5 w-full rounded-full bg-[#cc071e] py-2 sm:py-3 lg:py-3 text-xs font-bold uppercase text-white transition-all hover:bg-red-700">
            Track Order
          </button>
        </form>

        {showResult && (
          <div className="mt-6 sm:mt-8 lg:mt-8 space-y-4 sm:space-y-5 lg:space-y-6 animate-[fadeIn_0.4s_ease-out]">
            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 lg:gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase  text-[#555555]">Order Number</p>
                  <p className="text-base sm:text-lg lg:text-lg font-bold">#{mockOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-[#555555]">Order Date</p>
                  <p className="text-xs sm:text-sm lg:text-sm font-semibold">{mockOrder.orderDate}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase  text-[#555555]">Payment Status</p>
                  <span className="inline-flex items-center rounded-full bg-[#16a34a]/10 px-2 sm:px-3 lg:px-3 py-1 text-xs font-semibold text-[#16a34a]">
                    {mockOrder.paymentStatus}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase  text-[#555555]">Estimated Delivery</p>
                  <p className="text-xs sm:text-sm lg:text-sm font-semibold">{mockOrder.estimatedDelivery}</p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <h2 className="text-xs font-semibold uppercase text-[#555555]">Order Status</h2>

              <div className="mt-4 sm:mt-6 lg:mt-6 hidden md:block">
                <div className="relative flex items-center justify-between">
                  <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#f1f1f1]" />
                  <div
                    className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#cc071e] transition-all"
                    style={{ width: `${(mockOrder.statusIndex / (steps.length - 1)) * 100}%` }}
                  />
                  {steps.map((step, index) => {
                    const status = index < mockOrder.statusIndex
                      ? "complete"
                      : index === mockOrder.statusIndex
                      ? "current"
                      : "pending";
                    const colorClass =
                      status === "complete"
                        ? "bg-[#16a34a] text-white"
                        : status === "current"
                        ? "bg-[#cc071e] text-white"
                        : "bg-[#f1f1f1] text-[#555555]";
                    return (
                      <div key={step.label} className="relative z-10 flex flex-col items-center">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${colorClass}`}>
                          <span className="text-xs font-bold">{index + 1}</span>
                        </div>
                        <p className="mt-3 text-xs font-semibold uppercase text-[#555555]">
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 sm:mt-6 lg:mt-6 space-y-3 sm:space-y-3 lg:space-y-3 md:hidden">
                {steps.map((step, index) => {
                  const status = index < mockOrder.statusIndex
                    ? "complete"
                    : index === mockOrder.statusIndex
                    ? "current"
                    : "pending";
                  const badgeClass =
                    status === "complete"
                      ? "bg-[#16a34a] text-white"
                      : status === "current"
                      ? "bg-[#cc071e] text-white"
                      : "bg-[#f1f1f1] text-[#555555]";
                  return (
                    <div key={step.label} className="flex items-center gap-3">
                      <span className={`flex h-8 w-8 sm:h-9 sm:w-9 lg:h-9 lg:w-9 items-center justify-center rounded-full text-xs font-bold ${badgeClass}`}>
                        {index + 1}
                      </span>
                      <p className="text-xs sm:text-sm lg:text-sm font-semibold text-[#111111]">{step.label}</p>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 sm:mt-6 lg:mt-6 text-xs sm:text-sm lg:text-sm font-semibold text-[#111111]">
                {mockOrder.statusMessage}
              </p>
            </section>

            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <h2 className="text-xs font-semibold uppercase  text-[#555555]">Shipping Details</h2>
              <div className="mt-3 sm:mt-4 lg:mt-4 grid gap-3 sm:gap-4 lg:gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-[#555555]">Courier</p>
                  <p className="text-xs sm:text-sm lg:text-sm font-semibold">{mockOrder.courier}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-[#555555]">Tracking ID</p>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="mt-1 inline-flex items-center gap-2 text-xs sm:text-sm lg:text-sm font-semibold text-[#111111]"
                  >
                    {mockOrder.trackingId}
                    <span className="text-xs text-[#555555]">{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase  text-[#555555]">Shipping Method</p>
                  <p className="text-xs sm:text-sm lg:text-sm font-semibold">{mockOrder.shippingMethod}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase  text-[#555555]">Phone</p>
                  <p className="text-xs sm:text-sm lg:text-sm font-semibold">{mockOrder.phone}</p>
                </div>
                <div className="sm:col-span-2 lg:col-span-2">
                  <p className="text-xs font-semibold uppercase text-[#555555]">Delivery Address</p>
                  <p className="text-xs sm:text-sm lg:text-sm font-semibold">{mockOrder.address}</p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <h2 className="text-xs font-semibold uppercase text-[#555555]">Product Summary</h2>
              <div className="mt-3 sm:mt-4 lg:mt-4 space-y-3 sm:space-y-4 lg:space-y-4">
                {mockOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 sm:gap-4 lg:gap-4">
                    <div className="relative h-14 w-14 sm:h-16 sm:w-16 lg:h-16 lg:w-16 overflow-hidden rounded-xl bg-[#f1f1f1]">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm lg:text-sm font-semibold">{item.name}</p>
                      <p className="text-xs text-[#555555]">Size {item.size} | Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>

              <div className="my-3 sm:my-4 lg:my-4 h-px bg-[#e5e5e5]" />

              <div className="flex items-center justify-between text-xs sm:text-sm lg:text-sm font-semibold">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <p className="text-xs sm:text-sm lg:text-sm text-[#555555]">Need help with your order?</p>
              <button className="mt-2 sm:mt-3 lg:mt-3 w-full rounded-full border border-[#cc071e] py-2 sm:py-3 lg:py-3 text-xs font-bold uppercase text-[#cc071e] transition-all hover:bg-[#cc071e] hover:text-white">
                Contact Support
              </button>
              <p className="mt-2 sm:mt-3 lg:mt-3 text-xs text-[#555555]">support@neversore.com</p>
            </section>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
