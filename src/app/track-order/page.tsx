"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { supabase } from "@/lib/supabase";

const steps = [
  { label: "Order Confirmed" },
  { label: "Packed" },
  { label: "Shipped" },
  { label: "Out for Delivery" },
  { label: "Delivered" },
];

const STATUS_TO_STEP: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  processing: 1,
  shipped: 2,
  out_for_delivery: 3,
  delivered: 4,
  cancelled: 0,
  return_requested: 4,
  return_approved: 4,
  returned: 4,
  refunded: 4,
};

const STATUS_MESSAGES: Record<string, string> = {
  pending: "Your order has been received and is awaiting confirmation.",
  confirmed: "Your order has been confirmed and is being packed.",
  processing: "Your order is being packed and prepared for shipment.",
  shipped: "Your order is on the way!",
  out_for_delivery: "Your order is out for delivery today.",
  delivered: "Your order has been delivered. Enjoy!",
  cancelled: "Your order has been cancelled.",
  return_requested: "Return request received. We will process it shortly.",
  return_approved: "Your return has been approved.",
  returned: "Your return has been completed.",
  refunded: "Your refund has been processed.",
};

function formatPaymentStatus(status: string) {
  const map: Record<string, string> = {
    captured: "Paid",
    cod_pending: "Cash on Delivery",
    pending: "Pending",
    authorized: "Authorized",
    failed: "Payment Failed",
    refunded: "Refunded",
  };
  return map[status] ?? status;
}

interface OrderItem {
  id: string;
  product_name: string;
  color_name: string;
  size_label: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  image_url: string | null;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: number;
  discount_amount: number;
  shipping_cost: number;
  tax_amount: number;
  total_amount: number;
  shipping_full_name: string;
  shipping_phone: string;
  shipping_address_line_1: string;
  shipping_address_line_2: string | null;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  created_at: string;
  order_items: OrderItem[];
}

