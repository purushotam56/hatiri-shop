"use client";

import { Button } from "@heroui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { icon: "🏠", label: "Home", href: "/" },
    { icon: "🔍", label: "Search", href: "/products" },
    { icon: "❤️", label: "Saved", href: "/account?tab=saved" },
    { icon: "👤", label: "Account", href: "/account" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-default-200 border-t border-default-200 z-40 md:hidden">
      <div className="grid grid-cols-4 gap-1 p-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href === "/" && pathname === "/");

          return (
            <Link key={item.href} href={item.href}>
              <Button
                isIconOnly
                className={`w-full h-16 flex flex-col items-center justify-center gap-1 ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-transparent text-default-600"
                }`}
                variant="flat"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-semibold">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
