"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@heroui/navbar";
import { Avatar } from "@heroui/avatar";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Link } from "@heroui/link";

interface SellerHeaderProps {
  sellerName?: string;
  sellerEmail?: string;
  storeName?: string;
  onSwitchStore?: () => void;
  orgId?: string;
}

export function SellerHeader({
  sellerName = "Seller",
  sellerEmail = "seller@hatiri.com",
  storeName = "My Store",
  onSwitchStore,
  orgId,
}: SellerHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { label: "Dashboard", href: orgId ? `/seller/${orgId}/dashboard` : "/seller/dashboard" },
    { label: "Products", href: orgId ? `/seller/${orgId}/products` : "/seller/products" },
    { label: "Stock", href: orgId ? `/seller/${orgId}/stock` : "/seller/stock" },
    { label: "Orders", href: orgId ? `/seller/${orgId}/orders` : "/seller/orders" },
    { label: "Customers", href: orgId ? `/seller/${orgId}/customers` : "/seller/customers" },
    { label: "Settings", href: orgId ? `/seller/${orgId}/settings` : "/seller/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerUser");
    localStorage.removeItem("selectedSellerStore");
    localStorage.removeItem("sellerStores");
    window.location.href = "/seller";
  };

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 backdrop-blur-md shadow-lg"
      maxWidth="full"
    >
      {/* Mobile Menu Toggle */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Mobile Brand */}
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <div className="flex items-center gap-2">
            <div className="text-2xl">📊</div>
            <div className="font-bold text-white">Seller</div>
          </div>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Brand with Store Info */}
      <NavbarContent className="hidden sm:flex gap-2" justify="start">
        <NavbarBrand>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <div className="text-xl">📊</div>
            </div>
            <div className="flex flex-col">
              <p className="font-bold text-white text-lg">Seller Panel</p>
              <p className="text-xs text-warning-200">Manage Your Business</p>
            </div>
          </div>
        </NavbarBrand>
      </NavbarContent>

      {/* Store Info Badge */}
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              </svg>
              <span className="text-sm font-semibold text-white">{storeName}</span>
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            </div>
          </div>
        </div>
      </NavbarContent>

      {/* Navigation Links */}
      <NavbarContent className="hidden lg:flex gap-1" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.label}>
            <Link
              href={item.href}
              className="text-white hover:text-warning-200 hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Right Side - Actions */}
      <NavbarContent justify="end" className="gap-2">
        {/* Switch Store Button */}
        <NavbarItem className="hidden sm:flex">
          <Button
            isIconOnly
            variant="light"
            className="text-white hover:bg-white/20 transition-colors"
            onPress={onSwitchStore}
            title="Switch Store"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7a4 4 0 100 8 4 4 0 000-8zM6 21h12a2 2 0 002-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </Button>
        </NavbarItem>

        {/* User Dropdown */}
        <NavbarItem className="hidden sm:flex">
          <Dropdown>
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform hover:scale-110"
                color="success"
                name={sellerName.charAt(0).toUpperCase()}
                size="sm"
                src=""
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Seller Actions"
              closeOnSelect={false}
              variant="faded"
            >
              <DropdownItem
                key="user-info"
                isReadOnly
                textValue="User Info"
                className="h-14 gap-2 opacity-100 cursor-default"
              >
                <div>
                  <p className="font-semibold text-foreground">{sellerName}</p>
                  <p className="text-xs text-foreground/60">{sellerEmail}</p>
                </div>
              </DropdownItem>
              <DropdownItem
                key="switch-store"
                textValue="Switch Store"
                onPress={onSwitchStore}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7a4 4 0 100 8 4 4 0 000-8zM6 21h12a2 2 0 002-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Switch Store
                </div>
              </DropdownItem>
              <DropdownItem
                key="settings"
                textValue="Settings"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </div>
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onPress={handleLogout}
                textValue="Logout"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="gap-4 p-4">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link href={item.href} className="w-full text-foreground font-medium">
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
          <Button
            onPress={onSwitchStore}
            className="w-full"
            variant="flat"
            color="primary"
          >
            Switch Store
          </Button>
          <Button
            onPress={handleLogout}
            className="w-full"
            color="danger"
            variant="flat"
          >
            Logout
          </Button>
        </div>
      </NavbarMenu>
    </Navbar>
  );
}
