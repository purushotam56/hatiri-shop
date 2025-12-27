"use client";

import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import React, { useState } from "react";

import { LoginModal } from "@/components/login-modal";
import { useAuth } from "@/context/auth-context";

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
        className="bg-background/95 backdrop-blur-sm"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
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
              <Link
                className="text-foreground hover:text-primary transition-colors"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end">
          {isLoggedIn && user ? (
            <>
              <NavbarItem className="hidden sm:flex gap-2">
                <span className="text-sm font-medium text-foreground">
                  {user.name || user.email}
                </span>
                <Button
                  as={Link}
                  className="text-sm"
                  color="primary"
                  href="/orders"
                  variant="flat"
                >
                  📦 Orders
                </Button>
                <Button className="text-sm" variant="light" onPress={logout}>
                  Logout
                </Button>
              </NavbarItem>
            </>
          ) : (
            <NavbarItem>
              <Button
                className="text-sm"
                color="primary"
                onPress={() => setShowLoginModal(true)}
              >
                Sign In
              </Button>
            </NavbarItem>
          )}
        </NavbarContent>

        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link className="w-full" href={item.href}>
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          {!isLoggedIn && (
            <NavbarMenuItem>
              <Button
                className="w-full mt-4"
                color="primary"
                onPress={() => {
                  setShowLoginModal(true);
                  setIsMenuOpen(false);
                }}
              >
                Sign In
              </Button>
            </NavbarMenuItem>
          )}
        </NavbarMenu>
      </Navbar>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
