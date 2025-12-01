"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useAuth } from "./auth-context";
import { buildApiUrl } from "@/config/api";
import { CartItem, CartContextType } from "@/types/cart";

// Re-export for backward compatibility
export type { CartItem, CartContextType };

const CartContext = createContext<CartContextType | undefined>(undefined);

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
      const token = localStorage.getItem("token");
      console.log("Fetching cart with token:", token ? "present" : "missing");
      
      const response = await fetch(buildApiUrl("/cart"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("Cart fetch response status:", response.status);
      const data = await response.json();
      console.log("Cart data received:", data);
      
      if (data.items) {
        console.log("Setting cart with items:", data.items);
        setCart(data.items);
      } else if (Array.isArray(data)) {
        console.log("Cart data is array, setting directly:", data);
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
      console.log("No token found, skipping cart sync");
      return;
    }
    
    if (localCart.length === 0) {
      console.log("Local cart is empty, fetching backend cart");
      await fetchCart();
      return;
    }

    try {
      console.log("Starting cart sync, localCart items:", localCart.length);
      console.log("Syncing local cart items to backend:", localCart);
      
      // Sync local cart items to backend
      let syncedCount = 0;
      
      for (const item of localCart) {
        try {
          // Don't send the 'id' field to backend - let it create new cart items
          const { id, ...itemData } = item;
          
          console.log("Syncing item:", itemData, "Item ID was:", id);
          
          console.log("POST request body:", JSON.stringify(itemData));
          const response = await fetch(buildApiUrl("/cart"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(itemData),
          });
          
          const responseData = await response.json();
          console.log("POST response status:", response.status, "data:", responseData);
          
          if (!response.ok) {
            console.error("Failed to add item to cart:", response.status, responseData);
          } else {
            console.log("Item added to cart successfully:", responseData);
            syncedCount++;
          }
        } catch (itemError) {
          console.error("Error adding item to cart:", itemError);
        }
      }
      
      console.log(`Synced ${syncedCount}/${localCart.length} items to backend`);
      
      // Fetch the updated cart from backend with a small delay to ensure backend is updated
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Fetch fresh cart from backend
      setIsLoading(true);
      try {
        const response = await fetch(buildApiUrl("/cart"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = await response.json();
        console.log("Cart after sync:", data);
        
        if (data.items) {
          console.log("Setting backend cart with", data.items.length, "items");
          setCart(data.items);
        } else if (Array.isArray(data)) {
          console.log("Setting backend cart with", data.length, "items");
          setCart(data);
        }
        
        // Only clear local cart after we've successfully populated backend cart
        setLocalCart([]);
        console.log("Cart sync completed successfully");
      } catch (fetchError) {
        console.error("Failed to fetch cart after sync:", fetchError);
        // Don't clear local cart if fetch failed - user can retry
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to sync cart:", error);
    }
  };

  const addToCart = async (product: any) => {
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
            productId: product.productId || product.id,
            variantId: product.variantId || product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity || 1,
            currency: product.currency || "INR",
            productQuantity: product.productQuantity,
            unit: product.unit || "",
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
      const variantId = product.variantId || product.id;
      const existing = localCart.find(
        (item) => item.variantId === variantId
      );
      if (existing) {
        setLocalCart(
          localCart.map((item) =>
            item.variantId === variantId
              ? { ...item, quantity: item.quantity + (product.quantity || 1) }
              : item
          )
        );
      } else {
        setLocalCart([
          ...localCart,
          {
            id: product.id || Date.now(),
            productId: product.productId || product.id,
            variantId: product.variantId || product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity || 1,
            currency: product.currency || "INR",
            productQuantity: product.productQuantity,
            unit: product.unit,
            sku: product.sku,
            bannerImage: product.bannerImage,
            image: product.image,
            images: product.images,
          },
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
        await fetch(buildApiUrl("/cart"), {
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
