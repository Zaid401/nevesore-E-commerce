"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";

const SHIPPING_STANDARD = 0;
const SHIPPING_EXPRESS = 149;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [saveAddress, setSaveAddress] = useState(true);

  // Auto-fill from saved address
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!data) return;
      // Pre-fill the form fields
      const setVal = (name: string, val: string) => {
        const el = document.querySelector<HTMLInputElement>(`[name="${name}"]`);
        if (el && !el.value) { el.value = val; }
      };
      setTimeout(() => {
        setVal("fullName", data.full_name || "");
        setVal("phone", data.phone || "");
        setVal("email", user.email || "");
        setVal("address1", data.address_line_1 || "");
        setVal("address2", data.address_line_2 || "");
        setVal("city", data.city || "");
        setVal("state", data.state || "");
        setVal("postal", data.postal_code || "");
        setVal("country", data.country || "India");
      }, 100);
    })();
  }, [user]);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
      await placeOrder(form);
    }
  };

  const placeOrder = async (form: HTMLFormElement) => {
    setIsSubmitting(true);
    setOrderError(null);

    try {
      if (items.length === 0) {
        setOrderError("Your cart is empty.");
        return;
      }

      // 1. Validate stock for all items
      const variantIds = items.map(i => i.variant_id);
      const { data: stockData, error: stockErr } = await supabase
        .from("product_variants")
        .select("id,stock_quantity")
        .in("id", variantIds);

      if (stockErr) throw new Error("Failed to check stock availability.");

      const stockMap = new Map((stockData || []).map(v => [v.id, v.stock_quantity]));
      for (const item of items) {
        const available = stockMap.get(item.variant_id) ?? 0;
        if (available < item.quantity) {
          setOrderError(`Insufficient stock for ${item.product_name} (${item.color_name} / ${item.size_label}). Available: ${available}`);
          return;
        }
      }

      // 2. Generate order number
      const orderNumber = `NVS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const getVal = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.value?.trim() || "";

      // 3. Create order
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          user_id: (await supabase.auth.getUser()).data.user?.id || null,
          status: paymentMethod === "cod" ? "confirmed" : "pending",
          shipping_full_name: getVal("fullName"),
          shipping_phone: getVal("phone"),
          shipping_address_line_1: getVal("address1"),
          shipping_address_line_2: getVal("address2") || null,
          shipping_city: getVal("city"),
          shipping_state: getVal("state"),
          shipping_postal_code: getVal("postal"),
          shipping_country: getVal("country") || "India",
          subtotal,
          discount_amount: discount,
          shipping_cost: shippingCost,
          tax_amount: tax,
          total_amount: total,
          coupon_code: couponApplied ? couponCode.trim().toUpperCase() : null,
          payment_status: paymentMethod === "cod" ? "pending" : "pending",
        })
        .select("id,order_number")
        .single();

      if (orderErr || !order) throw new Error(orderErr?.message || "Failed to create order.");

      // 4. Insert order items (triggers stock decrement)
      const orderItems = items.map(item => ({
        order_id: order.id,
        variant_id: item.variant_id,
        product_name: item.product_name,
        color_name: item.color_name,
        size_label: item.size_label,
        sku: item.sku,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      const { error: itemsErr } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsErr) {
        // Rollback the order if items insertion fails
        await supabase.from("orders").delete().eq("id", order.id);
        throw new Error(itemsErr.message || "Failed to add order items. Stock may be insufficient.");
      }

      // 5. Save address if checked
      if (saveAddress && user) {
        const addressData = {
          user_id: user.id,
          full_name: getVal("fullName"),
          phone: getVal("phone"),
          address_line_1: getVal("address1"),
          address_line_2: getVal("address2") || null,
          city: getVal("city"),
          state: getVal("state"),
          postal_code: getVal("postal"),
          country: getVal("country") || "India",
          is_default: true,
          label: "Home",
        };
        // Check if user already has a default address
        const { data: existing } = await supabase
          .from("addresses")
          .select("id")
          .eq("user_id", user.id)
          .eq("is_default", true)
          .maybeSingle();
        if (existing) {
          await supabase.from("addresses").update(addressData).eq("id", existing.id);
        } else {
          await supabase.from("addresses").insert(addressData);
        }
      }

      // 6. Clear the cart and redirect
      clearCart();
      router.push(`/confirmation?order=${order.order_number}`);
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:py-12 lg:px-8">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase  text-[#555555]">
            <span className="text-[#555555]">Cart</span>
            <span className="h-px w-6 bg-[#e5e5e5]" />
            <span className="text-[#cc071e]">Checkout</span>
            <span className="h-px w-6 bg-[#e5e5e5]" />
            <span className="text-[#555555]">Confirmation</span>
          </div>
          <h1 className="text-2xl sm:text-2xl lg:text-3xl font-extrabold uppercase ">Checkout</h1>
          <p className="mt-2 text-xs sm:text-sm lg:text-sm text-[#555555]">Finalize your order in a few quick steps.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <form id="checkout-form" className="lg:col-span-8 space-y-8" onSubmit={handleSubmit}>
            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <h2 className="text-xs sm:text-sm lg:text-sm font-bold uppercase ">Contact Information</h2>
              <div className="mt-4 sm:mt-5 lg:mt-5 grid gap-3 sm:gap-4 lg:gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase  text-[#555555]" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={() => clearError("email")}
                    className={`mt-2 h-10 sm:h-11 lg:h-12 w-full rounded-full border px-4 text-xs sm:text-sm lg:text-sm focus:border-[#cc071e] focus:outline-none ${errors.email ? "border-[#cc071e]" : "border-[#e5e5e5]"
                      }`}
                    placeholder="you@neversore.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-[#cc071e]">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-[#555555]" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    onChange={() => clearError("phone")}
                    className={`mt-2 h-10 sm:h-11 lg:h-12 w-full rounded-full border px-4 text-xs sm:text-sm lg:text-sm focus:border-[#cc071e] focus:outline-none ${errors.phone ? "border-[#cc071e]" : "border-[#e5e5e5]"
                      }`}
                    placeholder="+1 555 234 8821"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-[#cc071e]">{errors.phone}</p>}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <h2 className="text-xs sm:text-sm lg:text-sm font-bold uppercase ">Shipping Address</h2>
              <div className="mt-4 sm:mt-5 lg:mt-5 grid gap-3 sm:gap-4 lg:gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <div className="sm:col-span-2 lg:col-span-2">
                  <label className="text-xs font-semibold uppercase text-[#555555]" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    onChange={() => clearError("fullName")}
                    className={`mt-2 h-10 sm:h-11 lg:h-12 w-full rounded-full border px-4 text-xs sm:text-sm lg:text-sm focus:border-[#cc071e] focus:outline-none ${errors.fullName ? "border-[#cc071e]" : "border-[#e5e5e5]"
                      }`}
                    placeholder="Jordan Brooks"
                  />
                  {errors.fullName && <p className="mt-1 text-xs text-[#cc071e]">{errors.fullName}</p>}
                </div>
                <div className="sm:col-span-2 lg:col-span-2">
                  <label className="text-xs font-semibold uppercase  text-[#555555]" htmlFor="address1">
                    Address Line 1
                  </label>
                  <input
                    id="address1"
                    name="address1"
                    type="text"
                    onChange={() => clearError("address1")}
                    className={`mt-2 h-10 sm:h-11 lg:h-12 w-full rounded-full border px-4 text-xs sm:text-sm lg:text-sm focus:border-[#cc071e] focus:outline-none ${errors.address1 ? "border-[#cc071e]" : "border-[#e5e5e5]"
                      }`}
                    placeholder="123 Performance Blvd"
                  />
                  {errors.address1 && <p className="mt-1 text-xs text-[#cc071e]">{errors.address1}</p>}
                </div>
                <div className="sm:col-span-2 lg:col-span-2">
                  <label className="text-xs font-semibold uppercase text-[#555555]" htmlFor="address2">
                    Address Line 2 (optional)
                  </label>
                  <input
                    id="address2"
                    name="address2"
                    type="text"
                    className="mt-2 h-10 sm:h-11 lg:h-12 w-full rounded-full border border-[#e5e5e5] px-4 text-xs sm:text-sm lg:text-sm focus:border-[#cc071e] focus:outline-none"
                    placeholder="Apt 5C"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-[#555555]" htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    onChange={() => clearError("city")}
                    className={`mt-2 h-10 sm:h-11 lg:h-12 w-full rounded-full border px-4 text-xs sm:text-sm lg:text-sm focus:border-[#cc071e] focus:outline-none ${errors.city ? "border-[#cc071e]" : "border-[#e5e5e5]"
                      }`}
                    placeholder="Los Angeles"
                  />
                  {errors.city && <p className="mt-1 text-xs text-[#cc071e]">{errors.city}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase  text-[#555555]" htmlFor="state">
                    State
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    onChange={() => clearError("state")}
                    className={`mt-2 h-10 sm:h-11 lg:h-12 w-full rounded-full border px-4 text-xs sm:text-sm lg:text-sm focus:border-[#cc071e] focus:outline-none ${errors.state ? "border-[#cc071e]" : "border-[#e5e5e5]"
                      }`}
                    placeholder="CA"
                  />
                  {errors.state && <p className="mt-1 text-xs text-[#cc071e]">{errors.state}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase  text-[#555555]" htmlFor="postal">
                    Postal Code
                  </label>
                  <input
                    id="postal"
                    name="postal"
                    type="text"
                    onChange={() => clearError("postal")}
                    className={`mt-2 h-10 sm:h-11 lg:h-12 w-full rounded-full border px-4 text-xs sm:text-sm lg:text-sm focus:border-[#cc071e] focus:outline-none ${errors.postal ? "border-[#cc071e]" : "border-[#e5e5e5]"
                      }`}
                    placeholder="90028"
                  />
                  {errors.postal && <p className="mt-1 text-xs text-[#cc071e]">{errors.postal}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-[#555555]" htmlFor="country">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    onChange={() => clearError("country")}
                    className={`mt-2 h-10 sm:h-11 lg:h-12 w-full rounded-full border px-4 text-xs sm:text-sm lg:text-sm focus:border-[#cc071e] focus:outline-none ${errors.country ? "border-[#cc071e]" : "border-[#e5e5e5]"
                      }`}
                  >
                    <option value="">Select country</option>
                    <option value="India">India</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                  {errors.country && <p className="mt-1 text-xs text-[#cc071e]">{errors.country}</p>}
                </div>
              </div>
              {user && (
                <label className="mt-4 flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)}
                    className="h-4 w-4 rounded border-[#e5e5e5] text-[#cc071e] focus:ring-[#cc071e]" />
                  <span className="text-xs text-[#555555]">Save this address for future orders</span>
                </label>
              )}
            </section>

            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <h2 className="text-xs sm:text-sm lg:text-sm font-bold uppercase ">Shipping Method</h2>
              <div className="mt-4 sm:mt-5 lg:mt-5 space-y-2 sm:space-y-3 lg:space-y-3">
                <label className="flex items-center justify-between rounded-2xl border border-[#e5e5e5] p-3 sm:p-4 lg:p-4 transition-all hover:border-[#cc071e]">
                  <div>
                    <p className="text-xs sm:text-sm lg:text-sm font-semibold">Standard Shipping</p>
                    <p className="text-xs text-[#555555]">3-7 business days</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-3">
                    <span className="text-xs sm:text-sm lg:text-sm font-semibold">Free</span>
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
                <label className="flex items-center justify-between rounded-2xl border border-[#e5e5e5] p-3 sm:p-4 lg:p-4 transition-all hover:border-[#cc071e]">
                  <div>
                    <p className="text-xs sm:text-sm lg:text-sm font-semibold">Express Shipping</p>
                    <p className="text-xs text-[#555555]">1-3 business days</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-3">
                    <span className="text-xs sm:text-sm lg:text-sm font-semibold">$12.00</span>
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

            <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <h2 className="text-xs sm:text-sm lg:text-sm font-bold uppercase">Payment Method</h2>
              <div className="mt-4 sm:mt-5 lg:mt-5 space-y-3 sm:space-y-4 lg:space-y-4">
                <label className={`block rounded-2xl border p-3 sm:p-4 lg:p-4 transition-all ${paymentMethod === "card" ? "border-[#cc071e]" : "border-[#e5e5e5]"
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm lg:text-sm font-semibold">Credit / Debit Card</span>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="accent-[#cc071e]"
                    />
                  </div>
                  <div className={`mt-3 sm:mt-4 lg:mt-4 grid gap-3 sm:gap-4 lg:gap-4 sm:grid-cols-2 lg:grid-cols-2 transition-all ${paymentMethod === "card" ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    }`}>
                    <div className="sm:col-span-2 lg:col-span-2">
                      <label className="text-xs font-semibold uppercase text-[#555555]" htmlFor="cardNumber">
                        Card Number
                      </label>
                      <input
                        id="cardNumber"
                        name="cardNumber"
                        type="text"
                        onChange={() => clearError("cardNumber")}
                        className={`mt-2 h-10 sm:h-11 lg:h-12 w-full rounded-full border px-4 text-xs sm:text-sm lg:text-sm focus:border-[#cc071e] focus:outline-none ${errors.cardNumber ? "border-[#cc071e]" : "border-[#e5e5e5]"
                          }`}
                        placeholder="1234 5678 9012 3456"
                      />
                      {errors.cardNumber && <p className="mt-1 text-xs text-[#cc071e]">{errors.cardNumber}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase text-[#555555]" htmlFor="expiry">
                        Expiry Date
                      </label>
                      <input
                        id="expiry"
                        name="expiry"
                        type="text"
                        onChange={() => clearError("expiry")}
                        className={`mt-2 h-10 sm:h-11 lg:h-12 w-full rounded-full border px-4 text-xs sm:text-sm lg:text-sm focus:border-[#cc071e] focus:outline-none ${errors.expiry ? "border-[#cc071e]" : "border-[#e5e5e5]"
                          }`}
                        placeholder="MM/YY"
                      />
                      {errors.expiry && <p className="mt-1 text-xs text-[#cc071e]">{errors.expiry}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase text-[#555555]" htmlFor="cvv">
                        CVV
                      </label>
                      <input
                        id="cvv"
                        name="cvv"
                        type="password"
                        onChange={() => clearError("cvv")}
                        className={`mt-2 h-10 sm:h-11 lg:h-12 w-full rounded-full border px-4 text-xs sm:text-sm lg:text-sm focus:border-[#cc071e] focus:outline-none ${errors.cvv ? "border-[#cc071e]" : "border-[#e5e5e5]"
                          }`}
                        placeholder="123"
                      />
                      {errors.cvv && <p className="mt-1 text-xs text-[#cc071e]">{errors.cvv}</p>}
                    </div>
                    <div className="sm:col-span-2 lg:col-span-2">
                      <label className="text-xs font-semibold uppercase text-[#555555]" htmlFor="cardName">
                        Name on Card
                      </label>
                      <input
                        id="cardName"
                        name="cardName"
                        type="text"
                        onChange={() => clearError("cardName")}
                        className={`mt-2 h-10 sm:h-11 lg:h-12 w-full rounded-full border px-4 text-xs sm:text-sm lg:text-sm focus:border-[#cc071e] focus:outline-none ${errors.cardName ? "border-[#cc071e]" : "border-[#e5e5e5]"
                          }`}
                        placeholder="Jordan Brooks"
                      />
                      {errors.cardName && <p className="mt-1 text-xs text-[#cc071e]">{errors.cardName}</p>}
                    </div>
                  </div>
                </label>

                <label className={`block rounded-2xl border p-3 sm:p-4 lg:p-4 transition-all ${paymentMethod === "upi" ? "border-[#cc071e]" : "border-[#e5e5e5]"
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm lg:text-sm font-semibold">UPI</span>
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={() => setPaymentMethod("upi")}
                      className="accent-[#cc071e]"
                    />
                  </div>
                  <div className={`mt-3 sm:mt-4 lg:mt-4 transition-all ${paymentMethod === "upi" ? "max-h-[120px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    }`}>
                    <label className="text-xs font-semibold uppercase text-[#555555]" htmlFor="upiId">
                      UPI ID
                    </label>
                    <input
                      id="upiId"
                      name="upiId"
                      type="text"
                      onChange={() => clearError("upiId")}
                      className={`mt-2 h-10 sm:h-11 lg:h-12 w-full rounded-full border px-4 text-xs sm:text-sm lg:text-sm focus:border-[#cc071e] focus:outline-none ${errors.upiId ? "border-[#cc071e]" : "border-[#e5e5e5]"
                        }`}
                      placeholder="name@bank"
                    />
                    {errors.upiId && <p className="mt-1 text-xs text-[#cc071e]">{errors.upiId}</p>}
                  </div>
                </label>

                <label className={`block rounded-2xl border p-3 sm:p-4 lg:p-4 transition-all ${paymentMethod === "cod" ? "border-[#cc071e]" : "border-[#e5e5e5]"
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm lg:text-sm font-semibold">Cash on Delivery (COD)</span>
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
            <div className="rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:p-5 lg:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] lg:sticky lg:top-24">
              <h2 className="text-sm sm:text-base lg:text-lg font-bold uppercase ">Order Summary</h2>

              <div className="mt-4 sm:mt-5 lg:mt-6 space-y-3 sm:space-y-4 lg:space-y-4">
                {items.length === 0 ? (
                  <p className="text-sm text-[#555555]">Your cart is currently empty.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.variant_id} className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-[#f1f1f1]">
                        <Image src={item.image} alt={item.product_name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{item.product_name}</p>
                        <p className="text-xs text-[#555555]">
                          {item.size_label} | Qty {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="my-4 sm:my-5 lg:my-6 h-px bg-[#e5e5e5]" />

              <div className="space-y-2 sm:space-y-3 lg:space-y-3 text-xs sm:text-sm lg:text-sm text-[#555555]">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#111111]">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : `₹${shippingCost.toLocaleString("en-IN")}`}</span>
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
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>

              <div className="mt-4 sm:mt-5 lg:mt-6 space-y-2 sm:space-y-3 lg:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-3">
                  <input
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                    placeholder="Enter discount code"
                    className="h-10 sm:h-11 lg:h-12 flex-1 rounded-full border border-[#e5e5e5] bg-white px-4 text-xs sm:text-sm lg:text-sm focus:border-[#cc071e] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="h-10 sm:h-11 lg:h-12 rounded-full border border-[#cc071e] px-3 sm:px-4 lg:px-4 text-xs font-bold uppercase text-[#cc071e] transition-all hover:bg-[#cc071e] hover:text-white"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-xs font-semibold text-[#16a34a]">Coupon applied successfully.</p>
                )}
              </div>

              {orderError && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {orderError}
                </div>
              )}

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting || items.length === 0}
                className="mt-4 sm:mt-5 lg:mt-6 w-full rounded-full bg-[#cc071e] py-3 sm:py-4 lg:py-4 text-xs font-bold uppercase text-white transition-all hover:bg-red-700 hover:shadow-[0_12px_30px_rgba(204,7,30,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
              <p className="mt-2 sm:mt-3 lg:mt-3 text-center text-xs text-[#555555]">Secure and encrypted payment.</p>
            </div>
          </aside>
        </div>
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-[#e5e5e5] bg-white p-3 sm:p-4 lg:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between text-xs sm:text-sm lg:text-sm font-semibold">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
          <button type="submit" form="checkout-form" disabled={isSubmitting || items.length === 0} className="mt-2 sm:mt-3 lg:mt-3 w-full rounded-full bg-[#cc071e] py-2 sm:py-3 lg:py-3 text-xs font-bold uppercase text-white disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </button>
          <p className="mt-2 text-center text-xs text-[#555555]">Secure and encrypted payment.</p>
        </div>
      )}

      <Footer />
    </main>
  );
}
