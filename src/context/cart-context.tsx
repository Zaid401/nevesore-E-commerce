"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/types/product";

export type { CartItem };

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (variant_id: string, quantity: number) => void;
  removeItem: (variant_id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "neversore_cart";

function loadFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage quota exceeded — ignore
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadFromStorage);

  // Keep localStorage in sync whenever items change
  useEffect(() => {
    saveToStorage(items);
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((c) => c.variant_id === item.variant_id);
      if (!existing) {
        return [...prev, { ...item, quantity: Math.max(1, item.quantity) }];
      }
      return prev.map((c) =>
        c.variant_id === item.variant_id
          ? { ...c, quantity: c.quantity + Math.max(1, item.quantity) }
          : c
      );
    });
  };

  const updateQuantity = (variant_id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((c) =>
        c.variant_id === variant_id ? { ...c, quantity: Math.max(1, quantity) } : c
      )
    );
  };

  const removeItem = (variant_id: string) => {
    setItems((prev) => prev.filter((c) => c.variant_id !== variant_id));
  };

  const clearCart = () => {
    setItems([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, itemCount, subtotal, addItem, updateQuantity, removeItem, clearCart }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, itemCount, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}

