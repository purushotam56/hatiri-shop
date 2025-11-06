"use client";

import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useAddress } from "@/context/address-context";
import { apiEndpoints } from "@/lib/api-client";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { setUser } = useAuth();
  const { syncCart } = useCart();
  const { syncAddresses } = useAddress();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiEndpoints.login({ email, password });

      if (data.user) {
        // Store token first
        if (typeof window !== "undefined") {
          localStorage.setItem("token", data.token);
        }

        // Set user to update auth context (this triggers useEffect in cart/address context)
        setUser(data.user);

        // Sync cart and addresses from local storage to backend
        try {
          await Promise.all([syncCart(), syncAddresses()]);
        } catch (syncErr) {
          console.warn("Sync warning:", syncErr);
          // Don't fail login if sync fails, just warn
        }

        setEmail("");
        setPassword("");
        onClose();
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Login</ModalHeader>
        <ModalBody>
          {error && (
            <div className="bg-danger/10 text-danger px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              isRequired
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              isRequired
            />
          </div>
          <p className="text-center text-sm text-foreground/60">
            Don't have an account?{" "}
            <button className="text-primary font-semibold hover:underline">
              Sign up
            </button>
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={() => handleSubmit()}
            isLoading={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
