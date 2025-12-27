"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

import { useAuth } from "./auth-context";

import { buildApiUrl } from "@/config/api";
import { CartItem, CartContextType } from "@/types/cart";
import { BannerImage } from "@/types/product";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn, user: _user } = useAuth();
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
      const token = localStorage.getItem("token");

      const response = await fetch(buildApiUrl("/cart"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.items) {
        setCart(data.items);
      } else if (Array.isArray(data)) {
        setCart(data);
      } else {
        console.warn("Unexpected cart response structure:", data);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncCart = async () => {
    // Check token directly instead of isLoggedIn state (which may not update immediately)
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    if (localCart.length === 0) {
      await fetchCart();

      return;
    }

    try {
      // Sync local cart items to backend
      let _syncedCount = 0;

      for (const item of localCart) {
        try {
          // Don't send the 'id' field to backend - let it create new cart items
          const { id: _id, ...itemData } = item;

          const response = await fetch(buildApiUrl("/cart"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(itemData),
          });

          const responseData = await response.json();

          if (!response.ok) {
            // console.error(
            //   "Failed to add item to cart:",
            //   response.status,
            //   responseData,
            // );
          } else {
            _syncedCount++;
          }
        } catch (itemError) {
          // console.error("Error adding item to cart:", itemError);
        }
      }

      // Fetch the updated cart from backend with a small delay to ensure backend is updated
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Fetch fresh cart from backend
      setIsLoading(true);
      try {
        const response = await fetch(buildApiUrl("/cart"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.items) {
          setCart(data.items);
        } else if (Array.isArray(data)) {
          setCart(data);
        }

        // Only clear local cart after we've successfully populated backend cart
        setLocalCart([]);
      } catch (_fetchError) {
        // Don't clear local cart if fetch failed - user can retry
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      // console.error("Failed to sync cart:", error);
    }
  };

  const addToCart = async (product: Record<string, unknown>) => {
    if (isLoggedIn) {
      // Add to backend
      try {
        const response = await fetch(buildApiUrl("/cart"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            productId: (product.productId as number | undefined) || (product.id as number | undefined),
            variantId: (product.variantId as number | undefined) || (product.id as number | undefined),
            name: (product.name as string) || "",
            price: (product.price as number) || 0,
            quantity: (product.quantity as number | undefined) || 1,
            currency: (product.currency as string | undefined) || "INR",
            productQuantity: product.productQuantity as number | undefined,
            unit: (product.unit as string | undefined) || "",
          }),
        });
        const data = await response.json();

        if (data.item) {
          await fetchCart();
        }
      } catch (error) {
        // console.error("Failed to add to cart:", error);
      }
    } else {
      // Add to local cart
      const variantId = (product.variantId as number | undefined) || (product.id as number | undefined);
      const existing = localCart.find((item) => item.variantId === variantId);

      if (existing) {
        setLocalCart(
          localCart.map((item) =>
            item.variantId === variantId
              ? { ...item, quantity: item.quantity + ((product.quantity as number | undefined) || 1) }
              : item,
          ),
        );
      } else {
        setLocalCart([
          ...localCart,
          {
            id: (product.id as number | undefined) || Date.now(),
            productId: (product.productId as number | undefined) || (product.id as number | undefined),
            variantId: (product.variantId as number | undefined) || (product.id as number | undefined),
            name: (product.name as string) || "",
            price: (product.price as number) || 0,
            quantity: (product.quantity as number | undefined) || 1,
            currency: (product.currency as string | undefined) || "INR",
            productQuantity: product.productQuantity as number | undefined,
            unit: product.unit as string | undefined,
            sku: product.sku as string | undefined,
            bannerImage: (product.bannerImage as BannerImage | string | undefined),
            image: (product.image as BannerImage | string | undefined),
            images: Array.isArray(product.images) ? product.images : undefined,
          } as CartItem,
        ]);
      }
    }
  };

  const removeFromCart = async (id: number) => {
    if (isLoggedIn) {
      try {
        await fetch(buildApiUrl(`/cart/${id}`), {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        await fetchCart();
      } catch (error) {
        // console.error("Failed to remove from cart:", error);
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
        await fetch(buildApiUrl(`/cart/${id}`), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ quantity }),
        });
        await fetchCart();
      } catch (error) {
        // console.error("Failed to update quantity:", error);
      }
    } else {
      setLocalCart(
        localCart.map((item) =>
          item.id === id ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const clearCart = async () => {
    if (isLoggedIn) {
      try {
        await fetch(buildApiUrl("/cart"), {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCart([]);
      } catch (error) {
        // console.error("Failed to clear cart:", error);
      }
    } else {
      setLocalCart([]);
    }
  };

  const displayCart = isLoggedIn ? cart : localCart;
  const cartCount = displayCart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = displayCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
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
