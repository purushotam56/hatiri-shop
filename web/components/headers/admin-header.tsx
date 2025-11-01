"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@heroui/navbar";
import { Avatar } from "@heroui/avatar";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";

interface AdminHeaderProps {
  userName?: string;
  userEmail?: string;
}

export function AdminHeader({ userName = "Admin", userEmail = "admin@hatiri.com" }: AdminHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Organisations", href: "/admin/dashboard" },
    { label: "Categories", href: "/admin/dashboard" },
    { label: "Reports", href: "/admin/dashboard" },
    { label: "Settings", href: "/admin/dashboard" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.location.href = "/admin";
  };

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-gradient-to-r from-red-600 to-red-700 backdrop-blur-sm"
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
                name={userName}
                size="sm"
                src=""
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Admin Actions"
              closeOnSelect={false}
            >
              <DropdownItem
                key="user-info"
                isReadOnly
                textValue="User Info"
                className="h-14 gap-2 opacity-100 cursor-default"
              >
                <p className="font-semibold">{userName}</p>
                <p className="text-xs text-foreground/60">{userEmail}</p>
              </DropdownItem>
              <DropdownItem
                key="profile"
                textValue="Profile"
              >
                Profile Settings
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
