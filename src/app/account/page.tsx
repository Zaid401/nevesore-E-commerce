"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { BsPlusLg } from "react-icons/bs";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiPackage, FiHeart, FiMapPin, FiSettings, FiLogOut } from "react-icons/fi";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useAuth } from "@/context/auth-context";
import { useWishlist } from "@/context/wishlist-context";
import { supabase } from "@/lib/supabase";

type Tab = "orders" | "wishlist" | "addresses" | "settings";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  shipping_full_name: string;
  order_items: OrderItem[];
}
interface OrderItem {
  id: string;
  product_name: string;
  color_name: string;
  size_label: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}
interface Address {
  id: string;
  label: string | null;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  pending:    "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed:  "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-indigo-50 text-indigo-700 border-indigo-200",
  shipped:    "bg-purple-50 text-purple-700 border-purple-200",
  delivered:  "bg-green-50 text-green-700 border-green-200",
  cancelled:  "bg-red-50 text-red-600 border-red-200",
};

const TABS: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "orders",    label: "Orders",    icon: FiPackage  },
  { key: "wishlist",  label: "Wishlist",  icon: FiHeart    },
  { key: "addresses", label: "Addresses", icon: FiMapPin   },
  { key: "settings",  label: "Settings",  icon: FiSettings },
];

const FALLBACK = "/product/fallback.png";

/* ─────────────────────────────────────────────
   Shared input style
───────────────────────────────────────────── */
const inputCls =
  "w-full rounded-full border border-[#e0ddd8] bg-[#faf9f7] px-4 py-2.5 text-sm text-[#111111] placeholder:text-[#bbbbbb] focus:border-red-400 focus:outline-none transition-colors";

