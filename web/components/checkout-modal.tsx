"use client";

import type { Address } from "@/context/address-context";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import React, { useState } from "react";

import { AddressSelector } from "./address-selector";
import { LoginModal } from "./login-modal";

import { useAddress } from "@/context/address-context";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { apiEndpoints } from "@/lib/api-client";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, cartTotal, clearCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const { selectedAddress, setSelectedAddress } = useAddress();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Update login modal visibility when login status changes
  React.useEffect(() => {
    if (!isLoggedIn && isOpen) {
      setShowLoginModal(true);
    } else if (isLoggedIn) {
      setShowLoginModal(false);
    }
  }, [isLoggedIn, isOpen]);

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);

      return;
    }

    if (!selectedAddress || !selectedAddress.id) {
      console.warn("No address selected", selectedAddress);
      setShowAddressSelector(true);

      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token") || "";
      const data = await apiEndpoints.createOrder(
        {
          addressId: selectedAddress.id,
          notes: "",
        },
        token,
      );

      if (!data.order || !data.order.id) {
        throw new Error(data.message || "Failed to create order");
      }

      // Clear cart after successful order - only if order was created
      await clearCart();

      // Show success message and close modal
      alert(`Order created successfully! Order #${data.order.orderNumber}`);
      onClose();
    } catch (err) {
      console.error("Checkout error:", err);
      alert(
        `Checkout failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        scrollBehavior="inside"
        size="2xl"
        onClose={onClose}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Order Summary
          </ModalHeader>
          <ModalBody className="space-y-6">
            {/* Cart Items */}
            <div>
              <h3 className="font-bold text-foreground mb-3">Items</h3>
              <div className="space-y-2">
                {cart.length === 0 ? (
                  <p className="text-foreground/60 text-sm">
                    Your cart is empty
                  </p>
                ) : (
                  cart.map((item) => (
                    <Card key={item.id} className="bg-default-100">
                      <CardBody className="flex flex-row items-center justify-between p-3">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            {item.name}
                          </p>
                          <p className="text-xs text-foreground/60">
                            Qty: {item.quantity} x {item.price}
                          </p>
                        </div>
                        <p className="font-bold text-foreground">
                          ₹{(item.quantity * item.price).toFixed(0)}
                        </p>
                      </CardBody>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Address Selection */}
            {isLoggedIn && (
              <div>
                <h3 className="font-bold text-foreground mb-3">
                  Delivery Address
                </h3>
                {selectedAddress ? (
                  <Card
                    isPressable
                    className="bg-default-100 border border-primary"
                    onClick={() => setShowAddressSelector(true)}
                  >
                    <CardBody className="p-4">
                      <p className="font-semibold text-foreground">
                        {(selectedAddress.label as string) || (selectedAddress.fullName as string) || ""}
                      </p>
                      <p className="text-sm text-foreground/70">
                        {(selectedAddress.street as string) || ""}
                      </p>
                      <p className="text-sm text-foreground/70">
                        {(selectedAddress.city as string) || ""}, {(selectedAddress.state as string) || ""}{" "}
                        {(selectedAddress.pincode as string) || ""}
                      </p>
                      <p className="text-xs text-primary mt-1">
                        Click to change
                      </p>
                    </CardBody>
                  </Card>
                ) : (
                  <Button
                    fullWidth
                    variant="bordered"
                    onPress={() => setShowAddressSelector(true)}
                  >
                    + Select Address
                  </Button>
                )}
              </div>
            )}

            {/* Order Total */}
            <Card className="bg-primary/10">
              <CardBody className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-foreground/70">Subtotal</p>
                  <p className="text-foreground font-semibold">
                    ₹{cartTotal.toFixed(0)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-foreground/70">Delivery</p>
                  <p className="text-foreground font-semibold">Free</p>
                </div>
                <Divider className="my-1" />
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-foreground">Total</p>
                  <p className="text-2xl font-bold text-primary">
                    ₹{cartTotal.toFixed(0)}
                  </p>
                </div>
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter className="flex flex-col gap-2">
            {!isLoggedIn && (
              <p className="text-sm text-foreground/60 text-center w-full">
                Please login to continue
              </p>
            )}
            <Button
              fullWidth
              color="primary"
              isDisabled={isProcessing || cart.length === 0}
              isLoading={isProcessing}
              onPress={handleCheckout}
            >
              {isLoggedIn ? "Place Order" : "Continue to Login"}
            </Button>
            <Button fullWidth variant="bordered" onPress={onClose}>
              Continue Shopping
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          if (isLoggedIn) {
            setShowAddressSelector(true);
          }
        }}
      />

      {/* Address Selector */}
      <AddressSelector
        isOpen={showAddressSelector}
        onClose={() => setShowAddressSelector(false)}
        onSelect={(address: Address) => setSelectedAddress(address)}
      />
    </>
  );
}
