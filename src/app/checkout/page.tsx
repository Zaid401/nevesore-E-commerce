"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useCart } from "@/context/cart-context";

const SHIPPING_STANDARD = 0;
const SHIPPING_EXPRESS = 12;

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const router = useRouter();
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const discount = useMemo(() => {
    if (!couponApplied) {
      return 0;
    }
    return subtotal * 0.1;
  }, [couponApplied, subtotal]);

  const shippingCost = shippingMethod === "express" ? SHIPPING_EXPRESS : SHIPPING_STANDARD;
  const tax = 0;
  const total = Math.max(0, subtotal + shippingCost + tax - discount);

  const applyCoupon = () => {
    const normalized = couponCode.trim().toUpperCase();
    setCouponApplied(normalized === "NEVER10");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const nextErrors: Record<string, string> = {};
    const requiredFields = [
      "email",
      "phone",
      "fullName",
      "address1",
      "city",
      "state",
      "postal",
      "country",
    ];

    requiredFields.forEach((field) => {
      const value = (form.elements.namedItem(field) as HTMLInputElement | null)?.value?.trim();
      if (!value) {
        nextErrors[field] = "This field is required.";
      }
    });

    if (paymentMethod === "card") {
      const cardFields = ["cardNumber", "expiry", "cvv", "cardName"];
      cardFields.forEach((field) => {
        const value = (form.elements.namedItem(field) as HTMLInputElement | null)?.value?.trim();
        if (!value) {
          nextErrors[field] = "This field is required.";
        }
      });
    }

    if (paymentMethod === "upi") {
      const upiValue = (form.elements.namedItem("upiId") as HTMLInputElement | null)?.value?.trim();
      if (!upiValue) {
        nextErrors["upiId"] = "This field is required.";
      }
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      router.push("/confirmation");
    }
  };

  const clearError = (field: string) => {
    if (!errors[field]) {
      return;
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8] text-[#111111]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#555555]">
            <span className="text-[#555555]">Cart</span>
            <span className="h-px w-6 bg-[#e5e5e5]" />
            <span className="text-[#cc071e]">Checkout</span>
            <span className="h-px w-6 bg-[#e5e5e5]" />
            <span className="text-[#555555]">Confirmation</span>
          </div>
          <h1 className="text-3xl font-extrabold uppercase tracking-[0.2em]">Checkout</h1>
          <p className="mt-2 text-sm text-[#555555]">Finalize your order in a few quick steps.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <form id="checkout-form" className="lg:col-span-8 space-y-8" onSubmit={handleSubmit}>
            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Contact Information</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={() => clearError("email")}
                    className={`mt-2 h-12 w-full rounded-full border px-4 text-sm focus:border-[#cc071e] focus:outline-none ${
                      errors.email ? "border-[#cc071e]" : "border-[#e5e5e5]"
                    }`}
                    placeholder="you@neversore.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-[#cc071e]">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    onChange={() => clearError("phone")}
                    className={`mt-2 h-12 w-full rounded-full border px-4 text-sm focus:border-[#cc071e] focus:outline-none ${
                      errors.phone ? "border-[#cc071e]" : "border-[#e5e5e5]"
                    }`}
                    placeholder="+1 555 234 8821"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-[#cc071e]">{errors.phone}</p>}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Shipping Address</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    onChange={() => clearError("fullName")}
                    className={`mt-2 h-12 w-full rounded-full border px-4 text-sm focus:border-[#cc071e] focus:outline-none ${
                      errors.fullName ? "border-[#cc071e]" : "border-[#e5e5e5]"
                    }`}
                    placeholder="Jordan Brooks"
                  />
                  {errors.fullName && <p className="mt-1 text-xs text-[#cc071e]">{errors.fullName}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]" htmlFor="address1">
                    Address Line 1
                  </label>
                  <input
                    id="address1"
                    name="address1"
                    type="text"
                    onChange={() => clearError("address1")}
                    className={`mt-2 h-12 w-full rounded-full border px-4 text-sm focus:border-[#cc071e] focus:outline-none ${
                      errors.address1 ? "border-[#cc071e]" : "border-[#e5e5e5]"
                    }`}
                    placeholder="123 Performance Blvd"
                  />
                  {errors.address1 && <p className="mt-1 text-xs text-[#cc071e]">{errors.address1}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]" htmlFor="address2">
                    Address Line 2 (optional)
                  </label>
                  <input
                    id="address2"
                    name="address2"
                    type="text"
                    className="mt-2 h-12 w-full rounded-full border border-[#e5e5e5] px-4 text-sm focus:border-[#cc071e] focus:outline-none"
                    placeholder="Apt 5C"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]" htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    onChange={() => clearError("city")}
                    className={`mt-2 h-12 w-full rounded-full border px-4 text-sm focus:border-[#cc071e] focus:outline-none ${
                      errors.city ? "border-[#cc071e]" : "border-[#e5e5e5]"
                    }`}
                    placeholder="Los Angeles"
                  />
                  {errors.city && <p className="mt-1 text-xs text-[#cc071e]">{errors.city}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]" htmlFor="state">
                    State
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    onChange={() => clearError("state")}
                    className={`mt-2 h-12 w-full rounded-full border px-4 text-sm focus:border-[#cc071e] focus:outline-none ${
                      errors.state ? "border-[#cc071e]" : "border-[#e5e5e5]"
                    }`}
                    placeholder="CA"
                  />
                  {errors.state && <p className="mt-1 text-xs text-[#cc071e]">{errors.state}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]" htmlFor="postal">
                    Postal Code
                  </label>
                  <input
                    id="postal"
                    name="postal"
                    type="text"
                    onChange={() => clearError("postal")}
                    className={`mt-2 h-12 w-full rounded-full border px-4 text-sm focus:border-[#cc071e] focus:outline-none ${
                      errors.postal ? "border-[#cc071e]" : "border-[#e5e5e5]"
                    }`}
                    placeholder="90028"
                  />
                  {errors.postal && <p className="mt-1 text-xs text-[#cc071e]">{errors.postal}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]" htmlFor="country">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    onChange={() => clearError("country")}
                    className={`mt-2 h-12 w-full rounded-full border px-4 text-sm focus:border-[#cc071e] focus:outline-none ${
                      errors.country ? "border-[#cc071e]" : "border-[#e5e5e5]"
                    }`}
                  >
                    <option value="">Select country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                  {errors.country && <p className="mt-1 text-xs text-[#cc071e]">{errors.country}</p>}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Shipping Method</h2>
              <div className="mt-5 space-y-3">
                <label className="flex items-center justify-between rounded-2xl border border-[#e5e5e5] p-4 transition-all hover:border-[#cc071e]">
                  <div>
                    <p className="text-sm font-semibold">Standard Shipping</p>
                    <p className="text-xs text-[#555555]">3-7 business days</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">Free</span>
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === "standard"}
                      onChange={() => setShippingMethod("standard")}
                      className="accent-[#cc071e]"
                    />
                  </div>
                </label>
                <label className="flex items-center justify-between rounded-2xl border border-[#e5e5e5] p-4 transition-all hover:border-[#cc071e]">
                  <div>
                    <p className="text-sm font-semibold">Express Shipping</p>
                    <p className="text-xs text-[#555555]">1-3 business days</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">$12.00</span>
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === "express"}
                      onChange={() => setShippingMethod("express")}
                      className="accent-[#cc071e]"
                    />
                  </div>
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Payment Method</h2>
              <div className="mt-5 space-y-4">
                <label className={`block rounded-2xl border p-4 transition-all ${
                  paymentMethod === "card" ? "border-[#cc071e]" : "border-[#e5e5e5]"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Credit / Debit Card</span>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="accent-[#cc071e]"
                    />
                  </div>
                  <div className={`mt-4 grid gap-4 sm:grid-cols-2 transition-all ${
                    paymentMethod === "card" ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                  }`}>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]" htmlFor="cardNumber">
                        Card Number
                      </label>
                      <input
                        id="cardNumber"
                        name="cardNumber"
                        type="text"
                        onChange={() => clearError("cardNumber")}
                        className={`mt-2 h-12 w-full rounded-full border px-4 text-sm focus:border-[#cc071e] focus:outline-none ${
                          errors.cardNumber ? "border-[#cc071e]" : "border-[#e5e5e5]"
                        }`}
                        placeholder="1234 5678 9012 3456"
                      />
                      {errors.cardNumber && <p className="mt-1 text-xs text-[#cc071e]">{errors.cardNumber}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]" htmlFor="expiry">
                        Expiry Date
                      </label>
                      <input
                        id="expiry"
                        name="expiry"
                        type="text"
                        onChange={() => clearError("expiry")}
                        className={`mt-2 h-12 w-full rounded-full border px-4 text-sm focus:border-[#cc071e] focus:outline-none ${
                          errors.expiry ? "border-[#cc071e]" : "border-[#e5e5e5]"
                        }`}
                        placeholder="MM/YY"
                      />
                      {errors.expiry && <p className="mt-1 text-xs text-[#cc071e]">{errors.expiry}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]" htmlFor="cvv">
                        CVV
                      </label>
                      <input
                        id="cvv"
                        name="cvv"
                        type="password"
                        onChange={() => clearError("cvv")}
                        className={`mt-2 h-12 w-full rounded-full border px-4 text-sm focus:border-[#cc071e] focus:outline-none ${
                          errors.cvv ? "border-[#cc071e]" : "border-[#e5e5e5]"
                        }`}
                        placeholder="123"
                      />
                      {errors.cvv && <p className="mt-1 text-xs text-[#cc071e]">{errors.cvv}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]" htmlFor="cardName">
                        Name on Card
                      </label>
                      <input
                        id="cardName"
                        name="cardName"
                        type="text"
                        onChange={() => clearError("cardName")}
                        className={`mt-2 h-12 w-full rounded-full border px-4 text-sm focus:border-[#cc071e] focus:outline-none ${
                          errors.cardName ? "border-[#cc071e]" : "border-[#e5e5e5]"
                        }`}
                        placeholder="Jordan Brooks"
                      />
                      {errors.cardName && <p className="mt-1 text-xs text-[#cc071e]">{errors.cardName}</p>}
                    </div>
                  </div>
                </label>

                <label className={`block rounded-2xl border p-4 transition-all ${
                  paymentMethod === "upi" ? "border-[#cc071e]" : "border-[#e5e5e5]"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">UPI</span>
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={() => setPaymentMethod("upi")}
                      className="accent-[#cc071e]"
                    />
                  </div>
                  <div className={`mt-4 transition-all ${
                    paymentMethod === "upi" ? "max-h-[120px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                  }`}>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]" htmlFor="upiId">
                      UPI ID
                    </label>
                    <input
                      id="upiId"
                      name="upiId"
                      type="text"
                      onChange={() => clearError("upiId")}
                      className={`mt-2 h-12 w-full rounded-full border px-4 text-sm focus:border-[#cc071e] focus:outline-none ${
                        errors.upiId ? "border-[#cc071e]" : "border-[#e5e5e5]"
                      }`}
                      placeholder="name@bank"
                    />
                    {errors.upiId && <p className="mt-1 text-xs text-[#cc071e]">{errors.upiId}</p>}
                  </div>
                </label>

                <label className={`block rounded-2xl border p-4 transition-all ${
                  paymentMethod === "cod" ? "border-[#cc071e]" : "border-[#e5e5e5]"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Cash on Delivery (COD)</span>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-[#cc071e]"
                    />
                  </div>
                  {paymentMethod === "cod" && (
                    <p className="mt-3 text-xs text-[#555555]">
                      Pay with cash upon delivery. Please have the exact amount ready.
                    </p>
                  )}
                </label>
              </div>
            </section>
          </form>

          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] lg:sticky lg:top-24">
              <h2 className="text-lg font-bold uppercase tracking-[0.15em]">Order Summary</h2>

              <div className="mt-6 space-y-4">
                {items.length === 0 ? (
                  <p className="text-sm text-[#555555]">Your cart is currently empty.</p>
                ) : (
                  items.map((item) => (
                    <div key={`${item.id}-${item.color}-${item.size}`} className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-[#f1f1f1]">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="text-xs text-[#555555]">
                          {item.size} | Qty {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="my-6 h-px bg-[#e5e5e5]" />

              <div className="space-y-3 text-sm text-[#555555]">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#111111]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <span>{discount > 0 ? `-$${discount.toFixed(2)}` : "-"}</span>
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
                  <p className="text-xs font-semibold text-[#16a34a]">Coupon applied successfully.</p>
                )}
              </div>

              <button
                type="submit"
                form="checkout-form"
                className="mt-6 w-full rounded-full bg-[#cc071e] py-4 text-xs font-bold uppercase tracking-[0.25em] text-white transition-all hover:bg-red-700 hover:shadow-[0_12px_30px_rgba(204,7,30,0.3)]"
              >
                Place Order
              </button>
              <p className="mt-3 text-center text-xs text-[#555555]">Secure and encrypted payment.</p>
            </div>
          </aside>
        </div>
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-[#e5e5e5] bg-white p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] lg:hidden">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button type="submit" form="checkout-form" className="mt-3 w-full rounded-full bg-[#cc071e] py-3 text-xs font-bold uppercase tracking-[0.2em] text-white">
            Place Order
          </button>
          <p className="mt-2 text-center text-xs text-[#555555]">Secure and encrypted payment.</p>
        </div>
      )}

      <Footer />
    </main>
  );
}
