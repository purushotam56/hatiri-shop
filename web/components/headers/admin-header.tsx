"use client";

import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
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
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { useAdmin } from "@/context/admin-context";

interface AdminHeaderProps {
  userName?: string;
  userEmail?: string;
}

export function AdminHeader({
  userName: propName,
  userEmail: propEmail,
}: AdminHeaderProps) {
  const router = useRouter();
  const { adminUser, clearAdmin } = useAdmin();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const displayName = propName || adminUser?.fullName || "Admin";
  const displayEmail = propEmail || adminUser?.email || "admin@hatiri.com";

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Organizations", href: "/admin/organizations" },
    { label: "Sellers", href: "/admin/sellers" },
    { label: "Orders", href: "/admin/orders" },
    { label: "Products", href: "/admin/products" },
    { label: "Settings", href: "/admin/settings" },
  ];

  const handleLogout = () => {
    clearAdmin();
    router.push("/admin");
  };

  return (
    <Navbar
      isBordered
      className="bg-gradient-to-r from-red-600 to-red-700 backdrop-blur-sm"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <div className="font-bold text-xl text-white">⚙️ Admin Panel</div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarBrand>
          <div className="font-bold text-xl text-white">⚙️ Admin Panel</div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.label}>
            <Link
              className="text-white hover:text-gray-200 transition-colors text-sm"
              href={item.href}
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
                name={displayName}
                size="sm"
                src=""
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Admin Actions" closeOnSelect={false}>
              <DropdownItem
                key="user-info"
                isReadOnly
                className="h-14 gap-2 opacity-100 cursor-default"
                textValue="User Info"
              >
                <p className="font-semibold">{displayName}</p>
                <p className="text-xs text-foreground/60">{displayEmail}</p>
              </DropdownItem>
              <DropdownItem key="profile" textValue="Profile">
                Profile Settings
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                textValue="Logout"
                onPress={handleLogout}
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
            <Link className="w-full text-foreground" href={item.href}>
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Button
            className="w-full mt-4"
            color="danger"
            variant="flat"
            onPress={handleLogout}
          >
            Logout
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
