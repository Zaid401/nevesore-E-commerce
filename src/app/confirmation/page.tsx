"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { supabase } from "@/lib/supabase";

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
  coupon_code: string | null;
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

function ConfirmationInner() {
  const searchParams = useSearchParams();
  const orderParam = searchParams.get("order");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderParam) {
      setError("No order number provided.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      const { data, error: queryError } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("order_number", orderParam)
        .single();

      if (queryError || !data) {
        setError("Order not found. Please check your email for order details.");
      } else {
        setOrder(data as Order);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderParam]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f8f8] text-[#111111]">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#cc071e] border-t-transparent" />
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#f8f8f8] text-[#111111]">
        <Navbar />
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center">
          <h1 className="text-2xl font-extrabold uppercase tracking-[0.2em]">Order Not Found</h1>
          <p className="mt-4 text-sm text-[#555555]">{error}</p>
          <Link
            href="/"
            className="mt-6 rounded-full bg-[#cc071e] px-8 py-3 text-xs font-bold uppercase tracking-[0.25em] text-white hover:bg-red-700"
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const shippingAddress = [
    order.shipping_address_line_1,
    order.shipping_address_line_2,
    order.shipping_city,
    order.shipping_state,
    order.shipping_postal_code,
    order.shipping_country,
  ]
    .filter(Boolean)
    .join(", ");

  const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const isCOD = order.payment_status === "cod_pending";

  return (
    <main className="min-h-screen bg-[#f8f8f8] text-[#111111]">
      <Navbar />

      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-8 sm:py-10 lg:py-12">
        <div className="w-full rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-6 lg:p-8 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#16a34a]/10 text-[#16a34a]">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 sm:h-8 sm:w-8">
                <path fill="currentColor" d="M9.55 17.3 4.9 12.65l1.4-1.4 3.25 3.25 7.55-7.55 1.4 1.4z" />
              </svg>
            </div>
            <h1 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-extrabold uppercase tracking-[0.2em]">
              Order Confirmed!
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#555555]">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            <div className="mt-3 sm:mt-4 flex flex-col gap-1 text-xs sm:text-sm text-[#555555]">
              <span>
                Order Number:{" "}
                <span className="font-semibold text-[#111111]">#{order.order_number}</span>
              </span>
              <span>Order Date: {orderDate}</span>
              <span>Estimated delivery: 3-7 business days</span>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-5 lg:space-y-6">
            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#555555]">Order Details</h2>
              <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-[#f1f1f1]">
                      {item.image_url ? (
                        <Image src={item.image_url} alt={item.product_name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#aaa] text-xs">No img</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{item.product_name}</p>
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
                    {"\u20b9"}{order.subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
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
                  <span>GST (18%)</span>
                  <span>{"\u20b9"}{order.tax_amount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="my-3 sm:my-4 h-px bg-[#e5e5e5]" />

              <div className="flex items-center justify-between text-sm sm:text-base font-bold">
                <span>Total {isCOD ? "(Pay on Delivery)" : "Paid"}</span>
                <span>{"\u20b9"}{order.total_amount.toLocaleString("en-IN")}</span>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#555555]">Shipping Address</h2>
              <div className="mt-3 text-sm text-[#111111]">
                <p className="font-semibold">{order.shipping_full_name}</p>
                <p className="text-[#555555]">{shippingAddress}</p>
                <p className="text-[#555555]">{order.shipping_phone}</p>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#555555]">Payment</h2>
              <div className="mt-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
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
            </section>

            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6">
              <p className="text-xs sm:text-sm text-[#555555]">
                A confirmation email has been sent to your email address. You can track your order anytime.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/track-order?order=${order.order_number}`}
                  className="flex-1 rounded-full border border-[#cc071e] py-2.5 text-center text-xs font-bold uppercase tracking-[0.25em] text-[#cc071e] transition-all hover:bg-[#cc071e] hover:text-white"
                >
                  Track Order
                </Link>
                <Link
                  href="/"
                  className="flex-1 rounded-full bg-[#111111] py-2.5 text-center text-xs font-bold uppercase tracking-[0.25em] text-white transition-all hover:bg-[#333]"
                >
                  Continue Shopping
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function ConfirmationPage() {
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
      <ConfirmationInner />
    </Suspense>
  );
}
