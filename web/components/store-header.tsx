"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { LoginModal } from "./login-modal";
import { CartSidebar } from "./cart-sidebar";

interface StoreHeaderProps {
  storeCode: string;
}

export function StoreHeader({ storeCode }: StoreHeaderProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-divider">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-2 min-w-fit">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              {storeCode.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-sm text-foreground">
                {storeCode}
              </h1>
              <p className="text-xs text-foreground/60 font-medium">
                ⚡ 10 mins
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-sm hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-2 rounded-lg bg-default-100 border border-divider text-foreground placeholder-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
              />
            </div>
          </div>

          {/* Right Section - Login/User + Orders + Cart */}
          <div className="flex items-center gap-3">
            {isLoggedIn && user ? (
              <div className="hidden sm:flex gap-2 items-center">
                <span className="text-sm font-medium text-foreground">
                  {user.name || user.email}
                </span>
                <Link href="/orders">
                  <Button
                    className="bg-default-100 text-default-600"
                    radius="full"
                    size="sm"
                    variant="flat"
                  >
                    📦 Orders
                  </Button>
                </Link>
                <Button
                  className="bg-default-100 text-default-600"
                  onPress={logout}
                  radius="full"
                  size="sm"
                  variant="flat"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                className="hidden sm:flex bg-default-100 text-default-600"
                onPress={() => setShowLoginModal(true)}
                radius="full"
                size="sm"
                variant="flat"
              >
                Sign in
              </Button>
            )}

            {/* Cart Button */}
            <CartSidebar />
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </header>
  );
}
