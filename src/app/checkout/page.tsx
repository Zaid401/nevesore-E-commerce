"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";

interface Address {
  id: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  label: string;
}

interface OrderSummary {
  subtotal: number;
  discount_amount: number;
  shipping_cost: number;
  tax_amount: number;
  total_amount: number;
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Address state
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // Payment & coupon state
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Order state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [summary, setSummary] = useState<OrderSummary | null>(null);

  // New address form ref
  const formRef = useRef<HTMLFormElement>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout");
    }
  }, [user, router]);

  // Fetch saved addresses
  useEffect(() => {
    if (!user) return;
    setLoadingAddresses(true);
    supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .then(({ data }) => {
        setSavedAddresses(data || []);
        if (data && data.length > 0) {
          setSelectedAddressId(data[0].id);
        } else {
          setShowNewAddressForm(true);
        }
        setLoadingAddresses(false);
      });
  }, [user]);

  // Estimated totals (local)
  const localDiscount = couponApplied ? subtotal * 0.1 : 0;
  const localShipping = subtotal - localDiscount >= 999 ? 0 : 99;
  const localTax = Math.round((subtotal - localDiscount) * 0.18 * 100) / 100;
  const localTotal = Math.max(0, subtotal - localDiscount + localShipping + localTax);

  const displaySummary = summary ?? {
    subtotal,
    discount_amount: localDiscount,
    shipping_cost: localShipping,
    tax_amount: localTax,
    total_amount: localTotal,
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const getFormField = (name: string) => {
    const el = formRef.current?.elements.namedItem(name) as HTMLInputElement | null;
    return el?.value?.trim() || "";
  };

  const saveNewAddress = useCallback(async (): Promise<string | null> => {
    if (!user) return null;
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .eq("is_default", true);

    const { data, error } = await supabase
      .from("addresses")
      .insert({
        user_id: user.id,
        full_name: getFormField("fullName"),
        phone: getFormField("phone"),
        address_line_1: getFormField("address1"),
        address_line_2: getFormField("address2") || null,
        city: getFormField("city"),
        state: getFormField("state"),
        postal_code: getFormField("postal"),
        country: getFormField("country") || "India",
        is_default: true,
        label: "Home",
      })
      .select("id")
      .single();

    if (error || !data) return null;
    return data.id;
  }, [user]);

  const validateNewAddressForm = (): boolean => {
    const nextErrors: Record<string, string> = {};
    ["fullName", "phone", "address1", "city", "state", "postal"].forEach((field) => {
      if (!getFormField(field)) nextErrors[field] = "This field is required.";
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const placeOrder = useCallback(async () => {
    setIsSubmitting(true);
    setOrderError(null);

    try {
      if (items.length === 0) {
        setOrderError("Your cart is empty.");
        setIsSubmitting(false);
        return;
      }

      let addressId = selectedAddressId;

      if (showNewAddressForm || !addressId) {
        if (!validateNewAddressForm()) {
          setIsSubmitting(false);
          return;
        }
        addressId = await saveNewAddress();
        if (!addressId) {
          setOrderError("Failed to save shipping address. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }

      // Ensure we have a valid session and refresh it if needed
      let session = (await supabase.auth.getSession()).data.session;
      
      if (!session) {
        setOrderError("You must be logged in to place an order. Please log in again.");
        setIsSubmitting(false);
        router.push("/login?redirect=/checkout");
        return;
      }

      // Refresh the session to ensure token is valid
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.error("Session refresh error:", refreshError);
        setOrderError("Session expired. Please log in again.");
        setIsSubmitting(false);
        router.push("/login?redirect=/checkout");
        return;
      }

      if (refreshData.session) {
        session = refreshData.session;
      }

      console.log("Making request with session:", { 
        userId: session.user.id, 
        tokenExpiry: new Date(session.expires_at! * 1000).toISOString() 
      });

      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: {
          items: items.map((item) => ({ variant_id: item.variant_id, quantity: item.quantity })),
          address_id: addressId,
          coupon_code: couponApplied ? couponCode.trim().toUpperCase() : undefined,
          payment_method: paymentMethod,
        },
      });

      console.log("Edge function response:", { data, error });

      if (error || data?.error) {
        console.error("Edge function error:", error);
        throw new Error(data?.error || error?.message || "Failed to create order");
      }

      if (data.summary) setSummary(data.summary);

      // ── COD ───────────────────────────────────────────────────────────
      if (paymentMethod === "cod") {
        clearCart();
        router.push(`/confirmation?order=${data.order_number}`);
        return;
      }

      // ── Razorpay Modal ────────────────────────────────────────────────
      const rzpOptions: RazorpayOptions = {
        key: data.razorpay_key_id,
        amount: data.amount,
        currency: data.currency,
        name: "NEVERSORE",
        description: "Premium Gym Apparel",
        order_id: data.razorpay_order_id,
        prefill: data.prefill,
        theme: { color: "#cc071e" },
        modal: {
          ondismiss: () => {
            setOrderError("Payment cancelled. You can retry or choose Cash on Delivery.");
            setIsSubmitting(false);
          },
          confirm_close: true,
        },
        handler: async (response) => {
          try {
            // Ensure session is still valid
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !sessionData.session) {
              throw new Error("Authentication session expired. Please log in again.");
            }

            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              "verify-razorpay-payment",
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              }
            );

            if (verifyError || !verifyData?.success) {
              throw new Error(verifyData?.error || verifyError?.message || "Payment verification failed");
            }

            clearCart();
            router.push(`/confirmation?order=${verifyData.order_number}`);
          } catch (err) {
            setOrderError(err instanceof Error ? err.message : "Payment verification failed. Contact support.");
            setIsSubmitting(false);
          }
        },
      };

      const rzp = new window.Razorpay(rzpOptions);
      rzp.open();
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  }, [items, selectedAddressId, showNewAddressForm, couponCode, couponApplied, paymentMethod, clearCart, router, saveNewAddress]);

  const handleApplyCoupon = () => {
    setCouponError("");
    if (!couponCode.trim()) { setCouponError("Please enter a coupon code."); return; }
    setCouponApplied(true);
    setSummary(null);
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#f8f8f8] text-[#111111]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:py-12 lg:px-8">
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#555555]">
            <span>Cart</span>
            <span className="h-px w-6 bg-[#e5e5e5]" />
            <span className="text-[#cc071e]">Checkout</span>
            <span className="h-px w-6 bg-[#e5e5e5]" />
            <span>Confirmation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-[0.2em]">Checkout</h1>
          <p className="mt-2 text-xs sm:text-sm text-[#555555]">Finalize your order in a few quick steps.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-8">

            {/* Shipping Address */}
            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">Shipping Address</h2>

              {loadingAddresses ? (
                <div className="mt-4 flex items-center gap-2 text-sm text-[#555555]">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#e5e5e5] border-t-[#cc071e]" />
                  Loading addresses…
                </div>
              ) : (
                <>
                  {savedAddresses.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {savedAddresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
                            selectedAddressId === addr.id && !showNewAddressForm
                              ? "border-[#cc071e] bg-red-50"
                              : "border-[#e5e5e5] hover:border-[#cc071e]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="addressSelect"
                            value={addr.id}
                            checked={selectedAddressId === addr.id && !showNewAddressForm}
                            onChange={() => { setSelectedAddressId(addr.id); setShowNewAddressForm(false); }}
                            className="mt-1 accent-[#cc071e]"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{addr.full_name}</p>
                            <p className="text-xs text-[#555555]">{addr.address_line_1}{addr.address_line_2 ? `, ${addr.address_line_2}` : ""}</p>
                            <p className="text-xs text-[#555555]">{addr.city}, {addr.state} {addr.postal_code}, {addr.country}</p>
                            <p className="text-xs text-[#555555]">{addr.phone}</p>
                          </div>
                          {addr.label && (
                            <span className="rounded-full bg-[#f1f1f1] px-2 py-0.5 text-xs font-semibold text-[#555555]">{addr.label}</span>
                          )}
                        </label>
                      ))}
                      <button
                        type="button"
                        onClick={() => { setShowNewAddressForm(!showNewAddressForm); if (!showNewAddressForm) setSelectedAddressId(null); }}
                        className="text-xs font-semibold text-[#cc071e] hover:text-red-700 underline"
                      >
                        {showNewAddressForm ? "Use saved address" : "+ Add a new address"}
                      </button>
                    </div>
                  )}

                  {(showNewAddressForm || savedAddresses.length === 0) && (
                    <form ref={formRef} className="mt-4 grid gap-3 sm:gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]">Full Name</label>
                        <input name="fullName" type="text" onChange={() => clearError("fullName")}
                          className={`mt-2 h-11 w-full rounded-full border px-4 text-sm focus:border-[#cc071e] focus:outline-none ${errors.fullName ? "border-[#cc071e]" : "border-[#e5e5e5]"}`}
                          placeholder="Jordan Brooks" />
                        {errors.fullName && <p className="mt-1 text-xs text-[#cc071e]">{errors.fullName}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]">Phone</label>
                        <input name="phone" type="tel" onChange={() => clearError("phone")}
                          className={`mt-2 h-11 w-full rounded-full border px-4 text-sm focus:border-[#cc071e] focus:outline-none ${errors.phone ? "border-[#cc071e]" : "border-[#e5e5e5]"}`}
                          placeholder="+91 99999 00000" />
                        {errors.phone && <p className="mt-1 text-xs text-[#cc071e]">{errors.phone}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]">Email</label>
                        <input name="email" type="email" defaultValue={user.email || ""}
                          className="mt-2 h-11 w-full rounded-full border border-[#e5e5e5] px-4 text-sm focus:border-[#cc071e] focus:outline-none"
                          placeholder="you@neversore.com" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]">Address Line 1</label>
                        <input name="address1" type="text" onChange={() => clearError("address1")}
                          className={`mt-2 h-11 w-full rounded-full border px-4 text-sm focus:border-[#cc071e] focus:outline-none ${errors.address1 ? "border-[#cc071e]" : "border-[#e5e5e5]"}`}
                          placeholder="123 Performance Blvd" />
                        {errors.address1 && <p className="mt-1 text-xs text-[#cc071e]">{errors.address1}</p>}
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]">Address Line 2 (optional)</label>
                        <input name="address2" type="text"
                          className="mt-2 h-11 w-full rounded-full border border-[#e5e5e5] px-4 text-sm focus:border-[#cc071e] focus:outline-none"
                          placeholder="Apt 5C" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]">City</label>
                        <input name="city" type="text" onChange={() => clearError("city")}
                          className={`mt-2 h-11 w-full rounded-full border px-4 text-sm focus:border-[#cc071e] focus:outline-none ${errors.city ? "border-[#cc071e]" : "border-[#e5e5e5]"}`}
                          placeholder="Mumbai" />
                        {errors.city && <p className="mt-1 text-xs text-[#cc071e]">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]">State</label>
                        <input name="state" type="text" onChange={() => clearError("state")}
                          className={`mt-2 h-11 w-full rounded-full border px-4 text-sm focus:border-[#cc071e] focus:outline-none ${errors.state ? "border-[#cc071e]" : "border-[#e5e5e5]"}`}
                          placeholder="Maharashtra" />
                        {errors.state && <p className="mt-1 text-xs text-[#cc071e]">{errors.state}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]">Postal Code</label>
                        <input name="postal" type="text" onChange={() => clearError("postal")}
                          className={`mt-2 h-11 w-full rounded-full border px-4 text-sm focus:border-[#cc071e] focus:outline-none ${errors.postal ? "border-[#cc071e]" : "border-[#e5e5e5]"}`}
                          placeholder="400001" />
                        {errors.postal && <p className="mt-1 text-xs text-[#cc071e]">{errors.postal}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555555]">Country</label>
                        <select name="country" defaultValue="India"
                          className="mt-2 h-11 w-full rounded-full border border-[#e5e5e5] px-4 text-sm focus:border-[#cc071e] focus:outline-none">
                          <option value="India">India</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="AU">Australia</option>
                        </select>
                      </div>
                    </form>
                  )}
                </>
              )}
            </section>

            {/* Payment Method */}
            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">Payment Method</h2>
              <div className="mt-4 space-y-3">
                <label className={`flex items-start gap-4 rounded-2xl border p-4 cursor-pointer transition-all ${paymentMethod === "online" ? "border-[#cc071e] bg-red-50" : "border-[#e5e5e5] hover:border-[#cc071e]"}`}>
                  <input type="radio" name="payment" value="online" checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")} className="mt-0.5 accent-[#cc071e]" />
                  <div>
                    <p className="text-sm font-semibold">Pay Online</p>
                    <p className="text-xs text-[#555555] mt-0.5">Cards, UPI, Net Banking, Wallets — powered by Razorpay</p>
                    {paymentMethod === "online" && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {["Visa", "Mastercard", "UPI", "GPay", "PhonePe", "Paytm", "Netbanking"].map((m) => (
                          <span key={m} className="rounded-full bg-white border border-[#e5e5e5] px-2 py-0.5 text-xs font-semibold text-[#555555]">{m}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </label>

                <label className={`flex items-start gap-4 rounded-2xl border p-4 cursor-pointer transition-all ${paymentMethod === "cod" ? "border-[#cc071e] bg-red-50" : "border-[#e5e5e5] hover:border-[#cc071e]"}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")} className="mt-0.5 accent-[#cc071e]" />
                  <div>
                    <p className="text-sm font-semibold">Cash on Delivery (COD)</p>
                    <p className="text-xs text-[#555555] mt-0.5">Pay with cash when your order arrives. Have the exact amount ready.</p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] lg:sticky lg:top-24">
              <h2 className="text-base font-bold uppercase tracking-[0.15em]">Order Summary</h2>

              <div className="mt-5 space-y-4">
                {items.length === 0 ? (
                  <p className="text-sm text-[#555555]">Your cart is empty.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.variant_id} className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-[#f1f1f1] shrink-0">
                        <Image src={item.image} alt={item.product_name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{item.product_name}</p>
                        <p className="text-xs text-[#555555]">{item.color_name} / {item.size_label} · Qty {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold shrink-0">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="my-5 h-px bg-[#e5e5e5]" />

              <div className="space-y-2 text-sm text-[#555555]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#111111]">₹{displaySummary.subtotal.toLocaleString("en-IN")}</span>
                </div>
                {displaySummary.discount_amount > 0 && (
                  <div className="flex justify-between text-[#16a34a]">
                    <span>Discount</span>
                    <span className="font-semibold">−₹{displaySummary.discount_amount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-[#111111]">{displaySummary.shipping_cost === 0 ? "Free" : `₹${displaySummary.shipping_cost}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18% GST)</span>
                  <span className="font-semibold text-[#111111]">₹{displaySummary.tax_amount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="my-4 h-px bg-[#e5e5e5]" />
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>₹{displaySummary.total_amount.toLocaleString("en-IN")}</span>
              </div>

              {/* Coupon */}
              <div className="mt-5 space-y-2">
                {couponApplied ? (
                  <div className="flex items-center justify-between rounded-full border border-[#16a34a] bg-green-50 px-4 py-2">
                    <span className="text-xs font-semibold text-[#16a34a]">Coupon &quot;{couponCode.toUpperCase()}&quot; applied</span>
                    <button type="button" onClick={() => { setCouponApplied(false); setCouponCode(""); setSummary(null); }}
                      className="text-xs text-[#cc071e] font-semibold hover:text-red-700">Remove</button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input value={couponCode} onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                        placeholder="Discount code"
                        className="h-11 flex-1 rounded-full border border-[#e5e5e5] bg-white px-4 text-sm focus:border-[#cc071e] focus:outline-none" />
                      <button type="button" onClick={handleApplyCoupon}
                        className="h-11 rounded-full border border-[#cc071e] px-4 text-xs font-bold uppercase tracking-[0.2em] text-[#cc071e] transition-all hover:bg-[#cc071e] hover:text-white">
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-xs text-[#cc071e]">{couponError}</p>}
                  </>
                )}
              </div>

              {orderError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                  {orderError}
                </div>
              )}

              <button type="button" onClick={placeOrder} disabled={isSubmitting || items.length === 0}
                className="mt-5 w-full rounded-full bg-[#cc071e] py-4 text-xs font-bold uppercase tracking-[0.25em] text-white transition-all hover:bg-red-700 hover:shadow-[0_12px_30px_rgba(204,7,30,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting
                  ? (paymentMethod === "cod" ? "Placing Order…" : "Opening Payment…")
                  : (paymentMethod === "cod" ? "Place COD Order" : "Pay Now")}
              </button>
              <p className="mt-3 text-center text-xs text-[#555555]">
                {paymentMethod === "online" ? "🔒 Secure payment via Razorpay" : "Pay cash on delivery"}
              </p>
            </div>
          </aside>
        </div>
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-[#e5e5e5] bg-white p-3 lg:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between text-sm font-semibold mb-2">
            <span>Total</span>
            <span>₹{displaySummary.total_amount.toLocaleString("en-IN")}</span>
          </div>
          <button type="button" onClick={placeOrder} disabled={isSubmitting || items.length === 0}
            className="w-full rounded-full bg-[#cc071e] py-3 text-xs font-bold uppercase tracking-[0.2em] text-white disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting
              ? (paymentMethod === "cod" ? "Placing Order…" : "Opening Payment…")
              : (paymentMethod === "cod" ? "Place COD Order" : "Pay Now")}
          </button>
        </div>
      )}

      <Footer />
    </main>
  );
}
