"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@heroui/navbar";
import { Avatar } from "@heroui/avatar";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Link } from "@heroui/link";
import { Badge } from "@heroui/badge";

interface SellerHeaderProps {
  sellerName?: string;
  sellerEmail?: string;
  storeName?: string;
}

export function SellerHeader({
  sellerName = "Seller",
  sellerEmail = "seller@hatiri.com",
  storeName = "My Store",
}: SellerHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { label: "Dashboard", href: "/seller/[id]/dashboard" },
    { label: "Products", href: "/seller/[id]/products" },
    { label: "Orders", href: "/seller/[id]/orders" },
    { label: "Customers", href: "/seller/[id]/customers" },
    { label: "Analytics", href: "/seller/[id]/analytics" },
    { label: "Settings", href: "/seller/[id]/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerUser");
    window.location.href = "/seller";
  };

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-gradient-to-r from-blue-600 to-blue-700 backdrop-blur-sm"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <div className="font-bold text-lg text-white">📊 Seller Panel</div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarBrand>
          <div className="font-bold text-xl text-white">📊 Seller Panel</div>
        </NavbarBrand>
        <Badge content="PRO" color="success" size="lg" className="ml-2">
          <span className="text-white text-sm font-medium">{storeName}</span>
        </Badge>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.label}>
            <Link
              href={item.href}
              className="text-white hover:text-gray-200 transition-colors text-sm"
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          <Dropdown>
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={sellerName}
                size="sm"
                src=""
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Seller Actions"
              closeOnSelect={false}
            >
              <DropdownItem
                key="user-info"
                isReadOnly
                textValue="User Info"
                className="h-14 gap-2 opacity-100 cursor-default"
              >
                <p className="font-semibold">{sellerName}</p>
                <p className="text-xs text-foreground/60">{sellerEmail}</p>
              </DropdownItem>
              <DropdownItem
                key="profile"
                textValue="Profile"
              >
                Profile Settings
              </DropdownItem>
              <DropdownItem
                key="store"
                textValue="Store Settings"
              >
                Store Settings
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onPress={handleLogout}
                textValue="Logout"
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link href={item.href} className="w-full text-foreground">
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Button
            onPress={handleLogout}
            className="w-full mt-4"
            color="danger"
            variant="flat"
          >
            Logout
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
