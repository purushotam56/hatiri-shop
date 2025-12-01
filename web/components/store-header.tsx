"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { LoginModal } from "./login-modal";
import { CartSidebar } from "./cart-sidebar";

interface StoreHeaderProps {
  storeCode?: string;
  storeName?: string;
  logoUrl?: string;
}

export function StoreHeader({ storeCode = "", storeName = "", logoUrl = "" }: StoreHeaderProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const displayName = storeName || storeCode;
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('StoreHeader props:', { storeCode, storeName, logoUrl, hasTrimmedUrl: !!logoUrl?.trim() });
  }

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-divider">
      <div className="w-full px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-2 min-w-fit">
            {logoUrl && logoUrl.trim() ? (
              <img
                src={logoUrl}
                alt={displayName}
                className="w-8 sm:w-10 h-8 sm:h-10 object-contain rounded"
                onError={(e) => {
                  // If image fails to load, hide it
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <Avatar
                name={displayName}
                size="sm"
                classNames={{
                  base: "w-8 sm:w-10 h-8 sm:h-10 bg-primary/10",
                  name: "text-xs sm:text-sm font-bold",
                }}
                className="text-primary"
              />
            )}
            <div className="hidden sm:block">
              <h1 className="font-bold text-xs sm:text-sm text-foreground leading-tight">
                {displayName}
              </h1>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile, shown from sm and up */}
          <Input
            isClearable
            type="text"
            placeholder="Search products..."
            className="flex-1 max-w-sm hidden sm:block"
            size="sm"
            classNames={{
              mainWrapper: "h-8",
            }}
          />

          {/* Right Section - Login/User + Orders + Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isLoggedIn && user ? (
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    className="hidden sm:flex"
                    variant="light"
                    radius="full"
                  >
                    <Avatar
                      size="sm"
                      name={user.name || user.email}
                      className="text-sm bg-primary/20"
                    />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="User Actions"
                  closeOnSelect={false}
                >
                  <DropdownItem
                    key="user-info"
                    isReadOnly
                    textValue="User Info"
                    className="h-14 gap-2 opacity-100 cursor-default"
                  >
                    <p className="font-semibold text-sm">{user.name || user.email}</p>
                    <p className="text-xs text-foreground/60">{user.email}</p>
                  </DropdownItem>
                  <DropdownItem
                    key="orders"
                    textValue="Orders"
                  >
                    <Link href="/orders" className="w-full">
                      📦 My Orders
                    </Link>
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    onPress={logout}
                    textValue="Logout"
                  >
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Button
                className="hidden sm:flex text-xs sm:text-sm"
                onPress={() => setShowLoginModal(true)}
                color="primary"
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
