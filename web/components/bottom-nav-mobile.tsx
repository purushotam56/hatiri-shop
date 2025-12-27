"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const BottomNavMobile = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;

    return false;
  };

  const navItems = [
    { href: "/", label: "Shop", icon: "🏪" },
    { href: "/search", label: "Search", icon: "🔍" },
    { href: "/cart", label: "Cart", icon: "🛒" },
    { href: "/account", label: "Account", icon: "👤" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 z-40">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <Link
            key={item.href}
            className={`flex-1 flex flex-col items-center justify-center py-3 text-xs gap-1 transition-colors ${
              isActive(item.href)
                ? "text-primary"
                : "text-default-600 hover:text-default-900"
            }`}
            href={item.href}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
