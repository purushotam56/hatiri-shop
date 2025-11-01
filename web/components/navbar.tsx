"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useState } from "react";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon, Logo } from "@/components/icons";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const searchInput = (
    <Input
      aria-label="Search products"
      classNames={{
        inputWrapper: "bg-default-100 h-9",
        input: "text-sm",
      }}
      placeholder="Search items..."
      startContent={<SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />}
      type="search"
      size="sm"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );

  return (
    <HeroUINavbar
      maxWidth="full"
      position="sticky"
      className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 z-50"
    >
      {/* Mobile Layout */}
      <NavbarContent className="md:hidden basis-1 pl-0" justify="start">
        <NavbarBrand as="li" className="gap-1 max-w-fit pr-2">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-sm text-primary">Hatiri</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="md:hidden basis-1 pl-2 pr-0" justify="end">
        <Button
          isIconOnly
          className="bg-default-100 text-default-600"
          radius="full"
          size="sm"
          variant="flat"
        >
          🔍
        </Button>
        <Button
          isIconOnly
          className="bg-default-100 text-default-600"
          radius="full"
          size="sm"
          variant="flat"
        >
          🛒
        </Button>
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Desktop Layout */}
      <NavbarContent className="hidden md:flex basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-2 max-w-fit">
          <NextLink className="flex justify-start items-center gap-2" href="/">
            <Logo />
            <p className="font-bold text-lg text-primary">Hatiri</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-6 justify-start ml-4">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "text-sm font-medium data-[active=true]:text-primary data-[active=true]:font-semibold"
                )}
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent className="hidden md:flex basis-1/5 md:basis-full" justify="end">
        <NavbarItem className="hidden md:flex w-full max-w-xs">
          {searchInput}
        </NavbarItem>
        <NavbarItem className="hidden md:flex gap-3">
          <ThemeSwitch />
          <Button
            as={Link}
            className="bg-primary text-white font-semibold"
            href="/cart"
            radius="full"
            size="sm"
            variant="shadow"
          >
            🛒 Cart
          </Button>
          <Button
            as={Link}
            className="bg-default-100 text-default-600"
            href="/login"
            radius="full"
            size="sm"
            variant="flat"
          >
            Sign in
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        <div className="mx-4 py-2 flex flex-col gap-2">
          {searchInput}
        </div>
        <div className="mx-4 mt-4 flex flex-col gap-3 border-t pt-4">
          {siteConfig.navItems.map((item, index) => (
            <NavbarMenuItem key={`${item.href}-${index}`}>
              <Link
                color={index === siteConfig.navItems.length - 1 ? "danger" : "foreground"}
                as={NextLink}
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem>
            <Link
              color="foreground"
              as={NextLink}
              href="/orders"
              size="lg"
            >
              📦 Orders
            </Link>
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
