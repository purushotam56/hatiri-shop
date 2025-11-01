"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useAuth } from "./auth-context";

export interface CartItem {
  id: number;
  productId?: number;
  variantId?: number;
  name: string;
  price: number;
  quantity: number;
  currency: string;
  unit?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_URL = "http://localhost:3333/api";

export function CartProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn, user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [localCart, setLocalCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load local cart from localStorage on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setLocalCart(JSON.parse(storedCart));
      }
    }
  }, []);

  // Fetch cart from backend only when user logs in
  useEffect(() => {
    if (isLoggedIn && mounted) {
      fetchCart();
    }
  }, [isLoggedIn, mounted]);

  // Save local cart to localStorage when not logged in
  useEffect(() => {
    if (!isLoggedIn && mounted && typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(localCart));
    }
  }, [localCart, isLoggedIn, mounted]);

  const fetchCart = async () => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.items) {
        setCart(data.items);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncCart = async () => {
    if (!isLoggedIn) return;
    try {
      // Sync local cart items to backend
      for (const item of localCart) {
        await fetch(`${API_URL}/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(item),
        });
      }
      setLocalCart([]);
      await fetchCart();
    } catch (error) {
      console.error("Failed to sync cart:", error);
    }
  };

  const addToCart = async (product: any) => {
    if (isLoggedIn) {
      // Add to backend
      try {
        const response = await fetch(`${API_URL}/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            productId: product.productId || product.id,
            variantId: product.variantId || product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity || 1,
            currency: product.currency || "AED",
            unit: product.unit,
          }),
        });
        const data = await response.json();
        if (data.item) {
          await fetchCart();
        }
      } catch (error) {
        console.error("Failed to add to cart:", error);
      }
    } else {
      // Add to local cart
      const existing = localCart.find(
        (item) => item.variantId === (product.variantId || product.id)
      );
      if (existing) {
        setLocalCart(
          localCart.map((item) =>
            item.variantId === (product.variantId || product.id)
              ? { ...item, quantity: item.quantity + (product.quantity || 1) }
              : item
          )
        );
      } else {
        setLocalCart([
          ...localCart,
          {
            id: product.id || Date.now(),
            productId: product.productId,
            variantId: product.variantId || product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity || 1,
            currency: product.currency || "AED",
            unit: product.unit,
          },
        ]);
      }
    }
  };

  const removeFromCart = async (id: number) => {
    if (isLoggedIn) {
      try {
        await fetch(`${API_URL}/cart/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        await fetchCart();
      } catch (error) {
        console.error("Failed to remove from cart:", error);
      }
    } else {
      setLocalCart(localCart.filter((item) => item.id !== id));
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id);
    } else if (isLoggedIn) {
      try {
        await fetch(`${API_URL}/cart/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ quantity }),
        });
        await fetchCart();
      } catch (error) {
        console.error("Failed to update quantity:", error);
      }
    } else {
      setLocalCart(
        localCart.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (isLoggedIn) {
      try {
        await fetch(`${API_URL}/cart`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCart([]);
      } catch (error) {
        console.error("Failed to clear cart:", error);
      }
    } else {
      setLocalCart([]);
    }
  };

  const displayCart = isLoggedIn ? cart : localCart;
  const cartCount = displayCart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = displayCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart: displayCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isLoading,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
