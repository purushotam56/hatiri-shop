"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@heroui/navbar";
import { Link } from "@heroui/link";
import { useAuth } from "@/context/auth-context";
import { LoginModal } from "@/components/login-modal";

export function LandingHeader() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <>
      <Navbar
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className="bg-background/95 backdrop-blur-sm"
      >
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle />
        </NavbarContent>

        <NavbarContent className="sm:hidden pr-3" justify="center">
          <NavbarBrand>
            <div className="font-bold text-xl text-primary">🛍️ Hatiri</div>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="start">
          <NavbarBrand>
            <div className="font-bold text-xl text-primary">🛍️ Hatiri</div>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {menuItems.map((item) => (
            <NavbarItem key={item.label}>
              <Link href={item.href} className="text-foreground hover:text-primary transition-colors">
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end">
          {isLoggedIn && user ? (
            <>
              <NavbarItem className="hidden sm:flex gap-2">
                <span className="text-sm font-medium text-foreground">{user.name || user.email}</span>
                <Button
                  as={Link}
                  href="/orders"
                  className="text-sm"
                  color="primary"
                  variant="flat"
                >
                  📦 Orders
                </Button>
                <Button
                  onPress={logout}
                  className="text-sm"
                  variant="light"
                >
                  Logout
                </Button>
              </NavbarItem>
            </>
          ) : (
            <NavbarItem>
              <Button
                onPress={() => setShowLoginModal(true)}
                className="text-sm"
                color="primary"
              >
                Sign In
              </Button>
            </NavbarItem>
          )}
        </NavbarContent>

        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link href={item.href} className="w-full">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          {!isLoggedIn && (
            <NavbarMenuItem>
              <Button
                onPress={() => {
                  setShowLoginModal(true);
                  setIsMenuOpen(false);
                }}
                className="w-full mt-4"
                color="primary"
              >
                Sign In
              </Button>
            </NavbarMenuItem>
          )}
        </NavbarMenu>
      </Navbar>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}
