"use client";

import { useCart } from "@/context/cart-context";
import { useState } from "react";
import { CheckoutModal } from "./checkout-modal";
import { Button } from "@heroui/button";
import { Badge } from "@heroui/badge";
import { Divider } from "@heroui/divider";
import { Card, CardBody } from "@heroui/card";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Image } from "@heroui/image";

export function CartSidebar() {
  const { cart, removeFromCart, updateQuantity, cartCount, cartTotal } =
    useCart();
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      {/* Cart Button with Badge */}
      <Badge 
        content={cartCount}
        color="danger"
        shape="circle"
        className="text-xs"
      >
        <Button
          isIconOnly
          onClick={() => setShowCart(!showCart)}
          className="text-lg"
          variant="flat"
          size="sm"
        >
          🛒
        </Button>
      </Badge>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed right-0 top-0 w-full md:w-96 bg-background rounded-l-lg shadow-2xl h-screen max-h-screen flex flex-col z-50 border-l border-divider">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-divider">
            <h2 className="text-lg md:text-xl font-bold text-foreground">🛒 Cart</h2>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onClick={() => setShowCart(false)}
            >
              ✕
            </Button>
          </div>

          {cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <Card className="max-w-sm w-full mx-4">
                <CardBody className="gap-4 py-8 text-center items-center">
                  <div className="text-5xl">🛍️</div>
                  <div>
                    <p className="text-foreground font-semibold mb-1">Empty Cart</p>
                    <p className="text-foreground/60 text-sm">Add items to get started!</p>
                  </div>
                </CardBody>
              </Card>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <ScrollShadow hideScrollBar className="flex-1 overflow-y-auto">
                <div className="space-y-3 p-4 md:p-6">
                  {cart.map((item) => (
                    <Card key={item.id} className="border border-divider">
                      <CardBody className="gap-3 p-3">
                        <div className="flex gap-3">
                          {/* Product Image */}
                          {(item as any).bannerImage?.url || (item as any).image?.url || (item as any).images?.[0]?.upload?.url ? (
                            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-default-100">
                              <Image
                                src={(item as any).bannerImage?.url || (item as any).image?.url || (item as any).images?.[0]?.upload?.url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-default-100 flex items-center justify-center text-2xl">
                              📦
                            </div>
                          )}
                          
                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-foreground text-sm line-clamp-2">
                                  {item.name}
                                </p>
                                <p className="text-sm text-primary font-bold mt-1">
                                  ₹{parseFloat(String(item.price)).toFixed(0)}
                                </p>
                              </div>
                              <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                                className="text-danger flex-shrink-0"
                              >
                                ✕
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-default-100 rounded-md p-1 border border-divider">
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="flex-1"
                          >
                            −
                          </Button>
                          <span className="flex-1 text-center font-bold text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="flex-1"
                          >
                            +
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </ScrollShadow>

              {/* Footer */}
              <div className="p-4 md:p-6 border-t border-divider space-y-3">
                <Divider />

                {/* Summary */}
                <div className="flex justify-between items-center">
                  <span className="text-foreground/60 font-medium text-sm">Total:</span>
                  <span className="text-lg md:text-xl font-bold text-primary">
                    ₹{cartTotal.toFixed(0)}
                  </span>
                </div>

                {/* Checkout Button */}
                <Button
                  onPress={() => setShowCheckout(true)}
                  className="w-full"
                  color="primary"
                  size="lg"
                >
                  Checkout
                </Button>

                {/* Continue Shopping */}
                <Button
                  onPress={() => setShowCart(false)}
                  className="w-full"
                  variant="bordered"
                  size="md"
                >
                  Continue Shopping
                </Button>
              </div>
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
