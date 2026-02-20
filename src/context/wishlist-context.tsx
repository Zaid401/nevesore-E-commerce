"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

type WishlistContextValue = {
  items: WishlistItem[];
  itemCount: number;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const addItem = (item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((wishItem) => wishItem.id === item.id);
      if (exists) {
        return prev.filter((wishItem) => wishItem.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  const itemCount = useMemo(() => items.length, [items]);

  const value = useMemo(
    () => ({ items, itemCount, addItem, removeItem, isInWishlist, clearWishlist }),
    [items, itemCount]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
