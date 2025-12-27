"use client";

import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { useState } from "react";

import { CheckoutModal } from "./checkout-modal";

import { useCart } from "@/context/cart-context";
import { CartItem } from "@/types";

export function CartSidebar() {
  const { cart, removeFromCart, updateQuantity, cartCount, cartTotal } =
    useCart();
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      {/* Cart Button with Badge */}
      <Badge
        className="text-xs"
        color="danger"
        content={cartCount}
        shape="circle"
      >
        <Button
          isIconOnly
          className="text-lg"
          size="sm"
          variant="flat"
          onClick={() => setShowCart(!showCart)}
        >
          🛒
        </Button>
      </Badge>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed right-0 top-0 w-full md:w-96 bg-background rounded-l-lg shadow-2xl h-screen max-h-screen flex flex-col z-50 border-l border-divider">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-divider">
            <h2 className="text-lg md:text-xl font-bold text-foreground">
              🛒 Cart
            </h2>
            <Button
              isIconOnly
              size="sm"
              variant="light"
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
                    <p className="text-foreground font-semibold mb-1">
                      Empty Cart
                    </p>
                    <p className="text-foreground/60 text-sm">
                      Add items to get started!
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <ScrollShadow hideScrollBar className="flex-1 overflow-y-auto">
                <div className="space-y-3 p-4 md:p-6">
                  {cart.map((item:CartItem) => (
                    <Card key={item.id} className="border border-divider">
                      <CardBody className="gap-3 p-3">
                        <div className="flex gap-3">
                          {/* Product Image */}
                          {(item).bannerImage?.url ? (
                            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-default-100">
                              <Image
                                alt={item.name}
                                className="w-full h-full object-cover"
                                src={
                                  (item).bannerImage?.url
                                }
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
                                {item.productQuantity && item.unit && (
                                  <p className="text-xs text-foreground/60 font-medium mt-0.5">
                                    {item.productQuantity} {item.unit}
                                  </p>
                                )}
                                <p className="text-sm text-primary font-bold mt-1">
                                  ₹{parseFloat(String(item.price)).toFixed(0)}
                                </p>
                              </div>
                              <Button
                                isIconOnly
                                className="text-danger flex-shrink-0"
                                size="sm"
                                variant="light"
                                onClick={() => removeFromCart(item.id)}
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
                            className="flex-1"
                            size="sm"
                            variant="light"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            −
                          </Button>
                          <span className="flex-1 text-center font-bold text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            isIconOnly
                            className="flex-1"
                            size="sm"
                            variant="light"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
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
              <div className="p-4 md:p-6 border-t border-divider space-y-4 bg-default-50">
                {/* Summary */}
                <div className="flex justify-between items-center">
                  <span className="text-foreground/60 font-medium text-sm">
                    Subtotal:
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    ₹{cartTotal.toFixed(0)}
                  </span>
                </div>

                <Divider />

                {/* Action Buttons */}
                <div className="space-y-2.5">
                  {/* Checkout Button - Primary */}
                  <Button
                    className="w-full font-bold text-base h-12"
                    color="primary"
                    size="lg"
                    onPress={() => setShowCheckout(true)}
                  >
                    Proceed to Checkout
                  </Button>

                  {/* Continue Shopping - Secondary */}
                  <Button
                    className="w-full font-semibold text-base h-11"
                    size="lg"
                    variant="bordered"
                    onPress={() => setShowCart(false)}
                  >
                    Continue Shopping
                  </Button>
                </div>
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
