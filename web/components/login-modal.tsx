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
  const [mode, setMode] = useState<'login' | 'signup'>('login');
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
      if (mode === 'login') {
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
            console.log("Starting cart and address sync after login");
            await Promise.all([syncCart(), syncAddresses()]);
            console.log("Sync completed successfully");
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
          password 
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
            console.log("Starting cart and address sync after signup");
            await Promise.all([syncCart(), syncAddresses()]);
            console.log("Sync completed successfully");
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
      setError(mode === 'login' ? "Login failed. Please try again." : "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </ModalHeader>
        <ModalBody>
          {error && (
            <div className="bg-danger/10 text-danger px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            {mode === 'signup' && (
              <Input
                label="Phone Number"
                type="tel"
                placeholder="Your mobile number"
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                isRequired
              />
            )}
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
            {mode === 'signup' && (
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                isRequired
              />
            )}
          </div>
          <p className="text-center text-sm text-foreground/60">
            {mode === 'login' ? (
              <>
                Don't have an account?{" "}
                <button 
                  onClick={() => {
                    setMode('signup');
                    setError("");
                  }}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button 
                  onClick={() => {
                    setMode('login');
                    setError("");
                  }}
                  className="text-primary font-semibold hover:underline"
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
            onPress={() => handleSubmit()}
            isLoading={loading}
          >
            {loading ? (mode === 'login' ? "Logging in..." : "Signing up...") : (mode === 'login' ? "Login" : "Sign Up")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