function TrackOrderInner() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get("order") ?? "";

  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError("");
    setShowResult(false);

    const { data, error: queryError } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_number", orderNumber.trim().toUpperCase())
      .single();

    if (queryError || !data) {
      setError("Order not found. Please check your order number and try again.");
      setOrder(null);
    } else {
      setOrder(data as Order);
      setShowResult(true);
    }

    setLoading(false);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const statusIndex = order ? (STATUS_TO_STEP[order.status] ?? 0) : 0;
  const statusMessage = order ? (STATUS_MESSAGES[order.status] ?? order.status) : "";

  const orderDate = order
    ? new Date(order.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  const shippingAddress = order
    ? [
        order.shipping_address_line_1,
        order.shipping_address_line_2,
        order.shipping_city,
        order.shipping_state,
        order.shipping_postal_code,
        order.shipping_country,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  const subtotal = order?.order_items.reduce((sum, item) => sum + item.total_price, 0) ?? 0;

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
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase text-[#555555]" htmlFor="orderNumber">
                Order Number
              </label>
              <input
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="mt-2 h-10 sm:h-11 lg:h-12 w-full rounded-full border border-[#e5e5e5] px-4 text-xs sm:text-sm focus:border-[#cc071e] focus:outline-none"
                placeholder="ORD-20250101-ABCD"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase  text-[#555555]" htmlFor="email">
                Email Address <span className="text-[#aaa] normal-case font-normal">(optional)</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 h-10 sm:h-11 lg:h-12 w-full rounded-full border border-[#e5e5e5] px-4 text-xs sm:text-sm focus:border-[#cc071e] focus:outline-none"
                placeholder="you@neversore.com"
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 text-xs text-[#cc071e] font-semibold">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 sm:mt-5 w-full rounded-full bg-[#cc071e] py-2 sm:py-3 text-xs font-bold uppercase tracking-[0.25em] text-white transition-all hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Searching..." : "Track Order"}
          </button>
        </form>

        {showResult && order && (
          <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-5 lg:space-y-6 animate-[fadeIn_0.4s_ease-out]">
            {/* Order header */}
            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase  text-[#555555]">Order Number</p>
                  <p className="text-base sm:text-lg font-bold">#{order.order_number}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-[#555555]">Order Date</p>
                  <p className="text-xs sm:text-sm font-semibold">{orderDate}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase  text-[#555555]">Payment</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2 sm:px-3 py-1 text-xs font-semibold ${
                      order.payment_status === "captured"
                        ? "bg-[#16a34a]/10 text-[#16a34a]"
                        : order.payment_status === "cod_pending"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {formatPaymentStatus(order.payment_status)}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase  text-[#555555]">Total</p>
                  <p className="text-xs sm:text-sm font-semibold">
                    {"\u20b9"}{order.total_amount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </section>

            {/* Status tracker */}
            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <h2 className="text-xs font-semibold uppercase text-[#555555]">Order Status</h2>

              {/* Desktop */}
              <div className="mt-4 sm:mt-6 hidden md:block">
                <div className="relative flex items-center justify-between">
                  <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#f1f1f1]" />
                  <div
                    className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#cc071e] transition-all"
                    style={{ width: `${(statusIndex / (steps.length - 1)) * 100}%` }}
                  />
                  {steps.map((step, index) => {
                    const status =
                      index < statusIndex ? "complete" : index === statusIndex ? "current" : "pending";
                    const colorClass =
                      status === "complete"
                        ? "bg-[#16a34a] text-white"
                        : status === "current"
                        ? "bg-[#cc071e] text-white"
                        : "bg-[#f1f1f1] text-[#555555]";
                    return (
                      <div key={step.label} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full ${colorClass}`}
                        >
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

              {/* Mobile */}
              <div className="mt-4 space-y-3 md:hidden">
                {steps.map((step, index) => {
                  const status =
                    index < statusIndex ? "complete" : index === statusIndex ? "current" : "pending";
                  const badgeClass =
                    status === "complete"
                      ? "bg-[#16a34a] text-white"
                      : status === "current"
                      ? "bg-[#cc071e] text-white"
                      : "bg-[#f1f1f1] text-[#555555]";
                  return (
                    <div key={step.label} className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs font-bold ${badgeClass}`}
                      >
                        {index + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-[#111111]">{step.label}</p>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 sm:mt-6 text-xs sm:text-sm font-semibold text-[#111111]">
                {statusMessage}
              </p>
            </section>

            {/* Shipping details */}
            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <h2 className="text-xs font-semibold uppercase  text-[#555555]">Shipping Details</h2>
              <div className="mt-3 sm:mt-4 grid gap-3 sm:gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]">Name</p>
                  <p className="text-xs sm:text-sm font-semibold">{order.shipping_full_name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-[#555555]">Phone</p>
                  <p className="text-xs sm:text-sm font-semibold">{order.shipping_phone}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]">Delivery Address</p>
                  <p className="text-xs sm:text-sm font-semibold">{shippingAddress}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-[#555555]">Tracking ID</p>
                  <button
                    type="button"
                    onClick={() => handleCopy(order.order_number)}
                    className="mt-1 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#111111]"
                  >
                    {order.order_number}
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

            {/* Product summary */}
            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <h2 className="text-xs font-semibold uppercase text-[#555555]">Product Summary</h2>
              <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 sm:gap-4">
                    <div className="relative h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-xl bg-[#f1f1f1]">
                      {item.image_url ? (
                        <Image src={item.image_url} alt={item.product_name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#aaa] text-xs">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-semibold">{item.product_name}</p>
                      <p className="text-xs text-[#555555]">
                        {item.color_name}  Size {item.size_label}  Qty {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      {"\u20b9"}{item.total_price.toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="my-3 sm:my-4 h-px bg-[#e5e5e5]" />

              <div className="space-y-2 text-xs sm:text-sm text-[#555555]">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#111111]">
                    {"\u20b9"}{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Discount</span>
                    <span className="text-[#16a34a]">
                      -{"\u20b9"}{order.discount_amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>
                    {order.shipping_cost === 0 ? "Free" : `\u20b9${order.shipping_cost.toLocaleString("en-IN")}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>GST</span>
                  <span>{"\u20b9"}{order.tax_amount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="my-3 sm:my-4 h-px bg-[#e5e5e5]" />

              <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                <span>Total</span>
                <span>{"\u20b9"}{order.total_amount.toLocaleString("en-IN")}</span>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <p className="text-xs sm:text-sm text-[#555555]">Need help with your order?</p>
              <a
                href="mailto:support@neversore.com"
                className="mt-2 sm:mt-3 block w-full rounded-full border border-[#cc071e] py-2 sm:py-3 text-xs font-bold uppercase tracking-[0.25em] text-[#cc071e] transition-all hover:bg-[#cc071e] hover:text-white"
              >
                Contact Support
              </a>
              <p className="mt-2 sm:mt-3 text-xs text-[#555555]">support@neversore.com</p>
            </section>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f8f8f8]">
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#cc071e] border-t-transparent" />
          </div>
        </main>
      }
    >
      <TrackOrderInner />
    </Suspense>
  );
}
