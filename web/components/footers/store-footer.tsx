"use client";

import { Button } from "@heroui/button";

export function StoreFooter({
  storeCode,
  storeName,
}: {
  storeCode?: string;
  storeName?: string;
}) {
  const displayName = storeName || storeCode || "Hatiri";

  return (
    <footer className="bg-background border-t border-divider mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-foreground/60 gap-4">
          <p>&copy; 2025 {displayName} Store. All rights reserved.</p>
          <div className="flex gap-4">
            <Button
              as="a"
              className="text-foreground/60"
              href="/about"
              size="sm"
              variant="light"
            >
              About
            </Button>
            <Button
              as="a"
              className="text-foreground/60"
              href="/contact"
              size="sm"
              variant="light"
            >
              Contact
            </Button>
            <Button
              as="a"
              className="text-foreground/60"
              href="#"
              size="sm"
              variant="light"
            >
              Privacy
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
