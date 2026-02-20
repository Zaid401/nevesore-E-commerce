"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  category: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, color: string, size: string, quantity: number) => void;
  removeItem: (id: string, color: string, size: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const getItemKey = (id: string, color: string, size: string) =>
  `${id}-${color}-${size}`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const key = getItemKey(item.id, item.color, item.size);
      const existing = prev.find((cartItem) =>
        getItemKey(cartItem.id, cartItem.color, cartItem.size) === key
      );

      if (!existing) {
        return [...prev, { ...item, quantity: Math.max(1, item.quantity) }];
      }

      return prev.map((cartItem) =>
        getItemKey(cartItem.id, cartItem.color, cartItem.size) === key
          ? { ...cartItem, quantity: cartItem.quantity + Math.max(1, item.quantity) }
          : cartItem
      );
    });
  };

  const updateQuantity = (id: string, color: string, size: string, quantity: number) => {
    setItems((prev) => {
      const nextQuantity = Math.max(1, quantity);
      return prev.map((cartItem) =>
        getItemKey(cartItem.id, cartItem.color, cartItem.size) === getItemKey(id, color, size)
          ? { ...cartItem, quantity: nextQuantity }
          : cartItem
      );
    });
  };

  const removeItem = (id: string, color: string, size: string) => {
    setItems((prev) =>
      prev.filter(
        (cartItem) =>
          getItemKey(cartItem.id, cartItem.color, cartItem.size) !== getItemKey(id, color, size)
      )
    );
  };

  const clearCart = () => {
    setItems([]);
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
    [items, itemCount, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