/* ─────────────────────────────────────────────
   Spinner
───────────────────────────────────────────── */
function Spinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-red-600 border-t-transparent" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Empty state card
───────────────────────────────────────────── */
function EmptyState({
  title, sub, cta, href,
}: { title: string; sub: string; cta?: string; href?: string }) {
  return (
    <div className="rounded-2xl border border-[#e0ddd8] bg-white overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      <div className="bg-[#111111] px-6 py-3.5 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <p
          className="text-[#111111] mb-2 leading-tight"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(26px,4vw,38px)", letterSpacing: "0.04em" }}
        >
          {title}
        </p>
        <p className="text-sm font-light text-[#888888] mb-8 max-w-xs">{sub}</p>
        {cta && href && (
          <Link
            href={href}
            className="group inline-flex items-center gap-2.5 bg-gray-900 hover:bg-gray-700 text-white text-[11px] font-medium tracking-[0.15em] uppercase rounded-full px-7 py-3 transition-all duration-200 hover:-translate-y-0.5"
          >
            {cta}
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ROOT EXPORT
═══════════════════════════════════════════════ */
export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#faf9f7] min-h-screen">
        <Navbar />
        <Spinner />
      </div>
    }>
      <AccountPageInner />
    </Suspense>
  );
}

/* ═══════════════════════════════════════════════
   INNER PAGE
═══════════════════════════════════════════════ */
function AccountPageInner() {
  const { user, profile, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>((searchParams.get("tab") as Tab) || "orders");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <div className="bg-[#faf9f7] min-h-screen">
        <Navbar />
        <Spinner />
      </div>
    );
  }

  const initials = (profile?.full_name || user.email || "U")[0].toUpperCase();

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
            ACCOUNT
          </span>

          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pb-14 md:pb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-[10px] font-medium tracking-[0.22em] uppercase rounded-full px-3.5 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                My Account
              </div>
              <h1
                className="leading-[0.92] tracking-wide text-[#111111] mb-4"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 9vw, 100px)" }}
              >
                Welcome Back.
              </h1>
              <p className="text-base font-light text-[#444444]">
                {profile?.full_name || user.email}
              </p>
            </div>

            {/* Avatar stat */}
            <div className="md:text-right flex-shrink-0 pb-1 flex md:flex-col items-center md:items-end gap-4 md:gap-2">
              <div
                className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl flex-shrink-0"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
              >
                {initials}
              </div>
              <div>
                <p className="text-[11px] tracking-[0.18em] uppercase text-[#888888]">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── BODY ── */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 lg:gap-10 items-start">

            {/* ── SIDEBAR ── */}
            <aside className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-[#e0ddd8] bg-white overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                {/* Mac header */}
                <div className="bg-[#111111] px-5 py-3.5 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-auto text-[11px] tracking-[0.18em] uppercase text-white/30">
                    Navigation
                  </span>
                </div>

                {/* Profile summary */}
                <div className="px-5 py-5 border-b border-[#e0ddd8]">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white flex-shrink-0"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "18px" }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#111111] truncate">
                        {profile?.full_name || "Athlete"}
                      </p>
                      <p className="text-[11px] text-[#888888] truncate">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Tab nav */}
                <nav className="p-3 space-y-1">
                  {TABS.map((t) => {
                    const Icon = t.icon;
                    const active = activeTab === t.key;
                    return (
                      <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                          active
                            ? "bg-gray-900 text-white"
                            : "text-[#555555] hover:bg-[#f0edea] hover:text-[#111111]"
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span
                          className="tracking-wide"
                          style={{ fontFamily: active ? "'Bebas Neue', sans-serif" : undefined, letterSpacing: "0.06em" }}
                        >
                          {t.label}
                        </span>
                      </button>
                    );
                  })}
                </nav>

                {/* Logout */}
                <div className="px-3 pb-4">
                  <div className="h-px bg-[#e0ddd8] mb-3" />
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[#888888] hover:bg-red-50 hover:text-red-600 transition-all duration-150"
                  >
                    <FiLogOut className="w-4 h-4 flex-shrink-0" />
                    <span className="tracking-wide">Logout</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* ── CONTENT ── */}
            <div>
              {activeTab === "orders"    && <OrdersTab    userId={user.id} />}
              {activeTab === "wishlist"  && <WishlistTab  />}
              {activeTab === "addresses" && <AddressesTab userId={user.id} />}
              {activeTab === "settings"  && <SettingsTab  />}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ORDERS TAB
═══════════════════════════════════════════════ */
function OrdersTab({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("id,order_number,status,total_amount,created_at,shipping_full_name,order_items(id,product_name,color_name,size_label,quantity,unit_price,total_price)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      setOrders((data as Order[]) || []);
      setLoading(false);
    })();
  }, [userId]);

  if (loading) return <Spinner />;
  if (orders.length === 0)
    return <EmptyState title="No Orders Yet" sub="Start shopping to see your orders here." cta="Shop Now" href="/upper" />;

  return (
    <div className="space-y-4">
      <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#111111]">Order History</p>
      <h2
        className="text-[#111111] leading-tight mb-6"
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px,4vw,38px)", letterSpacing: "0.04em" }}
      >
        Your Orders
      </h2>

      {orders.map((o) => (
        <div
          key={o.id}
          className="rounded-2xl border border-[#e0ddd8] bg-white hover:border-red-200 hover:shadow-[0_8px_32px_rgba(212,0,31,0.06)] transition-all duration-300 overflow-hidden"
        >
          {/* Order header row */}
          <button
            onClick={() => setExpanded(expanded === o.id ? null : o.id)}
            className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 border-b border-[#e0ddd8] hover:bg-[#faf9f7] transition-colors"
          >
            <div className="flex items-center gap-3 flex-wrap min-w-0">
              <span
                className="text-[#111111] flex-shrink-0"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "15px", letterSpacing: "0.08em" }}
              >
                {o.order_number}
              </span>
              <span
                className={`text-[9px] font-medium tracking-[0.2em] uppercase border rounded-full px-2.5 py-1 flex-shrink-0 ${STATUS_STYLES[o.status] || "bg-[#f0edea] text-[#888888] border-[#e0ddd8]"}`}
              >
                {o.status}
              </span>
              <span className="text-[11px] text-[#888888] flex-shrink-0">
                {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span
                className="text-[#111111]"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "18px", letterSpacing: "0.04em" }}
              >
                ₹{o.total_amount?.toLocaleString("en-IN")}
              </span>
              <span className="w-6 h-6 rounded-full border border-[#e0ddd8] flex items-center justify-center text-[#888888] text-xs">
                {expanded === o.id ? "−" : "+"}
              </span>
            </div>
          </button>

          {/* Expanded items */}
          {expanded === o.id && (
            <div className="px-6 py-5 bg-[#faf9f7]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e0ddd8]">
                    {["Product", "Variant", "Qty", "Price"].map((h, i) => (
                      <th
                        key={h}
                        className={`pb-3 text-[10px] font-medium tracking-[0.2em] uppercase text-[#888888] ${i === 0 ? "text-left" : i === 2 ? "text-center" : "text-right"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {o.order_items.map((item) => (
                    <tr key={item.id} className="border-b border-[#e0ddd8] last:border-0">
                      <td className="py-3 text-sm font-medium text-[#111111]">{item.product_name}</td>
                      <td className="py-3 text-sm font-light text-[#888888]">{item.color_name} / {item.size_label}</td>
                      <td className="py-3 text-sm text-center text-[#444444]">{item.quantity}</td>
                      <td className="py-3 text-sm text-right font-medium text-[#111111]">₹{item.total_price.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   WISHLIST TAB
═══════════════════════════════════════════════ */
function WishlistTab() {
  const { items: wishlistItems, removeItem } = useWishlist();

  if (wishlistItems.length === 0)
    return <EmptyState title="Wishlist is Empty" sub="Save products you love to find them later." cta="Browse Products" href="/upper" />;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#111111] mb-1">Saved Items</p>
        <h2
          className="text-[#111111] leading-tight"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px,4vw,38px)", letterSpacing: "0.04em" }}
        >
          My Wishlist <span className="text-[#111111]">({wishlistItems.length})</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl border border-[#e0ddd8] bg-white hover:border-red-200 hover:shadow-[0_8px_32px_rgba(212,0,31,0.06)] transition-all duration-300 overflow-hidden"
          >
            <Link href={`/products/${item.id}`}>
              <div className="relative aspect-square bg-[#f0edea]">
                <Image src={item.image || FALLBACK} alt={item.name} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
              </div>
              <div className="p-4">
                <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#888888] mb-1">{item.category}</p>
                <p
                  className="text-[#111111] truncate leading-tight"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(14px,2vw,17px)", letterSpacing: "0.04em" }}
                >
                  {item.name}
                </p>
                <p className="mt-1 text-sm font-medium text-[#111111]">₹{item.price.toLocaleString("en-IN")}</p>
              </div>
            </Link>
            {/* Remove button */}
            <button
              onClick={() => removeItem(item.id)}
              aria-label="Remove from wishlist"
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white border border-[#e0ddd8] flex items-center justify-center text-[#888888] hover:text-red-600 hover:border-red-200 transition-all text-xs shadow-sm"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ADDRESSES TAB
═══════════════════════════════════════════════ */
function AddressesTab({ userId }: { userId: string }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("addresses").select("*").eq("user_id", userId)
      .order("is_default", { ascending: false })
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        if (!cancelled) { setAddresses((data as Address[]) || []); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, [userId, refreshKey]);

  const handleDelete = async (id: string) => {
    await supabase.from("addresses").delete().eq("id", id);
    refresh();
  };
  const handleSetDefault = async (id: string) => {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
    await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    refresh();
  };
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      user_id: userId,
      label: (fd.get("label") as string) || "Home",
      full_name: fd.get("full_name") as string,
      phone: fd.get("phone") as string,
      address_line_1: fd.get("address_line_1") as string,
      address_line_2: (fd.get("address_line_2") as string) || null,
      city: fd.get("city") as string,
      state: fd.get("state") as string,
      postal_code: fd.get("postal_code") as string,
      country: fd.get("country") as string,
      is_default: addresses.length === 0,
    };
    if (editing) {
      await supabase.from("addresses").update(data).eq("id", editing.id);
    } else {
      await supabase.from("addresses").insert(data);
    }
    setEditing(null); setShowForm(false); refresh();
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#111111] mb-1">Saved</p>
          <h2
            className="text-[#111111] leading-tight"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px,4vw,38px)", letterSpacing: "0.04em" }}
          >
            Addresses
          </h2>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="group inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-[11px] font-medium tracking-[0.15em] uppercase rounded-full px-5 py-2.5 transition-all duration-200 hover:-translate-y-0.5 flex-shrink-0"
        >
          <BsPlusLg className="text-white font-medium text-[17px]" /> Add Address
        </button>
      </div>

      {/* Address Form */}
      {(showForm || editing) && (
        <div className="rounded-2xl border border-[#e0ddd8] bg-white overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <div className="bg-[#111111] px-6 py-3.5 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-auto text-[11px] tracking-[0.18em] uppercase text-white/30">
              {editing ? "Edit Address" : "New Address"}
            </span>
          </div>
          <div className="p-6">
            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: "label",          placeholder: "Label (e.g. Home, Office)", defaultValue: editing?.label ?? "Home",           span: false },
                { name: "full_name",      placeholder: "Full Name",                 defaultValue: editing?.full_name ?? "",            span: false },
                { name: "phone",          placeholder: "Phone",                     defaultValue: editing?.phone ?? "",                span: false },
                { name: "address_line_1", placeholder: "Address Line 1",            defaultValue: editing?.address_line_1 ?? "",       span: true  },
                { name: "address_line_2", placeholder: "Address Line 2 (optional)", defaultValue: editing?.address_line_2 ?? "",       span: true  },
                { name: "city",           placeholder: "City",                      defaultValue: editing?.city ?? "",                 span: false },
                { name: "state",          placeholder: "State",                     defaultValue: editing?.state ?? "",                span: false },
                { name: "postal_code",    placeholder: "Postal Code",               defaultValue: editing?.postal_code ?? "",          span: false },
                { name: "country",        placeholder: "Country",                   defaultValue: editing?.country ?? "India",         span: false },
              ].map((f) => (
                <input
                  key={f.name}
                  name={f.name}
                  placeholder={f.placeholder}
                  defaultValue={f.defaultValue}
                  className={`${inputCls} ${f.span ? "sm:col-span-2" : ""}`}
                />
              ))}
              <div className="sm:col-span-2 flex gap-3 pt-2">
                <button
                  type="submit"
                  className="group inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-medium tracking-[0.12em] uppercase rounded-full px-4 py-2 transition-all duration-200"
                >
                  {editing ? "Update" : "Save"} Address
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setEditing(null); setShowForm(false); }}
                  className="inline-flex items-center border border-[#e0ddd8] text-[#888888] hover:border-gray-300 hover:text-[#111111] text-[11px] font-medium tracking-[0.15em] uppercase rounded-full px-6 py-2.5 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Address list */}
      {addresses.length === 0 && !showForm ? (
        <EmptyState title="No Saved Addresses" sub="Add an address to speed up your checkout." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <div
              key={a.id}
              className={`relative rounded-2xl border bg-white transition-all duration-200 overflow-hidden ${
                a.is_default ? "border-red-300 shadow-[0_4px_20px_rgba(212,0,31,0.08)]" : "border-[#e0ddd8]"
              }`}
            >
              {/* Default badge */}
              {a.is_default && (
                <div className="bg-gray-900 px-4 py-1.5 flex items-center gap-2">
                  <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-white">Default Address</span>
                </div>
              )}

              <div className="p-5">
                <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#888888] mb-2">
                  {a.label || "Address"}
                </p>
                <p className="text-sm font-medium text-[#111111]">{a.full_name}</p>
                <p className="text-sm font-light text-[#666666] mt-1 leading-relaxed">
                  {a.address_line_1}{a.address_line_2 ? `, ${a.address_line_2}` : ""}
                  <br />{a.city}, {a.state} {a.postal_code}
                  <br />{a.country} · {a.phone}
                </p>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#e0ddd8]">
                  <button
                    onClick={() => { setEditing(a); setShowForm(false); }}
                    className="text-[11px] font-medium tracking-[0.1em] uppercase text-red-600 hover:opacity-70 transition-opacity"
                  >
                    Edit
                  </button>
                  {!a.is_default && (
                    <button
                      onClick={() => handleSetDefault(a.id)}
                      className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#444444] hover:text-[#111111] transition-colors"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#cccccc] hover:text-red-600 transition-colors ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SETTINGS TAB
═══════════════════════════════════════════════ */
function SettingsTab() {
  const { user, profile } = useAuth();
  const [name, setName]   = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [pwMsg, setPwMsg]   = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  const handleProfileSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("profiles").update({ full_name: name, phone }).eq("id", user.id);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 6) { setPwMsg("Password must be at least 6 characters."); return; }
    setPwSaving(true); setPwMsg("");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwSaving(false);
    if (error) { setPwMsg(error.message); }
    else { setPwMsg("Password updated successfully!"); setCurrentPassword(""); setNewPassword(""); }
  };

  /* shared section card */
  const SectionCard = ({ header, children }: { header: string; children: React.ReactNode }) => (
    <div className="rounded-2xl border border-[#e0ddd8] bg-white overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      <div className="bg-[#111111] px-6 py-3.5 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-auto text-[11px] tracking-[0.18em] uppercase text-white/30">{header}</span>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-red-600 mb-1">Account</p>
        <h2
          className="text-[#111111] leading-tight mb-6"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px,4vw,38px)", letterSpacing: "0.04em" }}
        >
          Settings
        </h2>
      </div>

      {/* Profile card */}
      <SectionCard header="Profile">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#888888] mb-1.5">Email</p>
            <input value={user?.email || ""} disabled className={`${inputCls} opacity-50 cursor-not-allowed`} />
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#888888] mb-1.5">Full Name</p>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#888888] mb-1.5">Phone</p>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleProfileSave}
            disabled={saving}
            className="group inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white text-[11px] font-medium tracking-[0.15em] uppercase rounded-full px-6 py-2.5 transition-all duration-200 hover:-translate-y-0.5"
          >
            {saving ? "Saving…" : "Save Changes"}
            {!saving && <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>}
          </button>
          {saved && (
            <span className="text-[11px] font-medium text-green-600 tracking-wide">✓ Saved</span>
          )}
        </div>
      </SectionCard>

      {/* Password card */}
      <SectionCard header="Security">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 max-w-lg">
          <div className="sm:col-span-2">
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#888888] mb-1.5">Current Password</p>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#888888] mb-1.5">New Password</p>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className={inputCls}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePasswordChange}
            disabled={pwSaving}
            className="group inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white text-[11px] font-medium tracking-[0.15em] uppercase rounded-full px-6 py-2.5 transition-all duration-200 hover:-translate-y-0.5"
          >
            {pwSaving ? "Updating…" : "Update Password"}
            {!pwSaving && <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>}
          </button>
          {pwMsg && (
            <span className={`text-[11px] font-medium tracking-wide ${pwMsg.includes("success") ? "text-green-600" : "text-red-600"}`}>
              {pwMsg}
            </span>
          )}
        </div>
      </SectionCard>
    </div>
  );
}