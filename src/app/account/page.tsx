"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
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

// ---------- Types ----------
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

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-indigo-100 text-indigo-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
};

const TABS: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "orders", label: "Orders", icon: FiPackage },
    { key: "wishlist", label: "Wishlist", icon: FiHeart },
    { key: "addresses", label: "Addresses", icon: FiMapPin },
    { key: "settings", label: "Settings", icon: FiSettings },
];

const FALLBACK = "/product/fallback.png";

export default function AccountPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-[#f8f8f8]">
                <Navbar />
                <div className="flex items-center justify-center py-32">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#cc071e] border-t-transparent" />
                </div>
            </main>
        }>
            <AccountPageInner />
        </Suspense>
    );
}

function AccountPageInner() {
    const { user, profile, loading: authLoading, logout } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialTab = (searchParams.get("tab") as Tab) || "orders";

    const [activeTab, setActiveTab] = useState<Tab>(initialTab);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) router.push("/login");
    }, [authLoading, user, router]);

    if (authLoading || !user) {
        return (
            <main className="min-h-screen bg-[#f8f8f8]">
                <Navbar />
                <div className="flex items-center justify-center py-32">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#cc071e] border-t-transparent" />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f8f8f8] text-[#111111]">
            <Navbar />
            <div className="mx-auto max-w-7xl px-4 py-7 sm:py-8 lg:py-12 lg:px-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8 lg:mb-8">
                    <h1 className="text-xl font-extrabold uppercase sm:text-2xl lg:text-3xl">My Account</h1>
                    <p className="mt-1 text-xs text-[#555555] sm:text-sm lg:text-sm">Welcome back, {profile?.full_name || user.email}</p>
                </div>

                <div className="grid gap-6 sm:gap-8 lg:grid-cols-12">
                    {/* Sidebar */}
                    <aside className="lg:col-span-3">
                        <div className="rounded-2xl border border-[#e5e5e5] bg-white p-4 shadow-sm">
                            {/* Profile summary */}
                            <div className="flex items-center gap-3 border-b border-[#f3f3f3] pb-4 mb-4">
                                <div className="h-10 w-10 rounded-full bg-[#cc071e] flex items-center justify-center text-white text-base font-bold shrink-0 sm:h-12 sm:w-12 sm:text-lg lg:h-12 lg:w-12 lg:text-lg">
                                    {(profile?.full_name || user.email || "U")[0].toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-xs truncate sm:text-sm lg:text-sm">{profile?.full_name || "User"}</p>
                                    <p className="text-[10px] text-[#666] truncate sm:text-xs lg:text-xs">{user.email}</p>
                                </div>
                            </div>

                            {/* Tabs */}
                            <nav className="space-y-1">
                                {TABS.map((t) => {
                                    const Icon = t.icon;
                                    return (
                                        <button
                                            key={t.key}
                                            onClick={() => setActiveTab(t.key)}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 sm:px-4 sm:py-3 sm:text-sm sm:gap-3 lg:px-4 lg:py-3 lg:text-sm lg:gap-3 ${activeTab === t.key
                                                ? "bg-[#cc071e] text-white"
                                                : "text-[#333] hover:bg-[#f3f3f3]"
                                                }`}
                                        >
                                            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                            {t.label}
                                        </button>
                                    );
                                })}
                            </nav>

                            <button
                                onClick={logout}
                                className="mt-4 w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#cc071e] hover:bg-red-50 transition-colors flex items-center gap-2 sm:px-4 sm:py-3 sm:text-sm sm:gap-3 lg:px-4 lg:py-3 lg:text-sm lg:gap-3"
                            >
                                <FiLogOut className="h-4 w-4 sm:h-5 sm:w-5" /> Logout
                            </button>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="lg:col-span-9">
                        {activeTab === "orders" && <OrdersTab userId={user.id} />}
                        {activeTab === "wishlist" && <WishlistTab />}
                        {activeTab === "addresses" && <AddressesTab userId={user.id} />}
                        {activeTab === "settings" && <SettingsTab />}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

// ===================== ORDERS TAB =====================
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

    if (loading)
        return <div className="text-center py-12 text-xs text-[#999] sm:py-16 sm:text-sm lg:py-16 lg:text-sm">Loading orders...</div>;

    if (orders.length === 0)
        return (
            <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 text-center sm:p-8 lg:p-10">
                <p className="text-base font-bold sm:text-lg lg:text-lg">No orders yet</p>
                <p className="mt-2 text-xs text-[#666] sm:text-sm lg:text-sm">Start shopping to see your orders here.</p>
                <Link href="/upper" className="mt-4 inline-block rounded-full bg-[#cc071e] px-5 py-2 text-xs font-bold uppercase text-white hover:bg-red-700 transition sm:px-6 sm:text-sm lg:px-6 lg:text-sm">
                    Shop Now
                </Link>
            </div>
        );

    return (
        <div className="space-y-3 sm:space-y-4 lg:space-y-4">
            <h2 className="text-xs font-bold uppercase sm:text-sm lg:text-sm">Order History</h2>
            {orders.map((o) => (
                <div key={o.id} className="rounded-2xl border border-[#e5e5e5] bg-white overflow-hidden shadow-sm">
                    <button
                        onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                        className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-[#fafafa] transition sm:px-5 sm:py-4 lg:px-5 lg:py-4"
                    >
                        <div className="flex items-center gap-2 flex-wrap sm:gap-4">
                            <span className="font-mono text-[10px] font-bold text-[#cc071e] sm:text-xs lg:text-xs">{o.order_number}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize sm:px-2.5 sm:text-xs lg:text-xs ${STATUS_COLORS[o.status] || "bg-gray-100 text-gray-800"}`}>
                                {o.status}
                            </span>
                            <span className="text-[10px] text-[#999] sm:text-xs lg:text-xs">{new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-xs font-bold sm:text-sm lg:text-sm">₹{o.total_amount?.toLocaleString("en-IN")}</span>
                            <span className="text-[#999] text-base sm:text-lg lg:text-lg">{expanded === o.id ? "−" : "+"}</span>
                        </div>
                    </button>
                    {expanded === o.id && (
                        <div className="border-t border-[#f3f3f3] px-4 py-3 sm:px-5 sm:py-4 lg:px-5 lg:py-4">
                            <table className="w-full text-[10px] sm:text-xs lg:text-xs">
                                <thead>
                                    <tr className="text-[#999] uppercase border-b border-[#f3f3f3]">
                                        <th className="text-left py-2">Product</th>
                                        <th className="text-left py-2">Variant</th>
                                        <th className="text-center py-2">Qty</th>
                                        <th className="text-right py-2">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {o.order_items.map((item) => (
                                        <tr key={item.id} className="border-b border-[#f9f9f9] last:border-0">
                                            <td className="py-2.5 font-semibold">{item.product_name}</td>
                                            <td className="py-2.5 text-[#666]">{item.color_name} / {item.size_label}</td>
                                            <td className="py-2.5 text-center">{item.quantity}</td>
                                            <td className="py-2.5 text-right font-semibold">₹{item.total_price.toLocaleString("en-IN")}</td>
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

// ===================== WISHLIST TAB =====================
function WishlistTab() {
    const { items: wishlistItems, removeItem } = useWishlist();

    if (wishlistItems.length === 0)
        return (
            <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 text-center sm:p-8 lg:p-10">
                <p className="text-base font-bold sm:text-lg lg:text-lg">Your wishlist is empty</p>
                <p className="mt-2 text-xs text-[#666] sm:text-sm lg:text-sm">Save products you love to find them later.</p>
                <Link href="/upper" className="mt-4 inline-block rounded-full bg-[#cc071e] px-5 py-2 text-xs font-bold uppercase text-white hover:bg-red-700 transition sm:px-6 sm:text-sm lg:px-6 lg:text-sm">
                    Browse Products
                </Link>
            </div>
        );

    return (
        <div className="space-y-3 sm:space-y-4 lg:space-y-4">
            <h2 className="text-xs font-bold uppercase sm:text-sm lg:text-sm">My Wishlist ({wishlistItems.length})</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-3 lg:gap-4">
                {wishlistItems.map((item) => (
                    <div key={item.id} className="group relative rounded-xl border border-[#e5e5e5] bg-white overflow-hidden shadow-sm hover:shadow-md transition">
                        <Link href={`/products/${item.id}`}>
                            <div className="relative aspect-square bg-[#f3f3f3]">
                                <Image
                                    src={item.image || FALLBACK}
                                    alt={item.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-2 sm:p-3 lg:p-3">
                                <p className="text-[10px] font-medium uppercase text-[#999]">{item.category}</p>
                                <p className="mt-1 text-xs font-bold uppercase truncate">{item.name}</p>
                                <p className="mt-1 text-xs font-bold text-[#cc071e] sm:text-sm lg:text-sm">₹{item.price.toLocaleString("en-IN")}</p>
                            </div>
                        </Link>
                        <button
                            onClick={() => removeItem(item.id)}
                            className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/90 flex items-center justify-center text-[#cc071e] text-xs shadow hover:bg-red-50 transition sm:top-2 sm:right-2 sm:h-7 sm:w-7 lg:top-2 lg:right-2 lg:h-7 lg:w-7"
                            aria-label="Remove from wishlist"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ===================== ADDRESSES TAB =====================
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
            .from("addresses")
            .select("*")
            .eq("user_id", userId)
            .order("is_default", { ascending: false })
            .order("updated_at", { ascending: false })
            .then(({ data }) => {
                if (!cancelled) {
                    setAddresses((data as Address[]) || []);
                    setLoading(false);
                }
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
            is_default: addresses.length === 0, // First address is default
        };
        if (editing) {
            await supabase.from("addresses").update(data).eq("id", editing.id);
        } else {
            await supabase.from("addresses").insert(data);
        }
        setEditing(null);
        setShowForm(false);
        refresh();
    };

    if (loading) return <div className="text-center py-12 text-xs text-[#999] sm:py-16 sm:text-sm lg:py-16 lg:text-sm">Loading addresses...</div>;

    return (
        <div className="space-y-3 sm:space-y-4 lg:space-y-4">
            <div className="flex items-center justify-between gap-2">
                <h2 className="text-xs font-bold uppercase sm:text-sm lg:text-sm">Saved Addresses</h2>
                <button
                    onClick={() => { setEditing(null); setShowForm(true); }}
                    className="rounded-full bg-[#cc071e] px-3 py-1.5 text-[10px] font-bold uppercase text-white hover:bg-red-700 transition sm:px-4 sm:py-2 sm:text-xs lg:px-4 lg:py-2 lg:text-xs"
                >
                    + Add Address
                </button>
            </div>

            {/* Address form modal */}
            {(showForm || editing) && (
                <div className="rounded-2xl border border-[#e5e5e5] bg-white p-4 shadow-sm sm:p-5 lg:p-5">
                    <h3 className="text-xs font-bold uppercase mb-3 sm:text-sm sm:mb-4 lg:text-sm lg:mb-4">{editing ? "Edit Address" : "New Address"}</h3>
                    <form onSubmit={handleSave} className="grid gap-2 sm:grid-cols-2 sm:gap-3 lg:gap-3">
                        <input name="label" defaultValue={editing?.label || "Home"} placeholder="Label (e.g. Home, Office)"
                            className="rounded-full border border-[#e5e5e5] px-3 py-2 text-xs focus:border-[#cc071e] focus:outline-none sm:px-4 sm:py-2.5 sm:text-sm lg:text-sm" />
                        <input name="full_name" required defaultValue={editing?.full_name || ""} placeholder="Full Name"
                            className="rounded-full border border-[#e5e5e5] px-3 py-2 text-xs focus:border-[#cc071e] focus:outline-none sm:px-4 sm:py-2.5 sm:text-sm lg:text-sm" />
                        <input name="phone" required defaultValue={editing?.phone || ""} placeholder="Phone"
                            className="rounded-full border border-[#e5e5e5] px-3 py-2 text-xs focus:border-[#cc071e] focus:outline-none sm:px-4 sm:py-2.5 sm:text-sm lg:text-sm" />
                        <input name="address_line_1" required defaultValue={editing?.address_line_1 || ""} placeholder="Address Line 1"
                            className="sm:col-span-2 rounded-full border border-[#e5e5e5] px-3 py-2 text-xs focus:border-[#cc071e] focus:outline-none sm:px-4 sm:py-2.5 sm:text-sm lg:text-sm" />
                        <input name="address_line_2" defaultValue={editing?.address_line_2 || ""} placeholder="Address Line 2 (optional)"
                            className="sm:col-span-2 rounded-full border border-[#e5e5e5] px-3 py-2 text-xs focus:border-[#cc071e] focus:outline-none sm:px-4 sm:py-2.5 sm:text-sm lg:text-sm" />
                        <input name="city" required defaultValue={editing?.city || ""} placeholder="City"
                            className="rounded-full border border-[#e5e5e5] px-3 py-2 text-xs focus:border-[#cc071e] focus:outline-none sm:px-4 sm:py-2.5 sm:text-sm lg:text-sm" />
                        <input name="state" required defaultValue={editing?.state || ""} placeholder="State"
                            className="rounded-full border border-[#e5e5e5] px-3 py-2 text-xs focus:border-[#cc071e] focus:outline-none sm:px-4 sm:py-2.5 sm:text-sm lg:text-sm" />
                        <input name="postal_code" required defaultValue={editing?.postal_code || ""} placeholder="Postal Code"
                            className="rounded-full border border-[#e5e5e5] px-3 py-2 text-xs focus:border-[#cc071e] focus:outline-none sm:px-4 sm:py-2.5 sm:text-sm lg:text-sm" />
                        <input name="country" required defaultValue={editing?.country || "India"} placeholder="Country"
                            className="rounded-full border border-[#e5e5e5] px-3 py-2 text-xs focus:border-[#cc071e] focus:outline-none sm:px-4 sm:py-2.5 sm:text-sm lg:text-sm" />
                        <div className="sm:col-span-2 flex gap-2 mt-2 sm:gap-3">
                            <button type="submit" className="rounded-full bg-[#cc071e] px-4 py-2 text-[10px] font-bold uppercase text-white hover:bg-red-700 transition sm:px-6 sm:py-2.5 sm:text-xs lg:text-xs">
                                {editing ? "Update" : "Save"} Address
                            </button>
                            <button type="button" onClick={() => { setEditing(null); setShowForm(false); }}
                                className="rounded-full border border-[#e5e5e5] px-4 py-2 text-[10px] font-bold uppercase hover:bg-[#f3f3f3] transition sm:px-6 sm:py-2.5 sm:text-xs lg:text-xs">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {addresses.length === 0 && !showForm ? (
                <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 text-center sm:p-8 lg:p-10">
                    <p className="text-base font-bold sm:text-lg lg:text-lg">No saved addresses</p>
                    <p className="mt-2 text-xs text-[#666] sm:text-sm lg:text-sm">Add an address to speed up your checkout.</p>
                </div>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-4">
                    {addresses.map((a) => (
                        <div key={a.id} className={`rounded-2xl border bg-white p-4 shadow-sm relative sm:p-5 lg:p-5 ${a.is_default ? "border-[#cc071e]" : "border-[#e5e5e5]"}`}>
                            {a.is_default && (
                                <span className="absolute top-2 right-2 bg-[#cc071e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase sm:top-3 sm:right-3">Default</span>
                            )}
                            <p className="text-[10px] font-bold uppercase text-[#999] mb-2 sm:text-xs lg:text-xs">{a.label || "Address"}</p>
                            <p className="text-xs font-semibold sm:text-sm lg:text-sm">{a.full_name}</p>
                            <p className="text-[10px] text-[#666] mt-1 sm:text-xs lg:text-xs">{a.address_line_1}{a.address_line_2 ? `, ${a.address_line_2}` : ""}</p>
                            <p className="text-[10px] text-[#666] sm:text-xs lg:text-xs">{a.city}, {a.state} {a.postal_code}</p>
                            <p className="text-[10px] text-[#666] sm:text-xs lg:text-xs">{a.country} · {a.phone}</p>
                            <div className="flex gap-2 mt-3">
                                <button onClick={() => { setEditing(a); setShowForm(false); }}
                                    className="text-[10px] font-semibold text-[#cc071e] hover:underline sm:text-xs lg:text-xs">Edit</button>
                                {!a.is_default && (
                                    <button onClick={() => handleSetDefault(a.id)}
                                        className="text-[10px] font-semibold text-[#333] hover:underline sm:text-xs lg:text-xs">Set Default</button>
                                )}
                                <button onClick={() => handleDelete(a.id)}
                                    className="text-[10px] font-semibold text-[#999] hover:text-red-600 hover:underline sm:text-xs lg:text-xs">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ===================== SETTINGS TAB =====================
function SettingsTab() {
    const { user, profile } = useAuth();
    const [name, setName] = useState(profile?.full_name || "");
    const [phone, setPhone] = useState(profile?.phone || "");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [pwMsg, setPwMsg] = useState("");
    const [pwSaving, setPwSaving] = useState(false);

    const handleProfileSave = async () => {
        if (!user) return;
        setSaving(true);
        await supabase.from("profiles").update({ full_name: name, phone }).eq("id", user.id);
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handlePasswordChange = async () => {
        if (!newPassword || newPassword.length < 6) {
            setPwMsg("Password must be at least 6 characters.");
            return;
        }
        setPwSaving(true);
        setPwMsg("");
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        setPwSaving(false);
        if (error) {
            setPwMsg(error.message);
        } else {
            setPwMsg("Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6 lg:space-y-6">
            {/* Profile */}
            <div className="rounded-2xl border border-[#e5e5e5] bg-white p-4 shadow-sm sm:p-5 lg:p-5">
                <h2 className="text-xs font-bold uppercase mb-3 sm:text-sm sm:mb-4 lg:text-sm lg:mb-4">Profile</h2>
                <div className="grid gap-2 sm:grid-cols-2 sm:gap-3 lg:gap-3">
                    <div>
                        <label className="text-[10px] font-semibold uppercase text-[#555] sm:text-xs lg:text-xs">Email</label>
                        <input value={user?.email || ""} disabled
                            className="mt-1 w-full rounded-full border border-[#e5e5e5] bg-[#f9f9f9] px-3 py-2 text-xs text-[#999] sm:px-4 sm:py-2.5 sm:text-sm lg:text-sm" />
                    </div>
                    <div>
                        <label className="text-[10px] font-semibold uppercase text-[#555] sm:text-xs lg:text-xs">Full Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full rounded-full border border-[#e5e5e5] px-3 py-2 text-xs focus:border-[#cc071e] focus:outline-none sm:px-4 sm:py-2.5 sm:text-sm lg:text-sm" />
                    </div>
                    <div>
                        <label className="text-[10px] font-semibold uppercase text-[#555] sm:text-xs lg:text-xs">Phone</label>
                        <input value={phone} onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 w-full rounded-full border border-[#e5e5e5] px-3 py-2 text-xs focus:border-[#cc071e] focus:outline-none sm:px-4 sm:py-2.5 sm:text-sm lg:text-sm" />
                    </div>
                </div>
                <div className="mt-3 flex items-center gap-2 sm:mt-4 sm:gap-3">
                    <button onClick={handleProfileSave} disabled={saving}
                        className="rounded-full bg-[#cc071e] px-4 py-2 text-[10px] font-bold uppercase text-white hover:bg-red-700 transition disabled:opacity-50 sm:px-6 sm:py-2.5 sm:text-xs lg:text-xs">
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                    {saved && <span className="text-[10px] text-green-600 font-semibold sm:text-xs lg:text-xs">✓ Saved</span>}
                </div>
            </div>
        
            {/* Change Password */}
            <div className="rounded-2xl border border-[#e5e5e5] bg-white p-4 shadow-sm sm:p-5 lg:p-5">
                <h2 className="text-xs font-bold uppercase mb-3 sm:text-sm sm:mb-4 lg:text-sm lg:mb-4">Change Password</h2>
                <div className="grid gap-2 sm:grid-cols-2 sm:gap-3 max-w-md">
                    <div className="sm:col-span-2">
                        <label className="text-[10px] font-semibold uppercase text-[#555] sm:text-xs lg:text-xs">Current Password</label>
                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                            className="mt-1 w-full rounded-full border border-[#e5e5e5] px-3 py-2 text-xs focus:border-[#cc071e] focus:outline-none sm:px-4 sm:py-2.5 sm:text-sm lg:text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="text-[10px] font-semibold uppercase text-[#555] sm:text-xs lg:text-xs">New Password</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 w-full rounded-full border border-[#e5e5e5] px-3 py-2 text-xs focus:border-[#cc071e] focus:outline-none sm:px-4 sm:py-2.5 sm:text-sm lg:text-sm" />
                    </div>
                </div>
                <div className="mt-3 flex items-center gap-2 sm:mt-4 sm:gap-3">
                    <button onClick={handlePasswordChange} disabled={pwSaving}
                        className="rounded-full bg-[#111] px-4 py-2 text-[10px] font-bold uppercase text-white hover:bg-[#333] transition disabled:opacity-50 sm:px-6 sm:py-2.5 sm:text-xs lg:text-xs">
                        {pwSaving ? "Updating..." : "Update Password"}
                    </button>
                    {pwMsg && <span className={`text-[10px] font-semibold sm:text-xs lg:text-xs ${pwMsg.includes("success") ? "text-green-600" : "text-[#cc071e]"}`}>{pwMsg}</span>}
                </div>
            </div>
        </div>
    );
}
