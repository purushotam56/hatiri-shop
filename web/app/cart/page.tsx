"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { CartItem } from "@/types/cart";

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");

    if (storedCart) {
      Promise.resolve().then(() => {
        setItems(JSON.parse(storedCart));
      });
    }
    Promise.resolve().then(() => {
      setLoading(false);
    });
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, loading]);

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      setItems(
        items.map((item) => (item.id === id ? { ...item, quantity } : item)),
      );
    }
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = items.length > 0 ? 30 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-slate-600 font-semibold">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-2"
            onClick={() => router.back()}
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            🛒 Shopping Cart
          </h1>
          <div className="w-24 text-right">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        /* Empty Cart */
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center py-20">
            <div className="text-8xl mb-4">🛍️</div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-slate-600 text-lg mb-8">
              Add items from the store to get started!
            </p>
            <button
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
              onClick={() => router.push("/")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        /* Cart with Items */
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 hover:border-blue-400 transition-all"
                >
                  <div className="flex items-start gap-6">
                    {/* Product Icon */}
                    <div className="text-5xl flex-shrink-0">📦</div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 mb-1">
                            {item.name}
                          </h3>
                          <div className="space-y-1">
                            {item.productQuantity && item.unit && (
                              <p className="text-sm text-slate-600 font-medium">
                                {item.productQuantity} {item.unit}
                              </p>
                            )}
                            {item.sku && (
                              <p className="text-xs text-slate-500 font-mono">
                                SKU: {item.sku}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          className="text-red-500 hover:text-red-700 font-bold text-xl transition-colors"
                          onClick={() => removeItem(item.id)}
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Price */}
                        <div>
                          <p className="text-sm text-slate-600 mb-1">
                            Unit Price
                          </p>
                          <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                            ₹{parseFloat(String(item.price)).toFixed(0)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-1">
                          <button
                            className="px-4 py-2 text-slate-600 hover:bg-white rounded-md transition-colors font-bold"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            −
                          </button>
                          <span className="px-4 py-2 text-slate-900 font-bold text-lg min-w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="px-4 py-2 text-slate-600 hover:bg-white rounded-md transition-colors font-bold"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-sm text-slate-600 mb-1">Total</p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                            ₹{(item.price * item.quantity).toFixed(0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20 border-2 border-blue-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-600 font-medium">Subtotal</p>
                    <p className="text-lg font-bold text-slate-900">
                      ₹{subtotal.toFixed(0)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-slate-600 font-medium">Delivery</p>
                    <p className="text-lg font-bold text-slate-900">
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-slate-600 font-medium">Tax (5%)</p>
                    <p className="text-lg font-bold text-slate-900">
                      ₹{tax.toFixed(0)}
                    </p>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-blue-50 to-slate-50 p-4 rounded-xl mb-6 border-2 border-blue-200">
                  <p className="text-slate-600 font-medium mb-2">
                    Total Amount
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    ₹{total.toFixed(0)}
                  </p>
                </div>

                {/* Checkout Button */}
                <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl mb-3 transition-all transform hover:scale-105 shadow-lg">
                  ✓ Proceed to Checkout
                </button>

                {/* Continue Shopping */}
                <button
                  className="w-full py-3 border-2 border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 font-bold rounded-xl transition-all"
                  onClick={() => router.push("/")}
                >
                  Continue Shopping
                </button>

                {/* Promo Code */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-sm text-slate-600 mb-3 font-medium">
                    Have a promo code?
                  </p>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      placeholder="Enter code"
                      type="text"
                    />
                    <button className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
