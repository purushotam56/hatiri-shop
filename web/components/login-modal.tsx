"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import React, { useState } from "react";

import { useAddress } from "@/context/address-context";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { apiEndpoints } from "@/lib/api-client";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { setUser } = useAuth();
  const { syncCart } = useCart();
  const { syncAddresses } = useAddress();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        // Login flow
        const data = await apiEndpoints.login({ email, password });

        if (data.user) {
          // Store token first
          if (typeof window !== "undefined") {
            localStorage.setItem("token", data.token);
          }

          // Set user to update auth context
          setUser(data.user);

          // Sync cart and addresses
          try {
            await Promise.all([syncCart(), syncAddresses()]);
          } catch (syncErr) {
            console.error("Sync error:", syncErr);
          }

          setEmail("");
          setPassword("");
          onClose();
        } else {
          setError(data.message || "Login failed");
        }
      } else {
        // Signup flow
        if (!email || !phone || !password || !confirmPassword) {
          setError("All fields are required");

          return;
        }

        if (password !== confirmPassword) {
          setError("Passwords do not match");

          return;
        }

        if (password.length < 6) {
          setError("Password must be at least 6 characters");

          return;
        }

        const data = await apiEndpoints.register({
          email,
          phone,
          password,
        });

        if (data.user) {
          // Store token first
          if (typeof window !== "undefined") {
            localStorage.setItem("token", data.token);
          }

          // Set user to update auth context
          setUser(data.user);

          // Sync cart and addresses
          try {
            await Promise.all([syncCart(), syncAddresses()]);
          } catch (syncErr) {
            console.error("Sync error:", syncErr);
          }

          setEmail("");
          setPhone("");
          setPassword("");
          setConfirmPassword("");
          onClose();
        } else {
          setError(data.message || "Signup failed");
        }
      }
    } catch (err) {
      setError(
        mode === "login"
          ? "Login failed. Please try again."
          : "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} size="md" onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {mode === "login" ? "Login" : "Sign Up"}
        </ModalHeader>
        <ModalBody>
          {error && (
            <div className="bg-danger/10 text-danger px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            {mode === "signup" && (
              <Input
                isRequired
                label="Phone Number"
                placeholder="Your mobile number"
                type="tel"
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPhone(e.target.value)
                }
              />
            )}
            <Input
              isRequired
              label="Email"
              placeholder="your@email.com"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
            <Input
              isRequired
              label="Password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
            {mode === "signup" && (
              <Input
                isRequired
                label="Confirm Password"
                placeholder="••••••••"
                type="password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
              />
            )}
          </div>
          <p className="text-center text-sm text-foreground/60">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  className="text-primary font-semibold hover:underline"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  className="text-primary font-semibold hover:underline"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                >
                  Login
                </button>
              </>
            )}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            isLoading={loading}
            onPress={() => handleSubmit()}
          >
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Signing up..."
              : mode === "login"
                ? "Login"
                : "Sign Up"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
