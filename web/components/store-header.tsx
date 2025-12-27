"use client";

import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Input } from "@heroui/input";
import Link from "next/link";
import React, { useState } from "react";

import { CartSidebar } from "./cart-sidebar";
import { LoginModal } from "./login-modal";

import { useAuth } from "@/context/auth-context";

interface StoreHeaderProps {
  storeCode?: string;
  storeName?: string;
  logoUrl?: string;
}

export function StoreHeader({
  storeCode = "",
  storeName = "",
  logoUrl = "",
}: StoreHeaderProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const displayName = storeName || storeCode;

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-divider">
      <div className="w-full px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-2 min-w-fit">
            {logoUrl && logoUrl.trim() ? (
              <img
                alt={displayName}
                className="w-8 sm:w-10 h-8 sm:h-10 object-contain rounded"
                src={logoUrl}
                onError={(e) => {
                  // If image fails to load, hide it
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <Avatar
                className="text-primary"
                classNames={{
                  base: "w-8 sm:w-10 h-8 sm:h-10 bg-primary/10",
                  name: "text-xs sm:text-sm font-bold",
                }}
                name={displayName}
                size="sm"
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
            className="flex-1 max-w-sm hidden sm:block"
            classNames={{
              mainWrapper: "h-8",
            }}
            placeholder="Search products..."
            size="sm"
            type="text"
          />

          {/* Right Section - Login/User + Orders + Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isLoggedIn && user ? (
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    className="hidden sm:flex"
                    radius="full"
                    variant="light"
                  >
                    <Avatar
                      className="text-sm bg-primary/20"
                      name={user.name || user.email}
                      size="sm"
                    />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions" closeOnSelect={false}>
                  <DropdownItem
                    key="user-info"
                    isReadOnly
                    className="h-14 gap-2 opacity-100 cursor-default"
                    textValue="User Info"
                  >
                    <p className="font-semibold text-sm">
                      {user.name || user.email}
                    </p>
                    <p className="text-xs text-foreground/60">{user.email}</p>
                  </DropdownItem>
                  <DropdownItem key="orders" textValue="Orders">
                    <Link className="w-full" href="/orders">
                      📦 My Orders
                    </Link>
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    textValue="Logout"
                    onPress={logout}
                  >
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Button
                className="hidden sm:flex text-xs sm:text-sm"
                color="primary"
                size="sm"
                variant="flat"
                onPress={() => setShowLoginModal(true)}
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
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </header>
  );
}
