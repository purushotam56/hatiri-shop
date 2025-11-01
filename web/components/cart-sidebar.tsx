"use client";

import { useCart } from "@/context/cart-context";
import { useState } from "react";

export function CartSidebar() {
  const { cart, removeFromCart, updateQuantity, cartCount, cartTotal } =
    useCart();
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setShowCart(!showCart)}
        className="relative px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 whitespace-nowrap"
      >
        🛒 Cart
        {cartCount > 0 && (
          <span className="ml-1 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
            {cartCount}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed right-0 top-0 w-96 bg-white rounded-l-2xl shadow-2xl p-6 h-screen max-h-screen overflow-y-auto border-2 border-slate-200 z-50">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">🛒 Cart</h2>
            <button
              onClick={() => setShowCart(false)}
              className="text-slate-500 hover:text-slate-700 text-2xl font-bold"
            >
              ✕
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">🛍️</div>
              <p className="text-slate-600 font-semibold mb-1">Empty</p>
              <p className="text-slate-500 text-sm">Add items to cart!</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-slate-900 text-sm line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-sm text-slate-600 font-semibold mt-1">
                          ₹{parseFloat(String(item.price)).toFixed(0)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-lg"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-slate-300">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        −
                      </button>
                      <span className="px-3 py-1.5 text-slate-900 flex-1 text-center font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t-2 border-slate-200 my-6"></div>

              {/* Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Total:</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    ₹{cartTotal.toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-full font-bold transition-all hover:scale-105 shadow-lg">
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <button
                onClick={() => setShowCart(false)}
                className="w-full mt-3 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 py-2.5 rounded-full font-semibold"
              >
                Continue
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
