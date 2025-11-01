"use client";

import { useCart } from "@/context/cart-context";
import { useState } from "react";
import { CheckoutModal } from "./checkout-modal";

export function CartSidebar() {
  const { cart, removeFromCart, updateQuantity, cartCount, cartTotal } =
    useCart();
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setShowCart(!showCart)}
        className="relative px-4 py-2 rounded-lg font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-all flex items-center gap-2 whitespace-nowrap text-sm md:text-base"
      >
        🛒 Cart
        {cartCount > 0 && (
          <span className="ml-1 bg-danger text-background px-2 py-0.5 rounded-full text-xs font-bold">
            {cartCount}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed right-0 top-0 w-full md:w-96 bg-background rounded-l-lg shadow-2xl p-4 md:p-6 h-screen max-h-screen overflow-y-auto border-l border-divider z-50">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-divider md:mb-6 md:pb-4">
            <h2 className="text-lg md:text-xl font-bold text-foreground">🛒 Cart</h2>
            <button
              onClick={() => setShowCart(false)}
              className="text-foreground/60 hover:text-foreground text-xl font-bold"
            >
              ✕
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">🛍️</div>
              <p className="text-foreground font-semibold mb-1">Empty Cart</p>
              <p className="text-foreground/60 text-sm">Add items to get started!</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-3 mb-4 md:mb-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-default-50 rounded-lg p-3 border border-divider hover:border-primary transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-sm line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-sm text-primary font-bold mt-1">
                          ₹{parseFloat(String(item.price)).toFixed(0)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-danger hover:text-danger/80 font-bold text-sm ml-2 flex-shrink-0"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 bg-default-100 rounded-md p-1 border border-divider">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-2 py-1 text-foreground/60 hover:bg-default-200 font-bold text-sm flex-1"
                      >
                        −
                      </button>
                      <span className="px-2 py-1 text-foreground flex-1 text-center font-bold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-2 py-1 text-foreground/60 hover:bg-default-200 font-bold text-sm flex-1"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-divider my-4 md:my-6"></div>

              {/* Summary */}
              <div className="space-y-3 mb-4 md:mb-6">
                <div className="flex justify-between text-foreground/60 font-medium text-sm">
                  <span>Total:</span>
                  <span className="text-lg md:text-xl font-bold text-primary">
                    ₹{cartTotal.toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={() => setShowCheckout(true)}
                className="w-full bg-primary text-primary-foreground py-2.5 md:py-3 rounded-lg font-bold transition-all hover:bg-primary/90 text-sm md:text-base">
                Checkout
              </button>

              {/* Continue Shopping */}
              <button
                onClick={() => setShowCart(false)}
                className="w-full mt-3 border border-divider text-foreground hover:bg-default-100 py-2 md:py-2.5 rounded-lg font-semibold text-sm md:text-base"
              >
                Continue
              </button>
            </>
          )}
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={showCheckout} 
        onClose={() => {
          setShowCheckout(false);
          setShowCart(false);
        }} 
      />
    </>
  );
}
